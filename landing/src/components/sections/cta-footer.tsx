import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function CtaFooter() {
    return (
        <section className="px-6 pt-20 pb-12 sm:pt-32">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="eyebrow">Ready when you are</span>
                    <h2 className="display-lg mt-4 text-white">
                        Make every page a writing tool.
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-soft">
                        Install TextAid in under a minute. Bring your own key. Keep your
                        workflow. Lose the tab-switching forever.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button size="lg" variant="primary" asChild>
                            <a href="#install">Download TextAid</a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to="/docs">Read the docs</Link>
                        </Button>
                    </div>

                    <p className="mt-6 font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
                        MIT licensed · No telemetry · No account required
                    </p>
                </div>

                <footer className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/[0.08] pt-10 sm:flex-row">
                    <div className="flex items-center gap-2.5">
                        <span
                            aria-hidden
                            className="inline-block h-4 w-4 rounded-full border border-white"
                        />
                        <span className="font-display text-[0.95rem] font-medium tracking-[-0.02em] text-white">
                            TextAid
                        </span>
                        <span className="ml-2 text-[0.78rem] text-muted">
                            © {new Date().getFullYear()}
                        </span>
                    </div>

                    <nav className="flex items-center gap-5 text-[0.85rem] text-soft">
                        <a href="#features" className="hover:text-white">Features</a>
                        <Link to="/docs" className="hover:text-white">Docs</Link>
                        <a href="#privacy" className="hover:text-white">Privacy</a>
                        <a
                            href="https://github.com/kenny516/TextAid"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://github.com/kenny516/TextAid/blob/main/LICENSE"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white"
                        >
                            License
                        </a>
                    </nav>
                </footer>
            </div>
        </section>
    );
}
