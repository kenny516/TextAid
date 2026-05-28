import {
    Sparkles,
    Wand2,
    ChevronsUpDown,
    Zap,
    MousePointer2,
    Key,
    Languages,
} from "lucide-react";
import { useReveal } from "../../lib/use-reveal";

const items = [
    {
        icon: Sparkles,
        title: "Summarize anything",
        body: "Long articles, dense docs, transcripts, even half-written drafts — distilled into bullets you can scan.",
    },
    {
        icon: Wand2,
        title: "Rewrite with tone",
        body: "Professional, casual, concise, creative. One click changes voice without losing meaning.",
    },
    {
        icon: ChevronsUpDown,
        title: "Expand a single thought",
        body: "Turn one sentence into a paragraph — or a 3-bullet outline you can edit in place.",
    },
    {
        icon: Languages,
        title: "Translate to 16 languages",
        body: "Spanish, French, Japanese, Arabic, and 12 more. Your selected text, instantly localized.",
    },
    {
        icon: Zap,
        title: "Inline auto-complete",
        body: "Ghost text appears as you type. Press Tab to accept, Esc to dismiss. Toggle aggressiveness in one click.",
    },
    {
        icon: MousePointer2,
        title: "Right-click everywhere",
        body: "Native context-menu integration. Generate, rephrase, expand from any page.",
    },
    {
        icon: Key,
        title: "Bring your own key",
        body: "Stored locally in Chrome's secure storage. Never proxied. Never logged.",
    },
];

export function Features() {
    const headingRef = useReveal<HTMLDivElement>();
    const gridRef = useReveal<HTMLDivElement>(0.05);

    return (
        <section id="features" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div ref={headingRef} className="reveal-scroll mb-14 max-w-xl">
                    <span className="eyebrow">Capabilities</span>
                    <h2 className="display-lg mt-3 text-white">
                        Seven tools, one pane.
                    </h2>
                </div>

                <div ref={gridRef} className="reveal-scroll grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3 [transition-delay:100ms]">
                    {items.map((item, i) => {
                        const Icon = item.icon;
                        const isLast = i === items.length - 1;
                        return (
                            <div
                                key={item.title}
                                className={
                                    "card-hover light-card bg-[#0a0a0a] p-8 transition-colors hover:bg-white/[0.03]" +
                                    (isLast ? " sm:col-span-2 lg:col-span-3" : "")
                                }
                            >
                                <Icon size={18} className="text-white" strokeWidth={1.6} />
                                <h3 className="mt-6 text-[1rem] font-medium tracking-[-0.01em] text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-[0.9rem] leading-[1.55] text-soft">
                                    {item.body}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
