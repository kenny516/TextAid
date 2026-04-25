import { useEffect, useState } from "react";

const REPO = "kenny516/TextAid";
const CACHE_KEY = "textaid:gh-stars";
const TTL_MS = 1000 * 60 * 60; // 1h

function format(n: number): string {
    if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

type Cached = { n: number; at: number };

export function GitHubStars({ className = "" }: { className?: string }) {
    const [stars, setStars] = useState<number | null>(() => {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const cached: Cached = JSON.parse(raw);
            if (Date.now() - cached.at < TTL_MS) return cached.n;
        } catch {
            /* noop */
        }
        return null;
    });

    useEffect(() => {
        let cancelled = false;
        const fetchStars = async () => {
            try {
                const r = await fetch(`https://api.github.com/repos/${REPO}`, {
                    headers: { Accept: "application/vnd.github+json" },
                });
                if (!r.ok) return;
                const data = await r.json();
                const n = Number(data.stargazers_count);
                if (cancelled || !Number.isFinite(n)) return;
                setStars(n);
                try {
                    localStorage.setItem(
                        CACHE_KEY,
                        JSON.stringify({ n, at: Date.now() }),
                    );
                } catch {
                    /* noop */
                }
            } catch {
                /* silent — keep cached or hidden */
            }
        };
        fetchStars();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noreferrer"
            aria-label={
                stars != null
                    ? `Star TextAid on GitHub (${stars} stars)`
                    : "Star TextAid on GitHub"
            }
            className={
                "inline-flex h-7 items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 pr-2 pl-2 text-[0.78rem] text-amber-300 transition-colors hover:border-amber-500/50 hover:bg-amber-500/15 hover:text-amber-200 " +
                className
            }
        >
            <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                aria-hidden
                className="shrink-0 text-amber-400"
                fill="currentColor"
            >
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            <span className="font-mono tabular-nums">Star</span>
            <span className="ml-0.5 h-3 w-px bg-amber-500/25" aria-hidden />
            <span className="font-mono tabular-nums text-amber-400/70">
                {stars != null ? format(stars) : "—"}
            </span>
        </a>
    );
}
