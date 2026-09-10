import { useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle,
  CodeXml,
  LoaderCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { AI_SKILL, type AISkill } from "@shared/ai/skills";
import { useGetAiModelsApi } from "@/api/modelApi";
import { useStore } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import AppButton from "../buttons/AppButton";
import { AppCombobox, type ComboboxOption } from "../inputs/AppCombobox";
import { cn } from "@/libs/utils";

const LUCIDE_ICON: Record<AISkill, LucideIcon> = {
  GENERAL: BrainCircuit,
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
  return (
    <AppDialog
      aria-labelledby="settings-dialog-title"
      onClose={onClose}
      {...props}
    >
      <SettingsContent key={props.open ? "open" : "closed"} onClose={onClose} />
    </AppDialog>
  );
};

const SettingsContent = ({ onClose }: { onClose: () => void }) => {
  const { state, setState } = useStore();
  const [selectedMode, setSelectedMode] = useState(state.settings.mode);
  const [aiModel, setAiModel] = useState(state.settings.model);
  const [streamResponse, setStreamResponse] = useState(
    state.settings.streamResponse ?? false,
  );

  const { data, error, isLoading, mutate } = useGetAiModelsApi();

  const models = useMemo<ComboboxOption[]>(
    () =>
      data?.models
        .map((model) => ({
          label: `${model.ownedBy} - ${model.id}${
            model.id === defaultAiModel ? " (DEFAULT)" : ""
          }`,
          value: model.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) ?? [],
    [data?.models],
  );

  const canSave = Boolean(selectedMode && aiModel);

  const saveSettings = () => {
    if (!canSave) return;

    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        mode: selectedMode,
        model: aiModel,
        streamResponse,
      },
    }));
    onClose();
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6">
      <div>
        <h1 id="settings-dialog-title" className="text-xl font-semibold">
          Settings
        </h1>
      </div>

      <div className="grow flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-accent">Mode</legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
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
        </fieldset>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-accent">Model</span>
          <div>
            {isLoading ? (
              <div className="h-10 flex items-center gap-2 rounded-lg border border-accent/30 bg-bg-secondary px-3 text-sm text-white/50">
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Loading available models...
              </div>
            ) : error ? (
              <div className="h-10 flex items-center justify-between gap-3 rounded-lg border border-rose-400/30 bg-rose-400/5 px-3 text-sm text-rose-200">
                <span className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  Failed to load models.
                </span>

                <AppButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="shrink-0 flex items-center text-rose-200 hover:text-white"
                  onClick={() => void mutate()}
                >
                  <RefreshCw className="mr-1 size-3.5" aria-hidden="true" />
                  Retry
                </AppButton>
              </div>
            ) : models.length > 0 ? (
              <AppCombobox
                value={aiModel}
                onValueChange={setAiModel}
                options={models}
                placeholder="Choose a model"
                emptyMessage="No matching models."
                searchPlaceholder="Search models..."
                aria-label="Model"
              />
            ) : (
              <div className="h-10 flex items-center rounded-lg border border-white/10 bg-bg-secondary px-3 text-sm text-white/50">
                No models are available.
              </div>
            )}
          </div>
        </div>

        <div
          className={clsx(
            "min-h-10 px-3 py-2 flex items-center rounded-lg border",
            "border-sky-300/20 bg-bg-secondary",
          )}
        >
          <label
            className={clsx(
              "h-full w-full flex items-center gap-3 text-sm cursor-pointer",
            )}
          >
            <input
              type="checkbox"
              className="size-4 shrink-0 accent-accent cursor-pointer"
              checked={streamResponse}
              onChange={(event) => {
                setStreamResponse(event.target.checked);
              }}
            />
            <span>
              <span className="block text-xs md:text-sm font-medium">
                Stream responses (Beta)
              </span>
              <span className="mt-0.5 block text-xs text-white/40">
                Show partial replies as they become available.
              </span>
            </span>
          </label>
        </div>

        <p className="text-xs leading-relaxed text-white/40">
          Mode and model changes apply to new conversations. Existing
          conversations will keep their current settings.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <AppButton
          type="button"
          variant="ghost"
          className="text-rose-500/90 bg-rose-500/2 hover:text-rose-500 hover:bg-rose-500/5"
          onClick={onClose}
        >
          Close
        </AppButton>
        <AppButton type="button" disabled={!canSave} onClick={saveSettings}>
          Save changes
        </AppButton>
      </div>
    </div>
  );
};

const ModeItem = ({
  text,
  icon: Icon,
  selected,
  onClick,
}: AiMode & { selected?: boolean; onClick: () => void }) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "relative flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border p-4 text-accent transition-colors select-none",
        "border-sky-300/20 bg-bg-secondary hover:border-sky-300/50 hover:bg-accent/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        selected && "border-accent/60 bg-accent/15",
      )}
      onClick={onClick}
    >
      {selected && (
        <CheckCircle
          size={24}
          className="absolute right-3 top-3 text-green-500"
          aria-hidden="true"
        />
      )}
      <Icon className="size-8 md:size-10" aria-hidden="true" />
      <span className="md:text-lg font-medium">{text}</span>
    </button>
  );
};
