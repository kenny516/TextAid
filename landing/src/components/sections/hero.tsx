import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { BlurText } from "@/components/blur-text";
import { Button } from "@/components/ui/button";

const partners = ["Chrome", "Docs", "Notion", "Gmail", "LinkedIn"];

export function Hero() {
  return (
    <section id="home" className="relative overflow-visible">
      <div className="relative h-[980px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
          className="absolute left-0 top-[20%] z-0 h-auto w-full object-contain opacity-65"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 z-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 z-0 h-[300px] bg-gradient-to-b from-transparent to-black" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center px-6 pb-8 pt-[150px] text-center md:px-10">
          <div className="liquid-glass rounded-full px-1 py-1">
            <div className="flex items-center gap-3 rounded-full px-2 py-1 pr-4">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black">
                New
              </span>
              <span className="font-body text-xs font-medium text-white/90 md:text-sm">
                The AI writing companion built for the whole browser.
              </span>
            </div>
          </div>

          <div className="mt-10 max-w-5xl">
            <BlurText
              text="The writing edge your work deserves"
              delay={100}
              direction="bottom"
              className="justify-center font-heading text-5xl italic leading-[0.86] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            />
          </div>

          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            className="mt-8 max-w-2xl font-body text-sm font-light leading-tight text-white/75 md:text-base"
          >
            TextAid summarizes pages, rewrites rough drafts, expands ideas, and offers
            contextual suggestions right where you type. Fewer tabs. Better sentences.
            Faster work.
          </motion.p>

          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-full">
              <a href="#download">
                Download for Chrome
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full px-2">
              <a href="#workflow">
                <Play className="h-4 w-4 fill-white text-white" />
                Watch the flow
              </a>
            </Button>
          </motion.div>

          <div className="mt-auto flex w-full flex-col items-center gap-6 pb-8 pt-16">
            <div className="liquid-glass rounded-full px-3.5 py-1">
              <span className="font-body text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                Built for the tools behind modern work
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {partners.map((partner) => (
                <span key={partner} className="font-heading text-2xl italic text-white md:text-3xl">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
