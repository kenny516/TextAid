import { Button } from "../ui/button";
import { ExtensionMockup } from "./extension-mockup";
import SplitText from "../reactbits/SplitText";

export function Hero() {
    return (
        <section
            id="top"
            className="px-6 pt-32 pb-20 sm:pt-40"
        >
            <div className="mx-auto max-w-5xl text-center">
                <span className="eyebrow">v0.4 · Free, open source</span>

                <div className="mt-6">
                    <SplitText
                        tag="h1"
                        text="AI writing for every page."
                        className="display-xl text-white"
                        textAlign="center"
                        splitType="words"
                        delay={60}
                        duration={0.6}
                        from={{ opacity: 0, y: 12 }}
                        to={{ opacity: 1, y: 0 }}
                    />
                </div>

                <p className="reveal mx-auto mt-6 max-w-[580px] text-soft">
                    A quiet writing layer for your browser. Summarize, rewrite, and expand
                    text on any page — without ever leaving the tab.
                </p>

                <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button size="lg" variant="primary" asChild>
                        <a href="#install">Install for Chrome</a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a
                            href="https://github.com/kenny516/TextAid"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View on GitHub
                        </a>
                    </Button>
                </div>

                <p className="reveal mt-6 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                    Bring your own key · Gemini &amp; GPT-4o · Works on every site
                </p>
            </div>

            <div className="reveal mx-auto mt-20 max-w-5xl">
                <ExtensionMockup />
            </div>
        </section>
    );
}
