import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, IndianRupee, FileCheck2 } from "lucide-react";
import { loadApplications, type Application } from "@/lib/chat-storage";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "My applications — Yojana Mitra" }] }),
  component: ApplicationsPage,
});

const labels: Record<Application["status"], { text: string; tone: string }> = {
  applied:      { text: "Applied",      tone: "bg-secondary text-secondary-foreground" },
  under_review: { text: "Under review", tone: "bg-accent text-accent-foreground" },
  approved:     { text: "Approved",     tone: "bg-primary/15 text-primary" },
  credited:     { text: "Amount credited", tone: "bg-primary text-primary-foreground" },
};

const order: Application["status"][] = ["applied", "under_review", "approved", "credited"];

function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => { setApps(loadApplications()); }, []);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <h1 className="font-display text-base font-semibold">My applications</h1>
          <span className="w-12" />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tracking</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Every scheme, every step.</h2>
        <p className="mt-3 max-w-xl text-ink-soft">From applied to credited — see exactly where each application stands. If a portal status is available, we pull it in.</p>

        <ul className="mt-10 space-y-5">
          {apps.map((app) => {
            const stepIdx = order.indexOf(app.status);
            return (
              <li key={app.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-soft">Application ID — {app.id}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{app.scheme}</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${labels[app.status].tone}`}>{labels[app.status].text}</span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
                  {app.amount && (
                    <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" /> {app.amount}</div>
                  )}
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-primary" /> Docs verified</div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex items-center">
                    {order.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center">
                        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${i <= stepIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {i < stepIdx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        {i < order.length - 1 && (
                          <div className={`mx-2 h-0.5 flex-1 ${i < stepIdx ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-ink-soft">
                    {order.map((s) => <span key={s}>{labels[s].text}</span>)}
                  </div>
                </div>

                {app.notes && (
                  <p className="mt-5 rounded-xl bg-surface-strong px-4 py-3 text-sm text-foreground">{app.notes}</p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-ink-soft">
          Want to add another application? Just ask Mitra in chat — once submitted, it&apos;ll show up here automatically.
        </div>
      </section>
    </main>
  );
}
