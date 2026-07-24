import { useEffect, useRef } from "react";
import { cn } from "@/libs/utils";

export const AppTextArea = ({
  className,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;

    const handleFocus = () => {
      setTimeout(() => {
        textarea?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    };

    textarea?.addEventListener("focus", handleFocus);
    return () => {
      textarea?.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <textarea
      ref={textareaRef}
      spellCheck
      className={cn(
        className,
        "max-h-80 resize-none align-middle",
        "border-0 outline-none focus:outline-none focus:ring-0",
      )}
      placeholder="Ask me anything"
      rows={1}
      value={value}
      {...props}
    />
  );
};
