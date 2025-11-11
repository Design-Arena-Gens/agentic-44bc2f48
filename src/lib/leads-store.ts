import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const leadsFilePath = path.join(process.cwd(), "data", "leads.json");

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  services?: string;
  budget?: string;
  createdAt: string;
};

export type LeadSubmission = Omit<LeadRecord, "id" | "createdAt">;

async function ensureStore() {
  try {
    await fs.access(leadsFilePath);
  } catch {
    await fs.mkdir(path.dirname(leadsFilePath), { recursive: true });
    await fs.writeFile(leadsFilePath, "[]", "utf8");
  }
}

export async function readLeads(): Promise<LeadRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(leadsFilePath, "utf8");
  try {
    const parsed = JSON.parse(raw) as LeadRecord[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: LeadRecord[]) {
  await ensureStore();
  await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2), "utf8");
}

export async function addLead(submission: LeadSubmission): Promise<LeadRecord> {
  const leads = await readLeads();
  const lead: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...submission,
  };
  leads.push(lead);
  await writeLeads(leads);
  return lead;
}
