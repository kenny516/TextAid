const STATS = [
    { label: "MIT Licensed" },
    { label: "3 AI Providers" },
    { label: "No account required" },
    { label: "Works on any webpage" },
    { label: "Open Source" },
];

export function StatsBar() {
    return (
        <div className="px-6 pb-4">
            <div className="mx-auto max-w-5xl">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    {STATS.map((stat, i) => (
                        <span key={stat.label} className="flex items-center gap-2">
                            {i > 0 && (
                                <span className="hidden h-3 w-px bg-white/[0.15] sm:block" aria-hidden />
                            )}
                            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                                {stat.label}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
