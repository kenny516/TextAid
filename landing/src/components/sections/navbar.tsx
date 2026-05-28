import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { GitHubStars } from "../github-stars";
import { ThemeToggle } from "../theme-toggle";

export function Navbar() {
    const location = useLocation();
    const onHome = location.pathname === "/";
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems: Array<[string, string]> = onHome
        ? [
            ["Features", "#features"],
            ["Demo", "#demo"],
            ["Providers", "#providers"],
            ["Install", "#install"],
            ["Support", "#support"],
        ]
        : [
            ["Home", "/"],
            ["Install", "/#install"],
        ];

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
                    <Logo />
                    <span className="font-display text-[0.95rem] font-medium tracking-[-0.02em]">
                        TextAid
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map(([label, href]) =>
                        href.startsWith("#") || href.startsWith("/#") ? (
                            <a
                                key={href}
                                href={href}
                                className="text-[0.85rem] text-white/60 transition-colors hover:text-white"
                            >
                                {label}
                            </a>
                        ) : (
                            <Link
                                key={href}
                                to={href}
                                className="text-[0.85rem] text-white/60 transition-colors hover:text-white"
                            >
                                {label}
                            </Link>
                        ),
                    )}
                    <Link
                        to="/docs"
                        className={
                            "text-[0.85rem] transition-colors " +
                            (location.pathname.startsWith("/docs")
                                ? "text-[var(--accent)]"
                                : "text-white/60 hover:text-white")
                        }
                    >
                        Docs
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/kenny516/TextAid"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub repository"
                        className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white"
                    >
                        <img src="/icons/github.svg" alt="" aria-hidden className="h-4 w-4 invert opacity-60 hover:opacity-100 transition-opacity" />
                    </a>
                    <GitHubStars className="hidden sm:inline-flex" />
                    <ThemeToggle />
                    <Button size="sm" variant="primary" asChild className="hidden md:inline-flex">
                        <a href={onHome ? "#install" : "/#install"}>Install</a>
                    </Button>
                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((o) => !o)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
                    >
                        {mobileOpen ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile slide-down menu */}
            {mobileOpen && (
                <div className="border-t border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
                    <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4 gap-1">
                        {navItems.map(([label, href]) =>
                            href.startsWith("#") || href.startsWith("/#") ? (
                                <a
                                    key={href}
                                    href={href}
                                    onClick={closeMobile}
                                    className="rounded-md px-3 py-2.5 text-[0.9rem] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                    {label}
                                </a>
                            ) : (
                                <Link
                                    key={href}
                                    to={href}
                                    onClick={closeMobile}
                                    className="rounded-md px-3 py-2.5 text-[0.9rem] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                                >
                                    {label}
                                </Link>
                            ),
                        )}
                        <Link
                            to="/docs"
                            onClick={closeMobile}
                            className={
                                "rounded-md px-3 py-2.5 text-[0.9rem] transition-colors " +
                                (location.pathname.startsWith("/docs")
                                    ? "text-[var(--accent)]"
                                    : "text-white/70 hover:bg-white/[0.06] hover:text-white")
                            }
                        >
                            Docs
                        </Link>
                        <div className="mt-3 pt-3 border-t border-white/[0.08]">
                            <a
                                href={onHome ? "#install" : "/#install"}
                                onClick={closeMobile}
                                className="btn-primary-themed inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-[0.875rem] font-medium"
                            >
                                Install TextAid
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

function Logo() {
    return (
        <img
            src="/icon-textaid.png"
            alt=""
            aria-hidden
            className="h-5 w-5 rounded"
        />
    );
}
