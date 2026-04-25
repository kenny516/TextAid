import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-sans text-sm font-medium tracking-[-0.02em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-bg)] text-[var(--primary-text)] hover:bg-[var(--primary-hover)]",
        secondary: "bg-[var(--text)] text-[var(--bg)] hover:opacity-90",
        ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--panel)]",
        outline: "border border-[var(--line)] bg-transparent text-[var(--text)] hover:bg-[var(--panel)]",
      },
      size: {
        default: "px-5 py-2.5",
        lg: "px-6 py-3.5",
        sm: "px-3.5 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
