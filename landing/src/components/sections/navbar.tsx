import { Button } from "../ui/button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                <a href="#top" className="flex items-center gap-2">
                    <Logo />
                    <span className="font-display text-[0.95rem] font-medium tracking-[-0.02em]">
                        TextAid
                    </span>
                </a>

                <nav className="hidden items-center gap-6 md:flex">
                    {[
                        ["Features", "#features"],
                        ["Demo", "#demo"],
                        ["Providers", "#providers"],
                        ["Privacy", "#privacy"],
                    ].map(([label, href]) => (
                        <a
                            key={href}
                            href={href}
                            className="text-[0.85rem] text-white/60 transition-colors hover:text-white"
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/kenny516/TextAid"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden text-[0.85rem] text-white/60 transition-colors hover:text-white sm:inline"
                    >
                        GitHub
                    </a>
                    <Button size="sm" variant="primary" asChild>
                        <a href="#install">Install</a>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function Logo() {
    return (
        <span
            aria-hidden
            className="inline-block h-4 w-4 rounded-full border border-white"
        />
    );
}
