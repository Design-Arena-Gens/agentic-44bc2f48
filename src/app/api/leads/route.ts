import { NextResponse } from "next/server";
import { addLead, readLeads, type LeadSubmission } from "@/lib/leads-store";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 7;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(url.host);
  } catch {
    return false;
  }
}

function sanitizeWebsite(value: string) {
  if (!value) return value;
  return value.startsWith("http") ? value : `https://${value}`;
}

export async function GET() {
  const leads = await readLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<LeadSubmission>;
    const name = payload.name?.trim();
    const email = payload.email?.trim() ?? "";
    const phone = payload.phone?.trim() ?? "";
    const website = payload.website?.trim() ?? "";
    const services = payload.services?.trim();
    const budget = payload.budget?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 422 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 422 },
      );
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Phone number must include at least 7 digits." },
        { status: 422 },
      );
    }
    if (!isValidUrl(website)) {
      return NextResponse.json(
        { error: "Website must be a valid URL." },
        { status: 422 },
      );
    }

    const lead = await addLead({
      name,
      email: email.toLowerCase(),
      phone,
      website: sanitizeWebsite(website),
      services,
      budget,
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Failed to capture lead", error);
    return NextResponse.json(
      { error: "Failed to capture lead." },
      { status: 500 },
    );
  }
}
