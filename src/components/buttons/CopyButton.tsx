import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/libs/utils";
import { AppIconButton } from "./AppIconButton";

export interface CopyButtonProps {
  onCopyToClipboard: () => void;
}

export const CopyButton = ({ onCopyToClipboard }: CopyButtonProps) => {
  const [contentCopied, setContentCopied] = useState(false);

  const copyContent = () => {
    setContentCopied(true);
    onCopyToClipboard();
    setTimeout(() => {
      setContentCopied(false);
    }, 2500);
  };

  return (
    <AppIconButton
      enableTooltip
      className={cn(!contentCopied && "rotate-90")}
      size="sm"
      variant="ghost"
      label="Copy"
      tooltip={contentCopied ? "Copied" : "Copy"}
      icon={contentCopied ? Check : Copy}
      onClick={() => {
        copyContent();
      }}
    />
  );
};
