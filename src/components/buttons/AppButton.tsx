import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";

const appButtonStyles = cva(
  [
    "text-accent/90",
    "font-semibold",
    "backdrop-blur-md",
    "transition-all duration-300 ease-out",
    "transition-[background,border-color,box-shadow,color,transform]",
  ],
  {
    variants: {
      variant: {
        outline: "bg-transparent border border-accent/40",
        tonal: "bg-accent/2",
        ghost: "bg-transparent",
        plain: "",
      },

      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-8 py-3",
        lg: "px-8.5 py-3.5 text-lg",
      },

      disabled: {
        true: "opacity-60 cursor-not-allowed",
        false: "opacity-100 cursor-pointer",
      },
    },

    defaultVariants: {
      variant: "outline",
      size: "sm",
      disabled: false,
    },

    compoundVariants: [
      {
        disabled: false,
        className: ["hover:-translate-y-px hover:text-accent"],
      },
      {
        variant: "outline",
        disabled: false,
        className: ["hover:bg-bg-secondary/60 hover:border-accent/60"],
      },
      {
        variant: ["tonal", "ghost"],
        disabled: false,
        className: ["hover:bg-accent/5"],
      },
    ],
  },
);

type ButtonProps = VariantProps<typeof appButtonStyles> & {
  isLoading?: boolean;
  loadingMessage?: string;
} & ComponentProps<typeof motion.button>;

export default function AppButton({
  isLoading,
  loadingMessage,
  className,
  variant,
  size,
  children,
  whileHover,
  whileTap,
  disabled,
  ...props
}: ButtonProps) {
  const styles = cn(appButtonStyles({ variant, size, disabled }), className);

  return (
    <motion.button
      className={styles}
      disabled={disabled}
      whileHover={disabled ? undefined : (whileHover ?? { scale: 1.04 })}
      whileTap={disabled ? undefined : (whileTap ?? { scale: 0.98 })}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.div
            role="status"
            aria-label={loadingMessage}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 0.7,
            }}
          />
          {loadingMessage && <span>{loadingMessage}</span>}
        </>
      ) : (
        <>{children}</>
      )}
    </motion.button>
  );
}
