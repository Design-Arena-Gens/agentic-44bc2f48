import Link from "next/link";
import { readLeads } from "@/lib/leads-store";

export const metadata = {
  title: "Captured Leads | Web Design Growth Agent",
  description:
    "Review every lead captured by the autonomous web design prospecting agent.",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function DashboardPage() {
  const leads = (await readLeads()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
              Lead Control Room
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              Captured Web Design Leads
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-400">
              Each row highlights a prospect captured by the lead generation
              agent. Keep the momentum by following up within 24 hours.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/60 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-white"
          >
            ← Back to agent
          </Link>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
          {leads.length === 0 ? (
            <div className="px-10 py-20 text-center text-slate-300">
              <h2 className="text-xl font-semibold">No leads yet</h2>
              <p className="mt-3 text-sm">
                Launch the agent from the homepage to capture your first web
                design prospect.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="max-h-[60vh] overflow-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/80 text-xs uppercase tracking-widest text-cyan-200/80">
                    <tr>
                      <th className="px-6 py-4 text-left">Name</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Phone</th>
                      <th className="px-6 py-4 text-left">Website</th>
                      <th className="px-6 py-4 text-left">Services</th>
                      <th className="px-6 py-4 text-left">Budget</th>
                      <th className="px-6 py-4 text-left">Captured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm text-slate-200">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="transition hover:bg-cyan-500/10"
                      >
                        <td className="px-6 py-4 font-medium">{lead.name}</td>
                        <td className="px-6 py-4">
                          <a
                            className="text-cyan-300 hover:underline"
                            href={`mailto:${lead.email}`}
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            className="text-cyan-300 hover:underline"
                            href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                          >
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            className="truncate text-cyan-300 hover:underline"
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {lead.website}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {lead.services || <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {lead.budget || <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
