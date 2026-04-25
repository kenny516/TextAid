import { ArrowUpRight } from "lucide-react";
import { HlsVideo } from "@/components/hls-video";
import { Button } from "@/components/ui/button";

export function CtaFooter() {
  return (
    <section id="download" className="relative overflow-hidden pb-10 pt-24 md:pb-12 md:pt-32">
      <div className="absolute inset-0">
        <HlsVideo src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8" />
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-5xl italic leading-[0.85] text-white md:text-6xl lg:text-7xl">
            Bring TextAid into every writing session.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-sm font-light leading-7 text-white/70 md:text-base">
            Install the extension, connect your preferred model, and turn any web page into
            a faster place to think, write, and ship.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <a href="https://chromewebstore.google.com/" target="_blank" rel="noreferrer">
                Download for Chrome
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                View source
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-32 flex flex-col gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-body text-xs text-white/40">© 2026 TextAid. All rights reserved.</p>
          <div className="flex items-center justify-center gap-6 md:justify-end">
            <a href="#home" className="font-body text-xs text-white/40 transition hover:text-white/70">
              Privacy
            </a>
            <a href="#features" className="font-body text-xs text-white/40 transition hover:text-white/70">
              Terms
            </a>
            <a href="#download" className="font-body text-xs text-white/40 transition hover:text-white/70">
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
