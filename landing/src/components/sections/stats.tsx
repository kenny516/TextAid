import { HlsVideo } from "@/components/hls-video";

const stats = [
  { value: "3 actions", label: "Summarize, rewrite, expand" },
  { value: "2 providers", label: "OpenAI and Gemini support" },
  { value: "Any page", label: "Works across the browser" },
  { value: "0 tab hops", label: "Everything happens in context" },
];

export function Stats() {
  return (
    <section id="proof" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <HlsVideo
          src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
          desaturate
        />
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="liquid-glass mx-auto rounded-[1.75rem] p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-4xl italic text-white md:text-5xl lg:text-6xl">
                  {stat.value}
                </div>
                <p className="mt-3 font-body text-sm font-light text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
