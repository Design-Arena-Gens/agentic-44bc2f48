'use client';

import { useMemo, useState } from "react";

type StepKey = "name" | "email" | "phone" | "website" | "services" | "budget";

type Step = {
  key: StepKey;
  prompt: (responses: Partial<Record<StepKey, string>>) => string;
  placeholder: string;
  validator: (value: string) => string | null;
  helper?: string;
  multiline?: boolean;
};

type Message = {
  id: string;
  role: "agent" | "prospect";
  text: string;
};

const steps: Step[] = [
  {
    key: "name",
    prompt: () =>
      "👋 I'm Lumen, your web design lead scout. Who am I meeting with today?",
    placeholder: "Jane Smith, Founder at Bright Studio",
    validator: (value) =>
      value.trim().length < 2 ? "Let's start with your name so I know who I'm helping." : null,
  },
  {
    key: "email",
    prompt: (responses) =>
      `Great to meet you${responses.name ? `, ${responses.name.split(" ")[0]}` : ""}! Which email should I send our web design follow-up to?`,
    placeholder: "you@company.com",
    validator: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? null
        : "Could you drop in a valid email address?",
  },
  {
    key: "phone",
    prompt: () =>
      "Perfect. What's the best phone number in case our designers need to chat live?",
    placeholder: "+1 (555) 123-4567",
    validator: (value) =>
      value.replace(/\D/g, "").length >= 7
        ? null
        : "Phone number should have at least 7 digits.",
  },
  {
    key: "website",
    prompt: () =>
      "Thanks! Drop the current website or project link you'd like us to explore.",
    placeholder: "https://your-site.com",
    validator: (value) => {
      const trimmed = value.trim();
      try {
        const testUrl = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
        return testUrl.host ? null : "Can you share a valid URL?";
      } catch {
        return "Can you share a valid URL?";
      }
    },
  },
  {
    key: "services",
    prompt: () =>
      "What design upgrades are you imagining? Feel free to list features, pain points, or goals.",
    placeholder: "Homepage overhaul, stronger brand visuals, faster load times…",
    validator: (value) =>
      value.trim().length < 8
        ? "Share a bit more detail so we tailor the proposal precisely."
        : null,
    helper: "The more colour you add, the sharper our follow-up recommendations become.",
    multiline: true,
  },
  {
    key: "budget",
    prompt: () =>
      "Last one: do you have a target investment or timeline in mind?",
    placeholder: "Looking to launch within 6 weeks, around $5k budget.",
    validator: () => null,
    helper: "Even a rough range helps us assemble the right squad.",
    multiline: true,
  },
];

const initialMessages: Message[] = [
  {
    id: "msg-intro",
    role: "agent",
    text: "🚀 Welcome! I scout qualified leads so our web design team can deliver modern, conversion-driven sites.",
  },
  {
    id: "msg-cta",
    role: "agent",
    text: "Answer a few quick prompts and I’ll lock in everything we need for the perfect proposal.",
  },
  {
    id: "msg-step-0",
    role: "agent",
    text: steps[0].prompt({}),
  },
];

function createMessage(role: Message["role"], text: string): Message {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    role,
    text,
  };
}

export type CapturedLead = {
  name: string;
  email: string;
  phone: string;
  website: string;
  services?: string;
  budget?: string;
  createdAt: string;
};

export default function LeadAgent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<Partial<Record<StepKey, string>>>(
    {},
  );
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedLead, setCapturedLead] = useState<CapturedLead | null>(null);

  const currentStep = steps[stepIndex];
  const progress = useMemo(() => {
    const completed = Math.min(stepIndex, steps.length);
    return Math.round((completed / steps.length) * 100);
  }, [stepIndex]);

  async function sendToApi(payload: Record<string, string | undefined>) {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? "Lead capture failed.");
    }

    return (await response.json()) as { lead: CapturedLead };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentStep || submitting) return;

    const value = input.trim();
    const validationMessage = currentStep.validator(value);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError(null);

    setMessages((prev) => [...prev, createMessage("prospect", value)]);

    const nextResponses = { ...responses, [currentStep.key]: value };
    setResponses(nextResponses);
    setInput("");

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);

    if (nextIndex < steps.length) {
      const nextPrompt = steps[nextIndex].prompt(nextResponses);
      setTimeout(() => {
        setMessages((prev) => [...prev, createMessage("agent", nextPrompt)]);
      }, 450);
    } else {
      try {
        setSubmitting(true);
        setMessages((prev) => [
          ...prev,
          createMessage(
            "agent",
            "Amazing detail — give me a second to register this lead.",
          ),
        ]);

        const payload = {
          name: nextResponses.name ?? "",
          email: nextResponses.email ?? "",
          phone: nextResponses.phone ?? "",
          website: nextResponses.website ?? "",
          services: nextResponses.services ?? "",
          budget: nextResponses.budget ?? "",
        };

        const { lead } = await sendToApi(payload);
        setCapturedLead(lead);
        setError(null);

        setMessages((prev) => [
          ...prev,
          createMessage(
            "agent",
            "✅ Lead secured! I’ve shared the contact and project context with the growth team.",
          ),
        ]);
      } catch (err) {
        const fallback =
          err instanceof Error ? err.message : "Lead capture failed.";
        setStepIndex(steps.length - 1);
        setInput(nextResponses[steps[steps.length - 1].key] ?? "");
        setError(fallback);
        setMessages((prev) => [
          ...prev,
          createMessage(
            "agent",
            `⚠️ I hit a snag saving this lead: ${fallback}. Try again in a moment.`,
          ),
        ]);
      } finally {
        setSubmitting(false);
      }
    }
  }

  const readyForInput = !!currentStep && !capturedLead;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-500/20 backdrop-blur">
        <header className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/70">
                Lead Workflow
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Conversational Intake
              </h2>
            </div>
            <div className="text-right text-xs text-cyan-200">
              <p>{progress}% complete</p>
              <p className="text-cyan-200/70">
                {Math.min(stepIndex, steps.length)}/{steps.length} milestones
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-slate-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "agent" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                  message.role === "agent"
                    ? "bg-slate-800/90 text-slate-100 ring-1 ring-cyan-400/20"
                    : "bg-cyan-400 text-slate-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {readyForInput ? (
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-slate-900/80 p-6"
          >
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/60">
              {currentStep.prompt(responses)}
            </label>
            {currentStep.multiline ? (
              <textarea
                rows={3}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={currentStep.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40"
              />
            ) : (
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={currentStep.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40"
                autoFocus
              />
            )}
            {currentStep.helper && (
              <p className="mt-2 text-xs text-slate-400">{currentStep.helper}</p>
            )}
            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-300/90">
                {error}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:pointer-events-none disabled:opacity-60"
                disabled={submitting}
              >
                {stepIndex + 1 >= steps.length ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-white/10 bg-slate-900/80 px-6 py-5 text-sm text-slate-300">
            {capturedLead ? (
              <p>
                Lead saved. Jump to the{" "}
                <a
                  href="/dashboard"
                  className="font-semibold text-cyan-300 hover:underline"
                >
                  dashboard
                </a>{" "}
                to review every capture.
              </p>
            ) : (
              <p>Loading…</p>
            )}
          </div>
        )}
      </section>

      <aside className="flex flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900 to-slate-950/90 p-6 text-slate-100 shadow-2xl shadow-cyan-500/10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300/60">
            Agent Snapshot
          </p>
          <h3 className="mt-3 text-2xl font-semibold">
            Full-funnel web design intake
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-cyan-300">•</span>
              <span>Validates contact info to keep your pipeline clean.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-cyan-300">•</span>
              <span>
                Captures project goals and desired outcomes for custom proposals.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-cyan-300">•</span>
              <span>
                Syncs instantly with your internal dashboard for follow-up.
              </span>
            </li>
          </ul>
        </div>

        {capturedLead && (
          <div className="rounded-3xl border border-cyan-400/30 bg-slate-900/60 p-6 text-slate-100 shadow-xl shadow-cyan-500/20 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300/60">
              Latest Capture
            </p>
            <h3 className="mt-3 text-xl font-semibold">{capturedLead.name}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-400">Email</dt>
                <dd className="font-medium text-cyan-200">
                  <a href={`mailto:${capturedLead.email}`}>
                    {capturedLead.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-medium text-cyan-200">
                  <a href={`tel:${capturedLead.phone.replace(/\s+/g, "")}`}>
                    {capturedLead.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Website</dt>
                <dd className="font-medium text-cyan-200">
                  <a
                    href={capturedLead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {capturedLead.website}
                  </a>
                </dd>
              </div>
              {capturedLead.services && (
                <div>
                  <dt className="text-slate-400">Focus</dt>
                  <dd className="font-medium text-slate-200">
                    {capturedLead.services}
                  </dd>
                </div>
              )}
              {capturedLead.budget && (
                <div>
                  <dt className="text-slate-400">Budget / Timeline</dt>
                  <dd className="font-medium text-slate-200">
                    {capturedLead.budget}
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-6 text-xs text-slate-400">
              Captured at{" "}
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(capturedLead.createdAt))}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
