/**
 * A faux browser window containing a paragraph of text with a
 * "selected" excerpt and the TextAid floating toolbar nearby.
 */
export function ExtensionMockup() {
    return (
        <div className="dark-zone relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            {/* Faux browser chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="font-mono text-[0.7rem] text-white/45">
                    medium.com / the-future-of-writing
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-md bg-white/[0.04]" />
                    <div className="h-5 w-5 rounded-md bg-white/[0.04]" />
                </div>
            </div>

            {/* Page body */}
            <div className="relative mt-4 grid gap-6 rounded-xl bg-[#0f0f0f] p-7 sm:p-12">
                <div>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/35">
                        Essay · 7 min read
                    </span>
                    <h3 className="font-display mt-3 text-2xl font-medium tracking-tight text-white sm:text-[1.85rem]">
                        The quiet death of the blank page
                    </h3>
                </div>

                <p className="text-[0.98rem] leading-[1.75] text-white/65 sm:text-[1.05rem]">
                    For decades, the cursor has been a tiny vertical accusation.
                    Writing meant{" "}
                    <mark className="rounded-sm bg-white/10 px-1.5 py-0.5 text-white outline outline-1 outline-white/20">
                        staring at emptiness until something{"\u00a0"}emerged
                    </mark>
                    . Today the cursor still blinks — but a soft, listening intelligence
                    blinks alongside it, ready when invited. Not to write for you, but
                    with you.
                </p>

                <p className="text-[0.98rem] leading-[1.75] text-white/45 sm:text-[1.05rem]">
                    The page is no longer blank.
                </p>
            </div>

            <FloatingToolbar />
            <SuggestionCard />
        </div>
    );
}

function FloatingToolbar() {
    return (
        <div
            className="absolute rounded-[10px] border border-white/[0.08] bg-[#0a0a0a] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            style={{
                top: "calc(50% - 6px)",
                left: "8%",
            }}
        >
            <div className="flex items-center gap-[2px]">
                <ToolBtn icon={<SummarizeIcon />} label="Summarize" showLabel />
                <ToolBtn icon={<RewriteIcon />} label="Rewrite" />
                <ToolBtn icon={<IdeasIcon />} label="Ideas" />
                <ToolBtn icon={<ExpandIcon />} label="Expand" />
                <span className="mx-[2px] h-4 w-px bg-white/[0.08]" />
                <ToolBtn icon={<MoreIcon />} label="More" />
            </div>
        </div>
    );
}

function ToolBtn({
    icon,
    label,
    showLabel,
}: {
    icon: React.ReactNode;
    label: string;
    showLabel?: boolean;
}) {
    return (
        <button
            aria-label={label}
            className={
                "inline-flex h-7 items-center justify-center gap-1.5 rounded-md text-white/85 transition-colors hover:bg-white/[0.06] " +
                (showLabel ? "px-2.5 text-[0.72rem]" : "w-7")
            }
        >
            <span className="text-white/80">{icon}</span>
            {showLabel && <span className="font-medium">{label}</span>}
        </button>
    );
}

function SuggestionCard() {
    return (
        <div
            className="absolute hidden overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.6)] lg:block"
            style={{
                right: "5%",
                bottom: "8%",
                width: "300px",
            }}
        >
            {/* Header — matches modal head: 44px, mono uppercase label */}
            <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-4">
                <div className="flex items-center gap-2.5">
                    <span className="relative inline-flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/60">
                        Summary
                    </span>
                    <span className="font-mono text-[0.6rem] text-white/30">·</span>
                    <span className="font-mono text-[0.6rem] text-white/40">streaming</span>
                </div>
                <button
                    aria-label="Close"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/45 hover:bg-white/[0.06] hover:text-white/80"
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <ul className="space-y-2 px-4 py-3.5 text-[0.83rem] leading-[1.55] text-white/80">
                <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/45" />
                    Writing is no longer solitary — AI sits beside the cursor.
                </li>
                <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/45" />
                    The blank page becomes a lit, listening surface.
                </li>
                <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/45" />
                    Tools should write <em className="not-italic text-white">with</em> you, not for you.
                </li>
            </ul>
        </div>
    );
}

function SummarizeIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
function RewriteIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20l4-1 11.5-11.5a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}
function ExpandIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 14v6h6M20 10V4h-6M4 20l7-7M20 4l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IdeasIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V15h5.2v-1.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}
function MoreIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
        </svg>
    );
}
