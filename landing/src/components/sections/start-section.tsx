import { ArrowUpRight } from "lucide-react";
import { HlsVideo } from "@/components/hls-video";
import { Button } from "@/components/ui/button";

export function StartSection() {
  return (
    <section id="workflow" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <HlsVideo src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8" />
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="liquid-glass rounded-full px-3.5 py-1">
          <span className="font-body text-xs font-medium text-white">How It Works</span>
        </div>
        <h2 className="mt-6 font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-6xl">
          Select it. Shape it. Send it.
        </h2>
        <p className="mt-6 max-w-2xl font-body text-sm font-light text-white/65 md:text-base">
          Highlight any passage and TextAid turns clutter into clarity. Summaries,
          rephrases, idea generation, and sentence completion happen inside the page you
          already use.
        </p>
        <Button asChild size="lg" className="mt-10 rounded-full">
          <a href="#download">
            Get Started
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
