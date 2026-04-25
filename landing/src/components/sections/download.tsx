import { Link } from "react-router-dom";

const REPO = "https://github.com/kenny516/TextAid";
const RELEASES = `${REPO}/releases/latest`;
const CHROME_ZIP = `${RELEASES}/download/textaid-chrome.zip`;
const FIREFOX_ZIP = `${RELEASES}/download/textaid-firefox.zip`;

export function Download() {
    return (
        <section id="install" className="px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-5xl">
                <div className="mb-14 max-w-xl">
                    <span className="eyebrow">Install in under a minute</span>
                    <h2 className="display-lg mt-3 text-white">
                        Download for your browser.
                    </h2>
                    <p className="mt-5 text-soft">
                        One source, every browser. Pick your runtime, drop the build into
                        your extensions page, and you&apos;re writing in 60 seconds.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <DownloadCard
                        family="Chromium"
                        title="Chrome, Brave, Edge, Opera, Arc, Vivaldi"
                        primary={{ label: "Download .zip", href: CHROME_ZIP }}
                        secondary={{ label: "Web Store ↗", href: REPO }}
                        steps={[
                            "Unzip the archive",
                            "Open chrome://extensions",
                            "Enable Developer mode (top right)",
                            "Click Load unpacked → select the folder",
                        ]}
                        icon={<ChromiumGlyph />}
                    />
                    <DownloadCard
                        family="Gecko"
                        title="Firefox, Zen, LibreWolf"
                        primary={{ label: "Download .zip", href: FIREFOX_ZIP }}
                        secondary={{ label: "addons.mozilla.org ↗", href: REPO }}
                        steps={[
                            "Unzip the archive",
                            "Open about:debugging#/runtime/this-firefox",
                            "Click Load Temporary Add-on…",
                            "Select the manifest.json inside",
                        ]}
                        icon={<FirefoxGlyph />}
                    />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <DownloadCard
                        family="WebKit"
                        title="Safari (macOS)"
                        primary={{ label: "Build from source", href: `${REPO}#safari` }}
                        secondary={{ label: "Setup guide →", href: "/docs/safari", internal: true }}
                        steps={[
                            "Requires Xcode + macOS",
                            "Wrap with safari-web-extension-converter",
                            "Sign with your Apple Developer account",
                        ]}
                        icon={<SafariGlyph />}
                        muted
                    />
                    <DownloadCard
                        family="Source"
                        title="Build it yourself"
                        primary={{ label: "Clone on GitHub ↗", href: REPO }}
                        secondary={{ label: "Read the docs →", href: "/docs", internal: true }}
                        steps={[
                            "git clone the repo",
                            "npm install",
                            "npm run build → dist/chrome/, dist/firefox/",
                            "Or npm run dev for watch mode",
                        ]}
                        icon={<TerminalGlyph />}
                        muted
                    />
                </div>

                <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    Need help? Read the{" "}
                    <Link to="/docs" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
                        full setup guide →
                    </Link>
                </p>
            </div>
        </section>
    );
}

type Action = { label: string; href: string; internal?: boolean };

function DownloadCard({
    family,
    title,
    primary,
    secondary,
    steps,
    icon,
    muted,
}: {
    family: string;
    title: string;
    primary: Action;
    secondary?: Action;
    steps: string[];
    icon: React.ReactNode;
    muted?: boolean;
}) {
    return (
        <article className="group flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors hover:border-white/[0.15] hover:bg-white/[0.03]">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                            {family}
                        </span>
                    </div>
                    <h3 className="font-display mt-3 text-[1.15rem] font-medium tracking-[-0.01em] text-white">
                        {title}
                    </h3>
                </div>
                <div className={"text-white/" + (muted ? "30" : "55") + " transition-colors group-hover:text-white/80"}>
                    {icon}
                </div>
            </div>

            <ol className="mt-6 space-y-2 text-[0.83rem] leading-[1.5] text-soft">
                {steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                        <span className="font-mono text-[10px] tabular-nums text-muted">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{s}</span>
                    </li>
                ))}
            </ol>

            <div className="mt-7 flex items-center gap-2">
                <ActionLink {...primary} />
                {secondary && <ActionLink variant="ghost" {...secondary} />}
            </div>
        </article>
    );
}

function ActionLink({
    label,
    href,
    internal,
    variant = "primary",
}: Action & { variant?: "primary" | "ghost" }) {
    const cls =
        variant === "primary"
            ? "inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-[0.82rem] font-medium !text-black transition-opacity hover:opacity-90"
            : "inline-flex h-9 items-center justify-center rounded-md border border-white/[0.12] bg-transparent px-4 text-[0.82rem] font-medium !text-white/85 transition-colors hover:bg-white/[0.05] hover:!text-white";

    if (internal) {
        return (
            <Link to={href} className={cls}>
                {label}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
            {label}
        </a>
    );
}

/* ── Glyphs ─────────────────────────────────────────────── */

function ChromiumGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12 9V3M9.5 13.5L4.5 8.5M14.5 13.5l5 -5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}
function FirefoxGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 13a8 8 0 1 0 14-5 4.5 4.5 0 0 1-3 6 5 5 0 0 0-7-7 5 5 0 0 0-4 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    );
}
function SafariGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    );
}
function TerminalGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 10l3 2-3 2M12 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
