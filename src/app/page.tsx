import LeadAgent from "@/components/lead-agent";
import Link from "next/link";

const differentiators = [
  {
    title: "Laser-focused qualification",
    description:
      "Screen prospects with validated contact information and project intent before your team jumps on a call.",
  },
  {
    title: "Conversion-primed scripting",
    description:
      "Conversational prompts guide prospects to share the exact context your designers need to scope winning proposals.",
  },
  {
    title: "Instant internal sync",
    description:
      "Captured leads route straight to your dashboard, ready for your next outreach play within seconds.",
  },
];

const workflow = [
  {
    id: "01",
    title: "Attract",
    description:
      "Embed the agent on landing pages, paid campaigns, or client portals to convert interest into qualified conversations.",
  },
  {
    id: "02",
    title: "Capture",
    description:
      "Our intake flow validates email, phone, and website links while capturing goals, budget, and urgency.",
  },
  {
    id: "03",
    title: "Close",
    description:
      "Route leads to your CRM or action board and follow up with contextual proposals faster than competitors.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 -top-48 h-96 bg-gradient-to-b from-cyan-500/40 via-cyan-500/10 to-transparent blur-3xl" />
        <div className="absolute left-[-10%] top-1/3 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="absolute right-[-14%] top-1/2 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 sm:px-10 lg:px-12">
        <header className="grid gap-10 lg:grid-cols-[1.3fr,1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-cyan-200/80">
              Lead Generation Agent
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Capture high-intent web design prospects around the clock
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Lumen, your AI intake specialist, qualifies every inbound lead —
              validating contact info, gauging project scope, and queuing them
              for instant follow-up by your design team.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#lead-agent"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Launch the capture flow
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-cyan-300/60 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:-translate-y-1 hover:border-cyan-200 hover:text-white"
              >
                View captured leads →
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900 to-slate-950/90 p-8 shadow-2xl shadow-cyan-500/20 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              What makes it agentic?
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">◆</span>
                <span>Conversational prompts matched to buyer intent.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">◆</span>
                <span>Inline validation for email, phone, and website links.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-cyan-300">◆</span>
                <span>
                  Clean handoff into your pipeline for designers and closers.
                </span>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-4 text-xs text-slate-400">
              <p className="font-semibold text-cyan-200">
                Ideal for agencies and studios
              </p>
              <p className="mt-2">
                Drop it into landing pages or campaigns to convert traffic into
                scheduled consultations automatically.
              </p>
            </div>
          </div>
        </header>

        <section id="lead-agent" className="scroll-mt-24">
          <LeadAgent />
        </section>

        <section className="grid gap-10 lg:grid-cols-3">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-100 shadow-xl shadow-cyan-500/10 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-4 text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900 to-slate-950 p-10 shadow-2xl shadow-cyan-500/20 backdrop-blur">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-cyan-200/70">
                Pipeline Momentum
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Built for revenue teams shipping web design
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-slate-300">
                A structured lead workflow keeps your designers focused on what
                they do best — turning insight-rich briefs into high-converting
                experiences.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 text-slate-200">
              <p className="text-4xl font-semibold text-white">24/7</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                Qualified intake coverage
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workflow.map((stage) => (
              <div
                key={stage.id}
                className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 text-slate-100"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-cyan-300/70">
                  {stage.id}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {stage.title}
                </h3>
                <p className="mt-4 text-sm text-slate-300">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-10 text-slate-100 shadow-2xl shadow-cyan-500/20 backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white">
                Plug Lumen into your funnel and close deals faster
              </h2>
              <p className="mt-4 text-sm text-slate-200">
                Embed the agent on landing pages, email drips, or referral
                microsites. Every captured lead lands in your dashboard, ready
                for fast follow-up with tailored web design offers.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#lead-agent"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-1 hover:bg-slate-100"
              >
                Capture your next lead
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:border-white"
              >
                Review pipeline →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
