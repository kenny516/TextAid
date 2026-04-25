import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const rows = [
  {
    title: "Designed to stay inside your flow.",
    body: "TextAid lives in the browser, not in a detached editor. It reads the page context, keeps your selection in view, and answers with edits you can use immediately.",
    cta: "Explore contextual editing",
    image: "https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif",
  },
  {
    title: "Sharper suggestions with less effort.",
    body: "From email replies to product copy, TextAid adapts tone, expands ideas, and helps you finish clean drafts without bouncing between tabs or prompts.",
    cta: "See assisted writing",
    image: "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  },
];

export function FeaturesChess() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="liquid-glass inline-flex rounded-full px-3.5 py-1">
          <span className="font-body text-xs font-medium text-white">Capabilities</span>
        </div>
        <h2 className="mt-6 font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-6xl">
          Pro writing power. Zero friction.
        </h2>
      </div>

      <div className="mt-16 space-y-10 md:space-y-16">
        {rows.map((row, index) => (
          <div
            key={row.title}
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="max-w-xl">
              <h3 className="font-heading text-3xl italic leading-tight text-white md:text-4xl">
                {row.title}
              </h3>
              <p className="mt-5 font-body text-sm font-light leading-7 text-white/65 md:text-base">
                {row.body}
              </p>
              <Button asChild size="lg" className="mt-8 rounded-full">
                <a href="#download">
                  {row.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="liquid-glass rounded-2xl p-3">
              <div className="overflow-hidden rounded-2xl">
                <img src={row.image} alt={row.title} className="h-full w-full rounded-2xl object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
