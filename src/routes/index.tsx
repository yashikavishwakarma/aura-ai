import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { ArrowRight, Mic, FileText, MapPin, ShieldCheck, Languages, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yojana Mitra — Apply for government schemes in your language" },
      { name: "description", content: "A friendly voice and text assistant that helps you discover, apply for and track Indian government welfare schemes." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-semibold">य</div>
          <span className="font-display text-xl font-semibold">Yojana Mitra</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-ink-soft md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#schemes" className="hover:text-foreground">Schemes</a>
          <a href="#trust" className="hover:text-foreground">Why us</a>
        </nav>
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Start now <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-12 pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
          <img
            src={heroImg}
            alt=""
            width={1920}
            height={768}
            className="h-[360px] w-full object-cover md:h-[460px]"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-xl rounded-2xl bg-background/85 px-8 py-7 text-center shadow-sm backdrop-blur-sm md:px-12 md:py-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">One stop platform</p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-[40px]">
                Apply for government schemes — in your own language, with help.
              </h1>
              <p className="mt-4 text-sm text-ink-soft md:text-base">
                Find what you qualify for, get the paperwork right, and track your application until the money lands.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/chat" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                  <Mic className="h-4 w-4" /> Talk to Mitra
                </Link>
                <Link to="/applications" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-strong">
                  <ClipboardList className="h-4 w-4" /> Track an application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section id="trust" className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
          <Trust icon={<Languages className="h-5 w-5" />} title="Speaks your language" body="Hindi, Bhojpuri, Tamil, Bengali, English — reply in whatever you start with." />
          <Trust icon={<ShieldCheck className="h-5 w-5" />} title="Honest about uncertainty" body="No fake approvals. If something is unclear, we tell you where to verify." />
          <Trust icon={<MapPin className="h-5 w-5" />} title="Knows your nearest office" body="Tehsil, CSC, Panchayat — with counter number and timings where we have it." />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">From confusion to credited in a few short conversations.</h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 font-display text-3xl text-primary">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Schemes preview */}
      <section id="schemes" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Popular schemes</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Real money. Real eligibility. Real next steps.</h2>
          </div>
          <Link to="/chat" className="hidden text-sm font-medium text-primary hover:underline md:inline">Ask about another scheme →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-wider text-ink-soft">{s.ministry}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">{s.name}</h3>
              <p className="mt-3 text-2xl font-semibold text-primary">{s.amount}</p>
              <p className="mt-3 text-sm text-ink-soft">{s.who}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Ready when you are.</h2>
            <p className="mt-3 text-primary-foreground/85">No forms. Just talk or type. We&apos;ll do the rest, step by step.</p>
            <Link to="/chat" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-strong">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-ink-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p>© {new Date().getFullYear()} Yojana Mitra. Built to make welfare easier.</p>
          <p>Not affiliated with the Government of India. Always verify on the official portal.</p>
        </div>
      </footer>
    </main>
  );
}

function Trust({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{body}</p>
      </div>
    </div>
  );
}

const steps = [
  { title: "Tell us what you need", body: "Housing, pension, ration, farming — just describe it in your words. We auto-detect your language." },
  { title: "Pick from 2-3 matched schemes", body: "We show only what you likely qualify for, with the rupee amount next to each scheme." },
  { title: "Document checklist made simple", body: "We ask the eligibility questions like a person would — not like a form." },
  { title: "Scan, auto-fill, double-check", body: "Upload documents. If OCR is unsure on a key field, we ask you directly." },
  { title: "Nearest office + what to carry", body: "Exact location, originals to bring, and the counter to go to where available." },
  { title: "We follow up on the right day", body: "Different schemes have different timelines. We follow up when your scheme actually moves." },
];

const schemes = [
  { ministry: "Ministry of Rural Development", name: "PM Awas Yojana (Gramin)", amount: "₹1,20,000 tak", who: "For rural families without a pucca house. SECC database based eligibility." },
  { ministry: "Ministry of Agriculture", name: "PM-Kisan Samman Nidhi", amount: "₹6,000 / year", who: "For small and marginal farmer families. Paid in 3 instalments." },
  { ministry: "Ministry of Labour & Employment", name: "e-Shram Card", amount: "₹2 lakh accident cover", who: "For unorganised workers — migrants, domestic workers, gig workers." },
  { ministry: "Ministry of Consumer Affairs", name: "One Nation One Ration Card", amount: "Portable ration", who: "Use your ration card in any state — built for migrants." },
  { ministry: "Ministry of Health", name: "Ayushman Bharat (PM-JAY)", amount: "₹5,00,000 / family / year", who: "Free hospital treatment for eligible families at empanelled hospitals." },
  { ministry: "Ministry of Women & Child Development", name: "Sukanya Samriddhi Yojana", amount: "8.2% interest", who: "Long-term savings for a girl child under 10 years." },
];
