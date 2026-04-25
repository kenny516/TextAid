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
