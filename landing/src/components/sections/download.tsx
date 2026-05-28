import { Link } from "react-router-dom";

const REPO = "https://github.com/kenny516/TextAid";
const RELEASES = `${REPO}/releases/latest`;
const CHROME_ZIP = `${RELEASES}/download/textaid-chrome.zip`;
const FIREFOX_ZIP = `${RELEASES}/download/textaid-firefox.zip`;

// Update these URLs once the store listings are approved:
const AMO_URL = "https://addons.mozilla.org/firefox/addon/textaid/"; // ← replace with real URL after AMO approval
const EDGE_URL = "https://microsoftedge.microsoft.com/addons/detail/textaid/"; // ← replace after Edge approval

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
                        icon={<BrowserStack icons={["chrome", "brave", "edge", "opera"]} />}
                    />
                    <DownloadCard
                        family="Gecko"
                        title="Firefox, Zen, LibreWolf"
                        primary={{ label: "Get on Firefox ↗", href: FIREFOX_ZIP }}
                        secondary={{ label: "addons.mozilla.org ↗", href: AMO_URL }}
                        steps={[
                            "Click 'Get on Firefox' to install from AMO",
                            "Or download the .zip for manual install",
                            "Open about:debugging → Load Temporary Add-on…",
                            "Select the manifest.json inside",
                        ]}
                        icon={<BrowserStack icons={["firefox", "zen-browser", "librewolf"]} />}
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
                        icon={<BrowserStack icons={["safari"]} />}
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
                        icon={<BrowserStack icons={["github"]} invert />}
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
        <article className="card-hover group flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors hover:bg-white/[0.03]">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
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
            ? "btn-primary-themed inline-flex h-9 items-center justify-center rounded-md px-4 text-[0.82rem] font-medium"
            : "btn-outline-themed inline-flex h-9 items-center justify-center rounded-md px-4 text-[0.82rem] font-medium";

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

/* ── Browser icon stack ─────────────────────────────────── */

function BrowserStack({ icons, invert }: { icons: string[]; invert?: boolean }) {
    return (
        <div className="flex -space-x-1.5">
            {icons.map((name) => (
                <img
                    key={name}
                    src={`/icons/${name}.svg`}
                    alt={name}
                    className={"h-7 w-7 rounded-lg object-contain ring-1 ring-white/10" + (invert ? " invert opacity-60" : "")}
                />
            ))}
        </div>
    );
}
