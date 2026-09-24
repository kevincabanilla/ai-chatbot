import type { ComponentProps } from "react";
import { Check } from "lucide-react";
import { cn } from "@/libs/utils";
import type { AiModeDetail } from "@/interfaces";

export interface ModeSelectionItemProps
  extends AiModeDetail, ComponentProps<"button"> {
  selected?: boolean;
}

export const ModeSelectionItem = ({
  label,
  description,
  icon: Icon,
  iconColor,
  selected = false,
  ...props
}: ModeSelectionItemProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "relative rounded-xl border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
        selected
          ? "border-sky-300/65 bg-sky-300/12"
          : "border-white/10 bg-white/2.5 hover:border-white/25 hover:bg-white/5",
      )}
      {...props}
    >
      <div
        className={cn(
          "flex gap-3 flex-row md:flex-col items-center md:items-start mb-2.5 sm:mb-5",
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg bg-white/5",
            iconColor,
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="block text-sm md:text-base font-semibold text-white">
          {label}
        </span>
      </div>

      <span className="block text-xs leading-5 text-white/45">
        {description}
      </span>

      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-sky-300 text-[#101923]">
          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
      )}
    </button>
  );
};
