import { useEffect, useRef } from "react";
import clsx from "clsx";

export const PromptTextArea = ({
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

  return (
    <textarea
      ref={textareaRef}
      autoFocus
      spellCheck
      className={clsx(
        className,
        "max-h-80 resize-none align-middle",
        "border-0 outline-none focus:outline-none focus:ring-0",
      )}
      placeholder="Ask me anything"
      rows={1}
      {...props}
    />
  );
};
