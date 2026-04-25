import { Navbar } from "./components/sections/navbar";
import { Hero } from "./components/sections/hero";
import { LiveDemo } from "./components/sections/live-demo";
import { Features } from "./components/sections/features";
import { Providers } from "./components/sections/providers";
import { Privacy } from "./components/sections/privacy";
import { CtaFooter } from "./components/sections/cta-footer";

export default function App() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <main>
                <Hero />
                <LiveDemo />
                <Features />
                <Providers />
                <Privacy />
                <CtaFooter />
            </main>
        </div>
    );
}
