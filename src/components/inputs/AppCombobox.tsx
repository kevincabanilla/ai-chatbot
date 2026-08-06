"use client";

import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/libs/utils";

const comboboxVariants = cva(
  [
    "w-full flex items-center justify-between border",
    "bg-bg-secondary px-3 py-2 text-sm",
    "outline-none transition-colors",
    "focus-visible:ring-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        normal: "border-accent/30",
        outline: "border-accent/30 bg-transparent",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "normal",
      size: "md",
    },
  },
);

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ComboboxProps extends VariantProps<typeof comboboxVariants> {
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: ComboboxOption[];
  ref?: Ref<HTMLButtonElement>;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const AppCombobox = ({
  className,
  disabled,
  emptyMessage = "No results.",
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  options,
  variant,
  size,
  ref,
  value,
  onValueChange,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query) return options;

    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handler);

    return () => {
      window.removeEventListener("mousedown", handler);
    };
  }, []);

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;

    onValueChange?.(option.value);

    setOpen(false);
    setQuery("");
    setHighlighted(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((p) => Math.min(p + 1, filtered.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlighted((p) => Math.max(0, p - 1));
        break;

      case "Enter":
        e.preventDefault();
        select(filtered[highlighted]);
        break;

      case "Escape":
        e.stopPropagation();
        setOpen(false);
        setQuery("");
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
        }}
        className={cn(
          comboboxVariants({
            variant,
            size,
          }),
          open ? "rounded-t-lg" : "rounded-lg",
          className,
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>

        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 w-full rounded-b-lg border border-t-0 border-accent/30 bg-bg-secondary shadow-lg">
          <div className="border-b border-accent/30 p-3">
            <input
              ref={inputRef}
              className="w-full rounded-md bg-transparent text-sm outline-none"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onKeyDown={onKeyDown}
            />
          </div>

          <ul className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-slate-400/60">
                {emptyMessage}
              </li>
            )}

            {filtered.map((option, index) => {
              const active = option.value === value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    highlighted === index && "bg-accent/20",
                    active && "font-medium text-accent",
                    option.disabled && "pointer-events-none opacity-50",
                  )}
                  onMouseEnter={() => {
                    setHighlighted(index);
                  }}
                  onMouseLeave={() => {
                    setHighlighted(-1);
                  }}
                  onClick={() => {
                    select(option);
                  }}
                >
                  {option.label}

                  {active && <Check size={16} className="text-green-400" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
