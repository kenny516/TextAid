import React, { useMemo } from 'react';
import { motion, type Transition } from 'motion/react';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: Transition['ease'];
  splitType?: 'chars' | 'words';
  from?: { opacity?: number; y?: number; x?: number; filter?: string };
  to?: { opacity?: number; y?: number; x?: number; filter?: string };
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
}

/**
 * Lightweight motion-based SplitText (replaces GSAP SplitText / Club plugin).
 * Splits text into chars or words and animates each element on mount.
 */
const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 35,
  duration = 0.9,
  ease = [0.2, 0.7, 0.2, 1],
  splitType = 'chars',
  from = { opacity: 0, y: 32, filter: 'blur(8px)' },
  to = { opacity: 1, y: 0, filter: 'blur(0px)' },
  tag = 'p',
  textAlign = 'center',
  onAnimationComplete
}) => {
  const segments = useMemo(() => {
    if (splitType === 'words') return text.split(/(\s+)/);
    // chars: keep words intact for line-wrapping; we render per-char inside per-word
    return text.split(/(\s+)/);
  }, [text, splitType]);

  const Tag = tag as React.ElementType;

  let animatableIndex = 0;
  const totalAnimatable =
    splitType === 'words'
      ? segments.filter(s => s.trim().length > 0).length
      : Array.from(text).filter(c => c.trim().length > 0).length;

  return (
    <Tag
      className={className}
      style={{ textAlign, wordWrap: 'break-word' }}
      aria-label={text}
    >
      {segments.map((segment, segIdx) => {
        const isSpace = /^\s+$/.test(segment);
        if (isSpace) {
          return (
            <span key={`s-${segIdx}`} aria-hidden style={{ whiteSpace: 'pre' }}>
              {segment}
            </span>
          );
        }
        if (splitType === 'words') {
          const i = animatableIndex++;
          return (
            <motion.span
              key={`w-${segIdx}`}
              aria-hidden
              className="inline-block will-change-transform"
              initial={from}
              animate={to}
              transition={{ duration, ease, delay: (i * delay) / 1000 }}
              onAnimationComplete={i === totalAnimatable - 1 ? onAnimationComplete : undefined}
            >
              {segment}
            </motion.span>
          );
        }
        // chars within a word, kept inline-block to prevent breaking mid-word
        return (
          <span key={`w-${segIdx}`} className="inline-block whitespace-nowrap">
            {Array.from(segment).map((ch, cIdx) => {
              const i = animatableIndex++;
              return (
                <motion.span
                  key={`c-${segIdx}-${cIdx}`}
                  aria-hidden
                  className="inline-block will-change-transform"
                  initial={from}
                  animate={to}
                  transition={{ duration, ease, delay: (i * delay) / 1000 }}
                  onAnimationComplete={i === totalAnimatable - 1 ? onAnimationComplete : undefined}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
