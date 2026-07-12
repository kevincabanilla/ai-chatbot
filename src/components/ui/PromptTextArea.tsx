import { useState, type ChangeEvent } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { Helper } from "@/utils";
import { AppCard } from "../containers/AppCard";
import { AppTextArea } from "../inputs/AppTextArea";
import { AppIconButton } from "../buttons/AppIconButton";
import clsx from "clsx";

export const PromptTextArea = () => {
  const [prompt, setPrompt] = useState("");
  const [isMultiRow, setIsMultiRow] = useState(false);

  const onInputChange = (
    e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => {
    const textarea = e.target;
    const inputValue = textarea.value;
    setPrompt(inputValue);

    if (!isMultiRow) {
      const isMultiRows = Helper.getTextareaRows(textarea) > 2;
      setIsMultiRow(isMultiRows);
    } else {
      setIsMultiRow(inputValue.length > 0);
    }
  };

  return (
    <AppCard
      className={clsx(
        "p-2 md:w-2xl flex flex-wrap gap-2",
        isMultiRow ? "items-start" : "items-center",
      )}
    >
      <AppIconButton rounded icon={Plus} label="Add Files" variant="ghost" />

      <AppTextArea
        className={clsx(
          isMultiRow ? "order-first basis-full p-6" : "flex-1 py-2",
        )}
        value={prompt}
        onChange={onInputChange}
      />

      {isMultiRow && <div className="flex-1" />}

      <AppIconButton rounded icon={Mic} label="Dictate" variant="ghost" />

      {prompt.length > 0 && (
        <AppIconButton rounded icon={ArrowUp} label="Submit" />
      )}
    </AppCard>
  );
};
