import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { cn } from "@/libs/utils";
import { cva, type VariantProps } from "class-variance-authority";

const appLoadingDotsVariants = cva("rounded-full bg-cyan-500", {
  variants: {
    size: {
      custom: "",
      "3xs": "size-1",
      "2xs": "size-1.25",
      xs: "size-1.5",
      sm: "size-1.75",
      md: "size-2",
      lg: "size-2.25",
      xl: "size-2.5",
      "2xl": "size-2.75",
      "3xl": "size-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type AppLoadingDotsSize = NonNullable<
  VariantProps<typeof appLoadingDotsVariants>["size"]
>;

type AppLoadingDotsAnimation = "scale" | "bounce";

export interface AppLoadingDotsProps extends ComponentProps<"div"> {
  /** The size of the dots. Default is "md". */
  size?: AppLoadingDotsSize;
  /** The animation of the Dots. Default is "scale" */
  animation?: AppLoadingDotsAnimation;
  dotClassName?: string;
}

export const AppLoadingDots = ({
  size = "md",
  animation = "scale",
  className,
  dotClassName,
}: AppLoadingDotsProps) => {
  return (
    <div
      className={cn(
        "h-full flex items-center justify-center gap-1.5 p-1.5",
        className,
      )}
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className={cn(appLoadingDotsVariants({ size }), dotClassName)}
          animate={{
            scale: animation === "scale" ? [1, 1.3, 1] : [],
            y: animation === "bounce" ? [0, -3, 0] : [],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot * 0.25,
          }}
        />
      ))}
    </div>
  );
};
