import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  splitBy?: "word" | "letter";
  direction?: "bottom" | "top";
};

export function BlurText({
  text,
  className,
  delay = 100,
  splitBy = "word",
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const pieces = useMemo(
    () => (splitBy === "letter" ? text.split("") : text.split(" ")),
    [splitBy, text],
  );

  const startY = direction === "bottom" ? 50 : -50;
  const overshootY = direction === "bottom" ? -5 : 5;

  return (
    <h1 ref={ref} className={cn("flex flex-wrap justify-center", className)}>
      {pieces.map((piece, index) => {
        const content = splitBy === "word" ? `${piece} ` : piece;
        return (
          <motion.span
            key={`${piece}-${index}`}
            initial={{ filter: "blur(10px)", opacity: 0, y: startY }}
            animate={
              visible
                ? {
                    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                    opacity: [0, 0.5, 1],
                    y: [startY, overshootY, 0],
                  }
                : undefined
            }
            transition={{
              duration: 1.05,
              delay: (index * delay) / 1000,
              ease: "easeOut",
              times: [0, 0.55, 1],
            }}
            className="inline-block will-change-transform"
          >
            {content === " " ? "\u00A0" : content}
          </motion.span>
        );
      })}
    </h1>
  );
}
