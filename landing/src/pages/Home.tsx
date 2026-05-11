import { Helmet } from "react-helmet-async";
import { Navbar } from "../components/sections/navbar";
import { Hero } from "../components/sections/hero";
import { LiveDemo } from "../components/sections/live-demo";
import { Features } from "../components/sections/features";
import { Providers } from "../components/sections/providers";
import { Privacy } from "../components/sections/privacy";
import { Download } from "../components/sections/download";
import { Support } from "../components/sections/support";
import { CtaFooter } from "../components/sections/cta-footer";

export function Home() {
    return (
        <>
            <Helmet>
                <title>TextAid — Free AI Writing Assistant Browser Extension</title>
                <meta
                    name="description"
                    content="TextAid is a free, open-source AI browser extension for Chrome and Firefox. Summarize, rewrite, translate and expand any text on any webpage — powered by your own OpenAI or Gemini API key. No account required."
                />
                <link rel="canonical" href="https://text-aid.vercel.app/" />
                <meta property="og:url" content="https://text-aid.vercel.app/" />
                <meta property="og:title" content="TextAid — Free AI Writing Assistant Browser Extension" />
                <meta
                    property="og:description"
                    content="Summarize, rewrite, translate and expand any text on any webpage — powered by your own OpenAI or Gemini key. Free, open-source, no account required."
                />
            </Helmet>
            <Navbar />
            <main>
                <Hero />
                <LiveDemo />
                <Features />
                <Providers />
                <Privacy />
                <Download />
                <Support />
                <CtaFooter />
            </main>
        </>
    );
}
