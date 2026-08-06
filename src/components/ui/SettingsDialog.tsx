import { useState } from "react";
import {
  BrainCircuit,
  CheckCircle,
  CodeXml,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { AI_SKILL, type AISkill } from "@shared/ai/skills";
import { useGetAiModelsApi } from "@/api/modelApi";
import { useStore } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import AppButton from "../buttons/AppButton";
import { AppCard } from "../containers/AppCard";
import { AppCombobox, type ComboboxOption } from "../inputs/AppCombobox";

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

const defaultAiModel = import.meta.env.VITE_DEFAULT_AI_MODEL;

export const SettingsDialog = ({ onClose, ...props }: DialogProps) => {
  const { state, setState } = useStore();
  const [selectedMode, setSelectedMode] = useState(state.settings.mode);
  const [aiModel, setAiModel] = useState(state.settings.model);

  const {
    data,
    error,
    isLoading,
    // mutate,
  } = useGetAiModelsApi();

  const models: ComboboxOption[] =
    data?.models
      .map((x) => ({
        label: `${x.ownedBy} - ${x.id} ${x.id === defaultAiModel ? "(DEFAULT)" : ""}`,
        value: x.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) ?? [];

  const saveSettings = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        mode: selectedMode,
        model: aiModel,
      },
    }));
    onClose();
  };

  const closeDialog = () => {
    setSelectedMode(state.settings.mode);
    setAiModel(state.settings.model);
    onClose();
  };

  return (
    <AppDialog onClose={closeDialog} {...props}>
      <div className="flex flex-col gap-6 p-6">
        <div className="text-xl">
          <h1>Settings</h1>
        </div>

        <div className="grow flex flex-col gap-3">
          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
            <span className="text-accent">Model</span>
            <div className="">
              {!error ? (
                <AppCombobox
                  disabled={isLoading}
                  value={aiModel}
                  onValueChange={setAiModel}
                  options={models}
                  placeholder="Choose a framework"
                />
              ) : (
                <div>
                  <span>Failed to load models.</span>
                </div>
              )}
            </div>
            <span className="text-white/30 text-xs">
              This will only apply to new converstations.
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <AppButton
            variant="ghost"
            className="text-rose-500/90 bg-rose-500/2 hover:text-rose-500 hover:bg-rose-500/5"
            onClick={closeDialog}
          >
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
