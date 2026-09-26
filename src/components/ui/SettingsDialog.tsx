import { useMemo, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  RefreshCcw,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import clsx from "clsx";
import { useGetAiModelsApi } from "@/api/modelApi";
import { DEFAULT_SETTINGS } from "@/contexts/StoreContext";
import { useStateManager } from "@/hooks";
import { AppDialog, type DialogProps } from "../containers/AppDialog";
import { AppConfirmDialog } from "../containers/AppConfirmDialog";
import AppButton from "../buttons/AppButton";
import { AppCombobox, type ComboboxOption } from "../inputs/AppCombobox";
import { ModeSelectionItem } from "./settings/ModeSelectionItem";
import { AI_MODE_DETAILS, AI_MODES } from "@/constants";

const defaultAiModel = import.meta.env.VITE_DEFAULT_AI_MODEL;

export const SettingsDialog = ({ onClose, ...props }: DialogProps) => {
  return (
    <AppDialog
      mobileFullScreen
      aria-labelledby="settings-dialog-title"
      onClose={onClose}
      className="max-w-xl"
      {...props}
    >
      <SettingsContent key={props.open ? "open" : "closed"} onClose={onClose} />
    </AppDialog>
  );
};

const SettingsContent = ({ onClose }: { onClose: () => void }) => {
  const { state, setState, clearConversations } = useStateManager();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
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
        .sort((first, second) => {
          const firstIsOpenAI = first.label.toLowerCase().includes("openai");
          const secondIsOpenAI = second.label.toLowerCase().includes("openai");

          if (firstIsOpenAI !== secondIsOpenAI) {
            return Number(secondIsOpenAI) - Number(firstIsOpenAI);
          }

          return first.label.localeCompare(second.label);
        }) ?? [],
    [data?.models],
  );

  const canSave = Boolean(selectedMode && aiModel);

  const resetSettings = () => {
    setSelectedMode(DEFAULT_SETTINGS.mode);
    setAiModel(DEFAULT_SETTINGS.model);
    setStreamResponse(DEFAULT_SETTINGS.streamResponse ?? false);
  };

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
    <div className="flex flex-col gap-6 p-5 sm:p-6 max-h-dvh sm:max-h-[calc(100dvh-2rem)] overflow-auto">
      <div>
        <h1 id="settings-dialog-title" className="text-xl font-semibold">
          Settings
        </h1>
      </div>

      <div className="grow flex flex-col gap-5">
        <fieldset>
          <legend className="text-sm md:text-base font-medium mb-2">
            Mode
          </legend>
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup">
            {AI_MODES.map((mode) => (
              <ModeSelectionItem
                {...AI_MODE_DETAILS[mode]}
                key={mode}
                selected={selectedMode === mode}
                onClick={() => {
                  setSelectedMode(mode);
                }}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-medium">Model</span>
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

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
          <div>
            <h2 className="text-sm font-medium">Data</h2>
            <p className="mt-1 text-xs leading-relaxed text-white/40">
              Manage your saved settings and conversations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <AppButton
              type="button"
              variant="ghost"
              className="flex items-center gap-2"
              onClick={resetSettings}
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
              Reset settings
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300"
              disabled={state.conversationOrder.length === 0}
              onClick={() => {
                setIsClearDialogOpen(true);
              }}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Clear conversations
            </AppButton>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <div className="flex-1">
          {import.meta.env.DEV && (
            <AppButton
              type="button"
              variant="ghost"
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    initialized: false,
                  },
                }));
              }}
            >
              Setup (DEV)
            </AppButton>
          )}
        </div>
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

      <AppConfirmDialog
        autoClose
        open={isClearDialogOpen}
        dialogTitle="Clear all conversations?"
        confirmButtonText="Clear conversations"
        declineButtonText="Cancel"
        onConfirm={clearConversations}
        onClose={() => {
          setIsClearDialogOpen(false);
        }}
      >
        <div className="flex gap-3 text-sm text-white/70">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-rose-400"
            aria-hidden="true"
          />
          <p>
            This will permanently delete all saved conversations. This cannot be
            undone.
          </p>
        </div>
      </AppConfirmDialog>
    </div>
  );
};
