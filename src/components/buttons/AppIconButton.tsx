import { type ComponentPropsWithRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";

const appIconButtonVariants = cva(
  [
    "cursor-pointer",
    "inline-flex items-center justify-center",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-1",
    "focus-visible:ring-sky-400",
    "focus-visible:ring-offset-1",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground hover:bg-primary",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        accent: "bg-accent/80 text-accent-foreground hover:bg-accent",
        outline: [
          "border border-secondary/40 hover:border-secondary/60",
          "bg-transparent hover:bg-accent/5 hover:text-secondary",
        ],
        ghost: "text-foreground/90 hover:text-foreground hover:bg-accent/5 ",
        plain: "text-foreground/90 hover:text-foreground bg-transparent",
      },
      size: {
        xs: "h-6 w-6 [&>svg]:h-3.5 [&>svg]:w-3.5",
        sm: "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4",
        md: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
        lg: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
      },
      rounded: {
        false: "rounded-xl",
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: false,
    },
  },
);

export interface AppIconButtonProps
  extends
    ComponentPropsWithRef<"button">,
    VariantProps<typeof appIconButtonVariants> {
  icon: LucideIcon;
  label: string;
}

export const AppIconButton = ({
  icon: Icon,
  label,
  variant,
  size,
  rounded,
  className,
  type = "button",
  ref,
  ...props
}: AppIconButtonProps) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        appIconButtonVariants({
          variant,
          size,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" />
    </button>
  );
};
