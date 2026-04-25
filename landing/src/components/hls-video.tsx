import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

type HlsVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  desaturate?: boolean;
};

export function HlsVideo({ src, className, poster, desaturate = false }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      className={cn("h-full w-full object-cover", desaturate && "saturate-0", className)}
    />
  );
}
