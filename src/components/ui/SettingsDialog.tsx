import { useState } from "react";
import {
  BrainCircuit,
  CheckCircle,
  CodeXml,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { AI_SKILL, type AISkill } from "@shared/ai/skills";
import { useStore } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import AppButton from "../buttons/AppButton";
import { AppCard } from "../containers/AppCard";

const LUCIDE_ICON: Record<AISkill, LucideIcon> = {
  DEFAULT: BrainCircuit,
  CODING: CodeXml,
};

interface AiMode {
  text: string;
  icon: (typeof LUCIDE_ICON)[AISkill];
}

const AiModes: AiMode[] = Object.keys(AI_SKILL).map((key) => ({
  text: key,
  icon: LUCIDE_ICON[key as AISkill],
}));

export const SettingsDialog = ({ onClose, ...props }: DialogProps) => {
  const { state, setState } = useStore();
  const [selectedMode, setSelectedMode] = useState(state.settings.mode);

  const saveSettings = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        mode: selectedMode,
      },
    }));
    onClose();
  };

  const closeDialog = () => {
    setSelectedMode(state.settings.mode);
    onClose();
  };

  return (
    <AppDialog onClose={closeDialog} {...props}>
      <div className="flex flex-col gap-6 p-6">
        <div className="text-xl">
          <h1>Settings</h1>
        </div>

        <div className="grow flex flex-col gap-1">
          <span className="text-accent">Mode</span>
          <div className="flex gap-6">
            {AiModes.map(({ text, icon }) => (
              <ModeItem
                key={text}
                text={text}
                icon={icon}
                selected={selectedMode == text}
                onClick={() => {
                  setSelectedMode(text);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <AppButton variant="ghost" onClick={closeDialog}>
            Close
          </AppButton>
          <AppButton onClick={saveSettings}>Save</AppButton>
        </div>
      </div>
    </AppDialog>
  );
};

const ModeItem = ({
  text,
  icon: Icon,
  selected,
  onClick,
}: AiMode & { selected?: boolean; onClick: () => void }) => {
  return (
    <AppCard
      className={clsx(
        "relative h-46 p-6",
        "grow flex flex-col justify-center items-center gap-4",
        "text-accent cursor-pointer select-none",
      )}
      onClick={onClick}
    >
      {selected && (
        <CheckCircle className="absolute top-3 right-3 text-green-500" />
      )}
      <Icon size={48} />
      <span className="text-xl">{text}</span>
    </AppCard>
  );
};
