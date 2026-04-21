import { useEffect, useState } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { Button } from "./components/ui/button";

const workflows = [
  {
    title: "Reply faster without sounding robotic",
    text: "Rewrite support replies, onboarding emails, and product updates into cleaner customer-facing language.",
    meta: "Customer communication",
  },
  {
    title: "Keep one voice across the whole team",
    text: "Create shared instructions so operations, support, and marketing all write with the same standard.",
    meta: "Brand consistency",
  },
  {
    title: "Turn rough drafts into publishable copy",
    text: "Take notes, internal messages, and raw ideas, then shape them into text that is ready to ship.",
    meta: "Publishing workflow",
  },
];

const articles = [
  "Rewrite customer replies in one click",
  "Turn product notes into release copy",
  "Standardize multilingual help center text",
  "Review copy before it goes live",
];

const offers = [
  {
    name: "Starter",
    description: "For solo founders and independent operators.",
    price: "$24",
  },
  {
    name: "Team",
    description: "For growing teams with shared writing standards.",
    price: "$89",
  },
];

function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("textaid-theme");
    const resolvedTheme = storedTheme === "light" ? "light" : "dark";
    setTheme(resolvedTheme);
    document.documentElement.dataset.theme = resolvedTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("textaid-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <header className="site-line flex items-center justify-between py-5">
          <a className="text-sm font-medium tracking-[-0.02em]" href="#top">
            TEXTAID
          </a>

          <nav className="hidden items-center gap-8 text-sm text-[var(--soft)] md:flex">
            <a href="#workflows">Workflows</a>
            <a href="#use-cases">Use cases</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button className="border border-[var(--line)] bg-transparent px-4 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--panel)]">
              Join waitlist
            </Button>
          </div>
        </header>

        <main id="top">
          <section className="site-line grid gap-12 py-10 lg:grid-cols-[1.25fr_0.75fr] lg:py-16">
            <div className="reveal-up max-w-4xl">
              <div className="label">Writing tool for modern teams</div>
              <h1 className="mt-5 max-w-5xl text-[clamp(2.9rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                Write better. Stay consistent. Ship faster.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--soft)]">
                TextAid helps teams rewrite, clean, and align customer-facing text without adding more process.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button className="border border-white bg-white px-6 py-4 text-sm text-black hover:bg-white/92">
                  Start free
                </Button>
                <Button className="border border-[var(--line)] bg-transparent px-6 py-4 text-sm text-[var(--text)] hover:bg-[var(--panel)]">
                  See product
                </Button>
              </div>
            </div>

            <aside className="reveal-up reveal-delay-2 space-y-8 lg:pl-10">
              <div>
                <div className="label">What it does</div>
                <p className="mt-4 text-base leading-8 text-[var(--soft)]">
                  A simple workspace to rewrite, standardize, and review the text your team sends every day.
                </p>
              </div>

              <div className="space-y-3">
                <div className="mini-stat">
                  <span>Faster writing</span>
                  <strong>62%</strong>
                </div>
                <div className="mini-stat">
                  <span>Shared voice</span>
                  <strong>1 source</strong>
                </div>
                <div className="mini-stat">
                  <span>Review flow</span>
                  <strong>Built in</strong>
                </div>
              </div>
            </aside>
          </section>

          <section className="site-line py-10 lg:py-14" id="workflows">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="reveal-up">
                <div className="label">Workflows</div>
                <h2 className="mt-4 max-w-md text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                  Built around real writing tasks.
                </h2>
              </div>

              <div className="space-y-1">
                {workflows.map((item) => (
                  <article className="list-row reveal-up" key={item.title}>
                    <div>
                      <div className="text-sm text-[var(--muted)]">{item.meta}</div>
                      <h3 className="mt-2 text-[1.22rem] font-semibold leading-[1.25] tracking-[-0.03em]">{item.title}</h3>
                      <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--soft)]">{item.text}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--muted)]" />
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="site-line py-10 lg:py-14" id="use-cases">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="reveal-up">
                <div className="label">Use cases</div>
                <h2 className="mt-4 max-w-md text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                  The kind of work people already do every day.
                </h2>
              </div>

              <div className="space-y-1">
                {articles.map((item) => (
                  <div className="simple-row reveal-up" key={item}>
                    <span>{item}</span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="site-line py-10 lg:py-14" id="pricing">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="reveal-up">
                <div className="label">Pricing</div>
                <h2 className="mt-4 max-w-sm text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                  Straightforward plans.
                </h2>
              </div>

              <div className="grid gap-1 md:grid-cols-2">
                {offers.map((offer) => (
                  <article className="price-card reveal-up" key={offer.name}>
                    <div className="text-sm text-[var(--muted)]">{offer.name}</div>
                    <div className="mt-5 text-6xl font-semibold tracking-[-0.06em]">{offer.price}</div>
                    <p className="mt-5 max-w-xs text-base leading-8 text-[var(--soft)]">{offer.description}</p>
                    <Button className="mt-8 w-full border border-white bg-white px-5 py-4 text-sm text-black hover:bg-white/92">
                      Choose {offer.name}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
