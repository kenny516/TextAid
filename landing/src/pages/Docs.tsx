import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const REPO = "https://github.com/kenny516/TextAid";
const RELEASES = `${REPO}/releases/latest`;

type Section = {
    id: string;
    title: string;
    group: string;
    render: () => React.ReactNode;
};

const SECTIONS: Section[] = [
    {
        id: "overview",
        group: "Getting started",
        title: "Overview",
        render: () => (
            <>
                <Lead>
                    TextAid is a quiet writing layer for your browser. Select text on any
                    page, and a small toolbar appears: <Kbd>Summarize</Kbd>{" "}
                    <Kbd>Rewrite</Kbd> <Kbd>Expand</Kbd> <Kbd>Ideas</Kbd>. Your API key
                    stays in your browser. No accounts. No telemetry.
                </Lead>

                <P>
                    This guide walks you through installing TextAid, getting an API key,
                    and tuning it for your daily writing. The whole setup takes about
                    three minutes.
                </P>

                <Callout>
                    Already installed? Jump to{" "}
                    <Anchor to="api-key">getting your API key</Anchor>.
                </Callout>
            </>
        ),
    },
    {
        id: "install-chromium",
        group: "Getting started",
        title: "Install on Chromium",
        render: () => (
            <>
                <P>
                    Works in Chrome, Brave, Edge, Opera, Arc, and Vivaldi — they all use
                    the same package.
                </P>

                <Steps
                    items={[
                        <>
                            Download the latest{" "}
                            <Ext href={`${RELEASES}/download/textaid-chrome.zip`}>
                                textaid-chrome.zip
                            </Ext>{" "}
                            and unzip it somewhere you won&apos;t accidentally delete.
                        </>,
                        <>
                            Open <Code>chrome://extensions</Code> (or{" "}
                            <Code>brave://extensions</Code>, <Code>edge://extensions</Code>
                            …).
                        </>,
                        <>Toggle <strong className="text-white">Developer mode</strong> in the top right.</>,
                        <>
                            Click <strong className="text-white">Load unpacked</strong> and pick
                            the unzipped folder.
                        </>,
                        <>Pin TextAid from the puzzle icon for quick access.</>,
                    ]}
                />

                <Callout tone="info">
                    Prefer the Chrome Web Store version? It&apos;s in review — for now,
                    the unpacked build is the official release channel.
                </Callout>
            </>
        ),
    },
    {
        id: "install-firefox",
        group: "Getting started",
        title: "Install on Firefox",
        render: () => (
            <>
                <P>Firefox, Zen, and LibreWolf share the same Gecko build.</P>

                <Steps
                    items={[
                        <>
                            Download{" "}
                            <Ext href={`${RELEASES}/download/textaid-firefox.zip`}>
                                textaid-firefox.zip
                            </Ext>{" "}
                            and unzip it.
                        </>,
                        <>
                            Open <Code>about:debugging#/runtime/this-firefox</Code>.
                        </>,
                        <>
                            Click{" "}
                            <strong className="text-white">Load Temporary Add-on…</strong>{" "}
                            and select <Code>manifest.json</Code> inside the unzipped folder.
                        </>,
                    ]}
                />

                <Callout tone="warn">
                    Temporary add-ons disappear when you restart the browser. For a
                    permanent install, sign the build at{" "}
                    <Ext href="https://addons.mozilla.org/developers">addons.mozilla.org</Ext>{" "}
                    (free, &lt;24h auto-review).
                </Callout>
            </>
        ),
    },
    {
        id: "install-safari",
        group: "Getting started",
        title: "Install on Safari",
        render: () => (
            <>
                <P>Safari requires native wrapping with Xcode on macOS.</P>

                <Steps
                    items={[
                        <>
                            Clone the repo and run{" "}
                            <Code>npm install &amp;&amp; npm run build:chrome</Code>.
                        </>,
                        <>
                            Run the converter:
                            <Block>
                                {`xcrun safari-web-extension-converter dist/chrome \\\n  --project-location ./safari-app \\\n  --bundle-identifier dev.kenny516.textaid \\\n  --app-name "TextAid"`}
                            </Block>
                        </>,
                        <>
                            Open the generated Xcode project, sign with your Apple
                            Developer account, and build.
                        </>,
                    ]}
                />

                <Callout tone="info">
                    A few APIs differ on Safari (no global <Code>chrome.commands</Code>{" "}
                    shortcut on iOS, narrower <Code>host_permissions</Code> UX). The
                    toolbar, popup, summarize/rewrite, and streaming all work.
                </Callout>
            </>
        ),
    },

    {
        id: "api-key",
        group: "Configuration",
        title: "Get an API key",
        render: () => (
            <>
                <P>
                    TextAid is bring-your-own-key. Pick whichever provider fits your
                    workflow — both work great.
                </P>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <KeyCard
                        name="Google Gemini"
                        tag="Recommended · Free tier"
                        url="https://aistudio.google.com/app/apikey"
                        bullets={[
                            "Free up to 1,500 requests/day on Flash models",
                            "1M tokens context window",
                            "Recommended: gemini-2.5-flash (free, GA)",
                            "Pro models (2.5 Pro, 3 Pro) require billing",
                        ]}
                    />
                    <KeyCard
                        name="OpenAI"
                        tag="Pay-as-you-go"
                        url="https://platform.openai.com/api-keys"
                        bullets={[
                            "$5 trial credit on new accounts",
                            "Cheapest: gpt-4.1-nano (~$0.10/1M in)",
                            "Recommended: gpt-4o-mini",
                            "Premium: gpt-4.1, gpt-5",
                        ]}
                    />
                </div>

                <Callout tone="warn">
                    Treat your API key like a password. TextAid stores it only in your
                    browser&apos;s local extension storage — but if you commit it to a
                    public repo or paste it in chat, anyone can spend your quota.
                </Callout>
            </>
        ),
    },
    {
        id: "configure",
        group: "Configuration",
        title: "Configure the extension",
        render: () => (
            <>
                <Steps
                    items={[
                        <>Click the TextAid icon in the toolbar.</>,
                        <>
                            Pick a <strong className="text-white">Provider</strong> (Gemini or
                            OpenAI) and paste your key.
                        </>,
                        <>
                            Click <strong className="text-white">Test</strong> to verify it
                            reaches the API. A green dot means you&apos;re good.
                        </>,
                        <>
                            Pick a <strong className="text-white">Model</strong>:{" "}
                            <Code>gemini-2.5-flash</Code> (free) or <Code>gpt-4o-mini</Code>{" "}
                            are great defaults. The popup tags each model{" "}
                            <strong className="text-white">Free</strong> or{" "}
                            <strong className="text-white">Paid</strong> so you know what
                            you&apos;re picking.
                        </>,
                        <>
                            Pick a default <strong className="text-white">Tone</strong> for{" "}
                            <em>Rewrite</em> (Neutral, Friendly, Formal, Concise…).
                        </>,
                        <>Save. The popup will confirm with a green status dot.</>,
                    ]}
                />

                <H4>What gets saved where</H4>
                <Table
                    rows={[
                        ["API key", "chrome.storage.local (per-device, never synced)"],
                        ["Provider, model, tone", "chrome.storage.sync (across devices)"],
                        ["History", "chrome.storage.local (last 50 items, opt-in)"],
                    ]}
                />
            </>
        ),
    },
    {
        id: "shortcuts",
        group: "Configuration",
        title: "Keyboard shortcuts",
        render: () => (
            <>
                <Table
                    rows={[
                        [<Kbd>Ctrl ⇧ Y</Kbd>, "Show the floating toolbar on the current selection (⌘ ⇧ Y on macOS)"],
                        [<Kbd>Alt ⇧ S</Kbd>, "Summarize the current selection directly"],
                        [<Kbd>Alt ⇧ R</Kbd>, "Rewrite the current selection directly"],
                        [<Kbd>Alt ⇧ T</Kbd>, "Translate the current selection to English"],
                        [<Kbd>Esc</Kbd>, "Close the result modal or any dropdown"],
                        [<Kbd>⌘ Enter</Kbd>, "Submit a custom prompt"],
                        [<Kbd>↑ ↓</Kbd>, "Navigate model / tone dropdowns"],
                    ]}
                />

                <P>
                    Customise on Chromium at{" "}
                    <Code>chrome://extensions/shortcuts</Code>. Firefox: open the add-ons
                    page → ⚙️ → <em>Manage Extension Shortcuts</em>.
                </P>
            </>
        ),
    },

    {
        id: "using",
        group: "Using TextAid",
        title: "The floating toolbar",
        render: () => (
            <>
                <P>
                    Select any text on any page. A small toolbar fades in next to your
                    selection.
                </P>

                <ul className="mt-5 space-y-3 text-soft">
                    <Bullet>
                        <strong className="text-white">Summarize</strong> — bullet-point
                        summary, ≤ 200 words.
                    </Bullet>
                    <Bullet>
                        <strong className="text-white">Rewrite</strong> — same meaning, your
                        configured tone.
                    </Bullet>
                    <Bullet>
                        <strong className="text-white">Ideas</strong> — three follow-up
                        angles or counter-arguments.
                    </Bullet>
                    <Bullet>
                        <strong className="text-white">Expand</strong> — add detail and
                        context, keep your voice.
                    </Bullet>
                    <Bullet>
                        <strong className="text-white">More</strong> — Translate, Fix
                        grammar, Make formal/casual, Custom prompt.
                    </Bullet>
                </ul>

                <Callout>
                    On editable fields (textarea, contenteditable…), a{" "}
                    <strong className="text-white">Replace selection</strong> button
                    appears in the result modal — one click to swap your draft with the AI
                    output.
                </Callout>
            </>
        ),
    },
    {
        id: "custom-prompt",
        group: "Using TextAid",
        title: "Custom prompts",
        render: () => (
            <>
                <P>
                    Need something the buttons don&apos;t cover? Open <em>More → Custom
                        prompt…</em> and write your instruction. Your selected text is
                    appended automatically.
                </P>

                <Block>{`Translate this to French and keep the markdown formatting intact.`}</Block>

                <P>
                    Output streams token by token. <Kbd>Esc</Kbd> stops the stream and
                    keeps what you have.
                </P>
            </>
        ),
    },

    {
        id: "privacy",
        group: "Trust & privacy",
        title: "Privacy model",
        render: () => (
            <>
                <ul className="space-y-3 text-soft">
                    <Bullet>
                        Your API key is stored in <Code>chrome.storage.local</Code> only.
                        It&apos;s never synced and never leaves your machine except to call
                        your provider directly.
                    </Bullet>
                    <Bullet>
                        Selected text is sent to your chosen provider (Gemini or OpenAI)
                        over HTTPS. We have no servers in between.
                    </Bullet>
                    <Bullet>No telemetry. No analytics. No account.</Bullet>
                    <Bullet>
                        History is opt-in and lives only in your browser. Disable or clear
                        it from the popup.
                    </Bullet>
                </ul>
            </>
        ),
    },
    {
        id: "permissions",
        group: "Trust & privacy",
        title: "Permissions explained",
        render: () => (
            <Table
                rows={[
                    ["activeTab", "Read your selection on the current tab when you click the toolbar."],
                    ["storage", "Save your API key, model, tone, and (optional) history."],
                    ["scripting", "Inject the toolbar overlay into the current page."],
                    ["host_permissions: <all_urls>", "Allow the toolbar to appear on any site you visit."],
                ]}
            />
        ),
    },

    {
        id: "troubleshooting",
        group: "Troubleshooting",
        title: "Common issues",
        render: () => (
            <>
                <FAQ
                    q="The toolbar doesn't appear when I select text"
                    a={
                        <>
                            Some sites use shadow DOM or block content scripts (e.g.,
                            Google Docs, Notion). Try a regular article page first to verify
                            the install. Reload the page after installing — already-open
                            tabs need a refresh.
                        </>
                    }
                />
                <FAQ
                    q='The "Test" button says "Connection failed"'
                    a={
                        <>
                            Check that the key matches the selected provider, that you
                            haven&apos;t exceeded the free tier, and — for OpenAI — that you
                            have a billing method configured. The full error message now
                            appears in red below the status.
                        </>
                    }
                />
                <FAQ
                    q="The result modal closes when I click outside"
                    a={
                        <>
                            That&apos;s by design. Press <Kbd>Esc</Kbd> if you want to
                            cancel a stream, or use{" "}
                            <strong className="text-white">Replace selection</strong> to
                            commit before closing.
                        </>
                    }
                />
                <FAQ
                    q="I want to use a different model"
                    a={
                        <>
                            Both providers expose multiple models in the popup&apos;s Model
                            dropdown. The list refreshes whenever you re-test your key.
                        </>
                    }
                />
            </>
        ),
    },
    {
        id: "uninstall",
        group: "Troubleshooting",
        title: "Uninstall",
        render: () => (
            <>
                <P>
                    Open your browser&apos;s extensions page, find TextAid, and click{" "}
                    <strong className="text-white">Remove</strong>. All keys, history, and
                    settings are wiped. Nothing remains on disk or anywhere else.
                </P>
            </>
        ),
    },
];

export function Docs() {
    const groups = useMemo(() => {
        const seen = new Map<string, Section[]>();
        for (const s of SECTIONS) {
            if (!seen.has(s.group)) seen.set(s.group, []);
            seen.get(s.group)!.push(s);
        }
        return Array.from(seen.entries());
    }, []);

    const [active, setActive] = useState<string>(SECTIONS[0].id);
    const location = useLocation();

    useEffect(() => {
        const id = location.hash.slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (el) {
            requestAnimationFrame(() =>
                el.scrollIntoView({ behavior: "smooth", block: "start" })
            );
            setActive(id);
        }
    }, [location.hash]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );
        SECTIONS.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="px-6 pt-24 pb-32 sm:pt-28">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[220px_1fr]">
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="mb-8">
                        <span className="eyebrow">Documentation</span>
                        <h1 className="font-display mt-2 text-[1.4rem] font-medium tracking-[-0.02em] text-white">
                            TextAid setup
                        </h1>
                    </div>

                    <nav className="space-y-7 text-[0.85rem]">
                        {groups.map(([group, items]) => (
                            <div key={group}>
                                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                                    {group}
                                </div>
                                <ul className="space-y-0.5">
                                    {items.map((s) => {
                                        const isActive = active === s.id;
                                        return (
                                            <li key={s.id}>
                                                <a
                                                    href={`#${s.id}`}
                                                    className={
                                                        "block border-l py-1 pl-3 transition-colors " +
                                                        (isActive
                                                            ? "border-white text-white"
                                                            : "border-white/[0.06] text-soft hover:border-white/30 hover:text-white")
                                                    }
                                                >
                                                    {s.title}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-10 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-[0.78rem]">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                            Help
                        </div>
                        <a
                            href={`${REPO}/issues/new`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-soft hover:text-white"
                        >
                            Open an issue ↗
                        </a>
                        <a
                            href={`${REPO}/discussions`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-soft hover:text-white"
                        >
                            Ask in discussions ↗
                        </a>
                    </div>
                </aside>

                <article className="min-w-0">
                    {SECTIONS.map((s, i) => (
                        <section
                            key={s.id}
                            id={s.id}
                            className={
                                "scroll-mt-24 " +
                                (i > 0 ? "mt-20 border-t border-white/[0.06] pt-16" : "")
                            }
                        >
                            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                                {s.group}
                            </div>
                            <h2 className="font-display text-[1.85rem] font-medium tracking-[-0.02em] text-white">
                                {s.title}
                            </h2>
                            <div className="mt-6">{s.render()}</div>
                        </section>
                    ))}

                    <div className="mt-24 flex items-center justify-between border-t border-white/[0.08] pt-8 text-[0.85rem]">
                        <Link to="/" className="text-soft hover:text-white">
                            ← Back to landing
                        </Link>
                        <a
                            href={`${REPO}/edit/main/landing/src/pages/Docs.tsx`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-soft hover:text-white"
                        >
                            Edit this page on GitHub ↗
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
}

/* ── Doc primitives ─────────────────────────────────────── */

function Lead({ children }: { children: React.ReactNode }) {
    return <p className="text-[1.02rem] leading-[1.7] text-white/80">{children}</p>;
}
function P({ children }: { children: React.ReactNode }) {
    return <p className="mt-5 text-[0.95rem] leading-[1.7] text-soft">{children}</p>;
}
function H4({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="font-display mt-10 text-[1rem] font-medium tracking-[-0.01em] text-white">
            {children}
        </h4>
    );
}
function Code({ children }: { children: React.ReactNode }) {
    return (
        <code className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.78em] text-white/85">
            {children}
        </code>
    );
}
function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center rounded-md border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.72em] text-white/90 shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]">
            {children}
        </kbd>
    );
}
function Block({ children }: { children: React.ReactNode }) {
    return (
        <pre className="mt-5 overflow-x-auto rounded-lg border border-white/[0.08] bg-[#0d0d0d] p-4 font-mono text-[0.78rem] leading-[1.6] text-white/85">
            <code>{children}</code>
        </pre>
    );
}
function Steps({ items }: { items: React.ReactNode[] }) {
    return (
        <ol className="mt-6 space-y-4">
            {items.map((it, i) => (
                <li key={i} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] font-mono text-[10px] tabular-nums text-white/80">
                        {i + 1}
                    </span>
                    <div className="text-[0.95rem] leading-[1.65] text-soft">{it}</div>
                </li>
            ))}
        </ol>
    );
}
function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex gap-3 text-[0.95rem] leading-[1.65]">
            <span className="mt-2.5 inline-block h-1 w-1 shrink-0 rounded-full bg-white/45" />
            <span>{children}</span>
        </li>
    );
}
function Callout({
    children,
    tone = "muted",
}: {
    children: React.ReactNode;
    tone?: "muted" | "info" | "warn";
}) {
    const styles = {
        muted: "border-white/[0.08] bg-white/[0.02] text-soft",
        info: "border-white/[0.12] bg-white/[0.03] text-white/80",
        warn: "border-amber-300/20 bg-amber-200/[0.04] text-amber-100/85",
    }[tone];
    return (
        <div className={"mt-6 rounded-lg border p-4 text-[0.88rem] leading-[1.6] " + styles}>
            {children}
        </div>
    );
}
function Table({ rows }: { rows: Array<[React.ReactNode, React.ReactNode]> }) {
    return (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.08]">
            <table className="w-full text-[0.85rem]">
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className={i > 0 ? "border-t border-white/[0.06]" : ""}>
                            <td className="w-[40%] px-4 py-3 align-top font-mono text-[0.78rem] text-white/90">
                                {r[0]}
                            </td>
                            <td className="px-4 py-3 align-top text-soft">{r[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
function FAQ({ q, a }: { q: React.ReactNode; a: React.ReactNode }) {
    return (
        <details className="group mt-3 rounded-lg border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.03]">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-[0.92rem] text-white/90 marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{q}</span>
                <span className="font-mono text-[14px] text-white/40 transition-transform group-open:rotate-45">
                    +
                </span>
            </summary>
            <div className="px-4 pb-4 text-[0.9rem] leading-[1.65] text-soft">{a}</div>
        </details>
    );
}
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-white underline-offset-4 hover:underline"
        >
            {children}
        </a>
    );
}
function Anchor({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <a href={`#${to}`} className="text-white underline-offset-4 hover:underline">
            {children}
        </a>
    );
}

function KeyCard({
    name,
    tag,
    url,
    bullets,
}: {
    name: string;
    tag: string;
    url: string;
    bullets: string[];
}) {
    return (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                    {tag}
                </span>
            </div>
            <h4 className="font-display mt-3 text-[1.1rem] font-medium tracking-[-0.01em] text-white">
                {name}
            </h4>
            <ul className="mt-4 space-y-2">
                {bullets.map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                ))}
            </ul>
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block text-[0.85rem] text-white underline-offset-4 hover:underline"
            >
                Get a key →
            </a>
        </div>
    );
}
