import { BarChart3, Palette, Shield, Zap } from "lucide-react";

const items = [
  {
    icon: Zap,
    title: "Instantly useful",
    body: "Summaries, rewrites, and completions appear where you work, so the first interaction already saves time.",
  },
  {
    icon: Palette,
    title: "Tone-aware by default",
    body: "Switch between concise, professional, casual, and creative output without rebuilding prompts every time.",
  },
  {
    icon: BarChart3,
    title: "Context that actually matters",
    body: "Selected text, nearby content, and page intent shape the answer, which keeps the writing grounded and relevant.",
  },
  {
    icon: Shield,
    title: "Private where it counts",
    body: "API keys stay in local browser storage, sensitive fields are excluded, and the extension only acts when you ask.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="max-w-3xl">
        <div className="liquid-glass inline-flex rounded-full px-3.5 py-1">
          <span className="font-body text-xs font-medium text-white">Why TextAid</span>
        </div>
        <h2 className="mt-6 font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-6xl">
          The difference is in every sentence.
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="liquid-glass rounded-2xl p-6">
              <div className="liquid-glass-strong flex h-10 w-10 items-center justify-center rounded-full">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="mt-6 font-body text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-3 font-body text-sm font-light leading-7 text-white/60">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
