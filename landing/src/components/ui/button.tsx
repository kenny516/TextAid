import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-[-0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hairline-strong)] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "btn-primary-themed",
                outline:
                    "btn-outline-themed",
                ghost:
                    "btn-ghost-themed",
                link:
                    "btn-link-themed",
            },
            size: {
                default: "h-9 px-4 text-sm",
                sm: "h-8 px-3 text-sm",
                lg: "h-10 px-5 text-sm",
            },
        },
        defaultVariants: {
            variant: "primary",
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
