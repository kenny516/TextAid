export function LiveDemo() {
    const steps = [
        {
            n: "01",
            title: "Select",
            body: "Highlight any text on any page — an article, an email draft, a tweet.",
            illustration: <BarsIllustration />,
        },
        {
            n: "02",
            title: "Toolbar appears",
            body: "A small toolbar quietly fades in next to your selection, never blocking what you read.",
            illustration: <PillIllustration />,
        },
        {
            n: "03",
            title: "Stream the answer",
            body: "Summary, rewrite, or expansion streams in tokens — instantly readable.",
            illustration: <CodeIllustration />,
        },
    ];

    return (
        <section id="demo" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div className="mb-14 max-w-xl">
                    <span className="eyebrow">How it feels</span>
                    <h2 className="display-lg mt-3 text-white">
                        Three gestures, zero friction.
                    </h2>
                </div>

                <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
                    {steps.map((s) => (
                        <article key={s.n} className="bg-[#0a0a0a] p-8">
                            <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-muted">
                                {s.n}
                            </span>
                            <h3 className="mt-6 text-[1.1rem] font-medium tracking-[-0.01em] text-white">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-[0.92rem] leading-[1.55] text-soft">
                                {s.body}
                            </p>
                            <div className="mt-8">{s.illustration}</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BarsIllustration() {
    return (
        <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/[0.06]" />
            <div className="h-2 w-[88%] rounded-full bg-white/[0.06]" />
            <div className="relative h-2 w-[68%] overflow-hidden rounded-full bg-white/[0.06]">
                <div className="absolute inset-y-0 left-0 w-[60%] rounded-full bg-white/60" />
            </div>
        </div>
    );
}

function PillIllustration() {
    return (
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            {["Summarize", "Rewrite", "Expand"].map((t, i) => (
                <span
                    key={t}
                    className={
                        "rounded-full px-2.5 py-1 text-[0.7rem] " +
                        (i === 0
                            ? "bg-white text-[#0a0a0a] font-medium"
                            : "text-white/60")
                    }
                >
                    {t}
                </span>
            ))}
        </div>
    );
}

function CodeIllustration() {
    return (
        <div className="space-y-2 font-mono text-[0.78rem] text-white/70">
            <div className="flex gap-2">
                <span className="text-white/40">›</span>
                <span>The author argues that AI shifts writing</span>
            </div>
            <div className="flex gap-2">
                <span className="text-white/40">›</span>
                <span>from solitary act to collaborative</span>
            </div>
            <div className="flex gap-2">
                <span className="text-white/40">›</span>
                <span className="inline-flex items-center gap-1">
                    surface
                    <span className="ml-1 inline-block h-3.5 w-1 animate-pulse bg-white/80" />
                </span>
            </div>
        </div>
    );
}
