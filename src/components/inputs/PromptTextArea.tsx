import clsx from "clsx";

export const PromptTextArea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    // preserve consumer's onChange
    props.onChange?.(e);
  };

  return (
    <textarea
      autoFocus
      spellCheck
      className={clsx(
        className,
        "w-full md:w-2xl max-h-80",
        "resize-none align-middle",
        "border-0 outline-none focus:outline-none focus:ring-0",
      )}
      placeholder="Ask me anything"
      rows={1}
      {...props}
      onChange={handleChange}
    />
  );
};
