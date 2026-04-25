import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-[-0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-white !text-black hover:bg-white/90 [&>*]:!text-black",
                outline:
                    "border border-white/15 bg-transparent !text-white hover:bg-white/5 [&>*]:!text-white",
                ghost:
                    "!text-white/75 hover:!text-white hover:bg-white/[0.06] [&>*]:!text-inherit",
                link:
                    "!text-white/80 hover:!text-white underline-offset-4 hover:underline [&>*]:!text-inherit",
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
