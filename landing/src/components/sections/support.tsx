const SPONSORS = "https://github.com/sponsors/kenny516";
const BMC = "https://www.buymeacoffee.com/kenny516";
const KOFI = "https://ko-fi.com/kenny516";

export function Support() {
    return (
        <section id="support" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
                    <div>
                        <span className="eyebrow">Free forever</span>
                        <h2 className="display-lg mt-3 text-white">
                            Built in the open. <br />
                            Powered by you.
                        </h2>
                        <p className="mt-5 text-soft">
                            TextAid is free, open source, and will stay that way. No
                            paywall, no premium tier, no &ldquo;upgrade for unlimited&rdquo;.
                            If it saved you a few minutes today, you can buy the maintainers
                            a coffee.
                        </p>
                        <p className="mt-4 text-[0.85rem] text-muted">
                            Donations fund hosting, code-signing certificates, and the
                            occasional weekend hackathon to ship a new provider.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 self-center sm:max-w-sm">
                        <SupportCard
                            href={SPONSORS}
                            label="GitHub Sponsors"
                            sub="Monthly or one-time"
                            cta="Sponsor on GitHub"
                            primary
                            icon={<HeartGlyph />}
                        />
                        <SupportCard
                            href="https://github.com/kenny516/TextAid"
                            label="Star the repo"
                            sub="Free, takes 2 seconds"
                            cta="Star on GitHub"
                            icon={<StarGlyph />}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

type CardProps = {
    href: string;
    label: string;
    sub: string;
    cta: string;
    icon: React.ReactNode;
    primary?: boolean;
};

function SupportCard({ href, label, sub, cta, icon, primary }: CardProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={
                "group relative flex flex-col justify-between gap-5 rounded-xl border p-5 transition-colors " +
                (primary
                    ? "border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.06]"
                    : "border-white/[0.08] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.04]")
            }
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className={
                        "flex h-9 w-9 items-center justify-center rounded-md border " +
                        (primary
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-400")
                    }
                >
                    {icon}
                </div>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                    {sub}
                </span>
            </div>

            <div>
                <div className="font-display text-[0.95rem] font-medium text-white">
                    {label}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[0.82rem] text-soft transition-colors group-hover:text-white">
                    {cta}
                    <span aria-hidden>→</span>
                </div>
            </div>
        </a>
    );
}

function HeartGlyph() {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M8 14.25 1.65 7.81a3.75 3.75 0 0 1 5.3-5.3L8 3.56l1.05-1.05a3.75 3.75 0 0 1 5.3 5.3L8 14.25Z" />
        </svg>
    );
}

function CoffeeGlyph() {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M2.5 6.5h9V11a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V6.5Z" />
            <path d="M11.5 7.5h.75a1.75 1.75 0 0 1 0 3.5h-.75" />
            <path d="M5 4.5c.5-1 0-2 0-2M7.5 4.5c.5-1 0-2 0-2M10 4.5c.5-1 0-2 0-2" strokeLinecap="round" />
        </svg>
    );
}

function KofiGlyph() {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M3 4h8.5a2.5 2.5 0 0 1 0 5H11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4Zm8 4h.5a1.5 1.5 0 0 0 0-3H11v3Z" />
        </svg>
    );
}

function StarGlyph() {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
    );
}
