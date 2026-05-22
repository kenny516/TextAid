import { useState } from "react";

const ITEMS = [
    {
        q: "Is TextAid free?",
        a: "Yes, completely free and open-source. You only pay for API usage directly to the provider you choose — TextAid itself costs nothing.",
    },
    {
        q: "Does it work on Firefox?",
        a: "Yes. There are separate builds: textaid-chrome.zip for Chrome, Brave, Edge, Opera, Arc, and Vivaldi; textaid-firefox.zip for Firefox and Zen.",
    },
    {
        q: "Which AI providers are supported?",
        a: "OpenAI (GPT-4o, GPT-4o mini), Google Gemini (Flash, Pro), and Anthropic Claude (Haiku, Sonnet, Opus). Switch between them in one click from the popup.",
    },
    {
        q: "Is my text sent to your servers?",
        a: "Never. Text goes directly from your browser to the AI provider you chose. TextAid has no backend, no database, no telemetry.",
    },
    {
        q: "Do I need to create an account?",
        a: "No account, no signup. You only need a free or paid API key from your chosen provider. The key is stored locally in your browser's secure storage.",
    },
];

export function Faq() {
    return (
        <section id="faq" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-3xl">
                <div className="mb-12">
                    <span className="eyebrow">FAQ</span>
                    <h2 className="display-lg mt-3 text-white">Common questions.</h2>
                </div>
                <div className="divide-y divide-white/[0.08]">
                    {ITEMS.map((item) => (
                        <FaqItem key={item.q} q={item.q} a={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="py-5">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={open}
            >
                <span className="font-display text-[0.95rem] font-medium text-white">{q}</span>
                <span
                    aria-hidden
                    className={
                        "flex-shrink-0 text-muted transition-transform duration-200 " +
                        (open ? "rotate-45" : "rotate-0")
                    }
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            {open && (
                <p className="mt-4 text-[0.88rem] leading-relaxed text-soft">{a}</p>
            )}
        </div>
    );
}
