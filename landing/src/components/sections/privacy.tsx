import { Lock, MousePointerClick, EyeOff, Code2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReveal } from "../../lib/use-reveal";

export function Privacy() {
    const headingRef = useReveal<HTMLDivElement>();
    const gridRef = useReveal<HTMLUListElement>(0.05);
    const tenets: { icon: LucideIcon; title: string; body: string }[] = [
        {
            icon: Lock,
            title: "Local-first storage",
            body: "Your API keys live in Chrome's encrypted storage — never on our servers, never proxied through us.",
        },
        {
            icon: MousePointerClick,
            title: "Explicit actions only",
            body: "Text is sent to your chosen model only when you trigger an action. No silent uploads.",
        },
        {
            icon: EyeOff,
            title: "Password fields skipped",
            body: "Auto-complete and suggestions are disabled inside password and sensitive fields by design.",
        },
        {
            icon: Code2,
            title: "Open source, auditable",
            body: "Every line of TextAid is on GitHub. Read it, fork it, ship your own build.",
        },
    ];

    return (
        <section id="privacy" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div ref={headingRef} className="reveal-scroll mb-12 max-w-xl">
                    <span className="eyebrow">Privacy by design</span>
                    <h2 className="display-lg mt-3 text-white">
                        Your words <span className="italic">stay yours.</span>
                    </h2>
                    <p className="mt-5 text-soft">
                        TextAid is built like a piece of system software, not a SaaS.
                        We don't host your text, your keys, or your habits. We can't —
                        because we never receive them.
                    </p>
                </div>

                <ul ref={gridRef} className="reveal-scroll grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 [transition-delay:100ms]">
                    {tenets.map((t) => {
                        const Icon = t.icon;
                        return (
                            <li key={t.title} className="bg-[#0a0a0a] light-card p-8">
                                <Icon size={18} className="text-white" strokeWidth={1.6} />
                                <h3 className="mt-6 text-[1rem] font-medium tracking-[-0.01em] text-white">
                                    {t.title}
                                </h3>
                                <p className="mt-2 text-[0.9rem] leading-[1.55] text-soft">
                                    {t.body}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
