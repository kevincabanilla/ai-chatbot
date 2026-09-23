import { useMemo, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CodeXml,
  LoaderCircle,
  Search,
  Settings,
  SkipForward,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AI_SKILL, type AISkill } from "@shared/ai/skills";
import type { AiModel } from "@shared/types";
import { useGetAiModelsApi } from "@/api/modelApi";
import { useStore } from "@/hooks";
import { cn } from "@/libs/utils";
import GitHubIcon from "@/assets/icons/GitHub.svg";
import AppButton from "../buttons/AppButton";
import { GITHUB_URL } from "../ui/AboutDialog";

const MODE_DETAILS: Record<
  AISkill,
  { label: string; description: string; icon: LucideIcon; color: string }
> = {
  GENERAL: {
    label: "General",
    description: "A thoughtful all-rounder for everyday questions and ideas.",
    icon: BrainCircuit,
    color: "text-sky-300",
  },
  CODING: {
    label: "Coding",
    description: "Focused help for building, debugging, and shipping software.",
    icon: CodeXml,
    color: "text-amber-300",
  },
};

const modes = Object.keys(AI_SKILL) as AISkill[];

const finishSetup = (
  setState: ReturnType<typeof useStore>["setState"],
  mode: string | null,
  model: string | null,
) => {
  setState((previous) => ({
    ...previous,
    settings: {
      ...previous.settings,
      initialized: true,
      mode,
      model,
    },
  }));
};

export default function SetupView() {
  const { state, setState } = useStore();
  const [selectedMode, setSelectedMode] = useState(state.settings.mode);
  const [selectedModel, setSelectedModel] = useState(state.settings.model);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAiModelsApi();

  const models = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...(data?.models ?? [])]
      .filter((model) => {
        if (!normalizedSearch) return true;
        return `${model.id} ${model.ownedBy}`
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((first, second) => first.id.localeCompare(second.id));
  }, [data?.models, search]);

  const chooseModel = (model: AiModel) => {
    setSelectedModel(model.id);
  };

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    model: AiModel,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseModel(model);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101923] text-foreground">
      {/* radial gradient glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(63,164,240,0.16),transparent_32%),radial-gradient(circle_at_90%_85%,rgba(245,166,35,0.1),transparent_28%)]" />

      {/* grid-pattern background */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <motion.header
          className="mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-sky-300/30 bg-sky-300/10 text-sky-200">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <h1 className="md:text-xl font-semibold tracking-wide text-white">
              {import.meta.env.VITE_APP_TITLE || "AI Chatbot"}
            </h1>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-full bg-transparent p-2",
            )}
          >
            <img
              src={GitHubIcon}
              alt="Github"
              aria-hidden="true"
              className="size-6"
            />
          </a>
        </motion.header>

        <div className="grid flex-1 items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <motion.section
            className="pt-2 lg:sticky lg:top-12"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <p className="mb-4 text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-sky-300/80">
              Make it yours
            </p>
            <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold leading-tight tracking-normal md:tracking-tight text-white">
              A better conversation starts with the right settings.
            </h2>
            <p className="mt-3 md:mt-6 text-sm md:text-base leading-7 text-white/55">
              Choose how you like to work. You can always change these anytime
              in the Settings.
            </p>
          </motion.section>

          <motion.section
            className="rounded-2xl border border-white/10 bg-[#18232e]/90 p-5 sm:p-7 shadow-2xl shadow-black/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm md:text-xl font-semibold text-white">
                  Set your preferred mode and model
                </h3>
                <p className="mt-1 text-xs md:text-sm text-white/45">
                  These will guide every new conversation.
                </p>
              </div>
              <Settings className="size-5 text-white/25" aria-hidden="true" />
            </div>

            <fieldset>
              <legend className="mb-3 text-xs md:text-sm font-medium text-white/75">
                How will you use it?
              </legend>
              <div
                className="grid gap-3 sm:grid-cols-2"
                role="radiogroup"
                aria-label="Mode"
              >
                {modes.map((mode) => {
                  const details = MODE_DETAILS[mode];
                  const Icon = details.icon;
                  const selected = selectedMode === mode;

                  return (
                    <button
                      key={mode}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={cn(
                        "relative rounded-xl border p-4 text-left transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
                        selected
                          ? "border-sky-300/65 bg-sky-300/12"
                          : "border-white/10 bg-white/2.5 hover:border-white/25 hover:bg-white/5",
                      )}
                      onClick={() => {
                        setSelectedMode(mode);
                      }}
                    >
                      <div className="mb-5 flex gap-3 flex-row md:flex-col items-center md:items-start">
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg bg-white/5",
                            details.color,
                          )}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="block text-sm md:text-base font-semibold text-white">
                          {details.label}
                        </span>
                      </div>

                      <span className="block text-xs leading-5 text-white/45">
                        {details.description}
                      </span>

                      {selected && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-sky-300 text-[#101923]">
                          <Check
                            className="size-3.5"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-white/75">
                    Choose a model
                  </h3>
                  <p className="mt-1 text-xs text-white/40">
                    Select a row, or keep the current default.
                  </p>
                </div>
                <span className="text-xs tabular-nums text-white/35 text-nowrap">
                  {models.length} available
                </span>
              </div>

              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  placeholder="Search by model or owner"
                  aria-label="Search models"
                  className={cn(
                    "h-10 w-full rounded-lg border border-white/10 bg-[#101923]/75",
                    "pl-10 pr-3 text-xs md:text-sm text-white outline-none placeholder:text-white/30",
                    "focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/15",
                  )}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
              </label>

              <div className="app-scrollbar mt-3 max-h-64 overflow-auto rounded-lg border border-white/10">
                <table className="w-full min-w-0 table-fixed border-collapse text-left text-xs md:text-sm">
                  <thead className="sticky top-0 z-10 bg-[#202e3b] text-xs uppercase tracking-wider text-white/40">
                    <tr>
                      <th scope="col" className="w-9 md:w-12 px-2" />
                      <th scope="col" className="px-2 py-3 font-medium">
                        Model name
                      </th>
                      <th
                        scope="col"
                        className="hidden sm:table-cell px-2 md:px-4 py-3 font-medium"
                      >
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-white/45"
                        >
                          <span className="inline-flex items-center gap-2">
                            <LoaderCircle
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />
                            Loading models...
                          </span>
                        </td>
                      </tr>
                    ) : models.length > 0 ? (
                      models.map((model) => {
                        const selected = selectedModel === model.id;
                        return (
                          <tr
                            key={model.id}
                            tabIndex={0}
                            role="button"
                            aria-pressed={selected}
                            className={cn(
                              "cursor-pointer outline-none transition-colors focus-visible:bg-sky-300/10",
                              selected ? "bg-sky-300/10" : "hover:bg-white/4",
                            )}
                            onClick={() => {
                              chooseModel(model);
                            }}
                            onKeyDown={(event) => {
                              handleRowKeyDown(event, model);
                            }}
                          >
                            <td className="px-2.5 md:px-4 py-3">
                              <span
                                className={cn(
                                  "flex size-4 items-center justify-center rounded-full border",
                                  selected
                                    ? "border-sky-300 bg-sky-300 text-[#101923]"
                                    : "border-white/25",
                                )}
                              >
                                {selected && (
                                  <Check
                                    className="size-3"
                                    strokeWidth={3}
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </td>
                            <td className="max-w-0 truncate px-2 py-3 font-medium text-white/85">
                              {model.id}
                            </td>
                            <td className="hidden sm:table-cell max-w-0 truncate px-2 md:px-4 py-3 text-white/45">
                              {model.ownedBy}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-white/40"
                        >
                          {!search
                            ? "No models available."
                            : "No matching models found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <AppButton
                type="button"
                variant="ghost"
                className="inline-flex items-center justify-center gap-2 text-white/45 hover:text-white"
                onClick={() => {
                  finishSetup(
                    setState,
                    state.settings.mode,
                    state.settings.model,
                  );
                }}
              >
                <SkipForward className="size-4" aria-hidden="true" />
                Skip for now
              </AppButton>
              <AppButton
                type="button"
                className={cn(
                  "inline-flex items-center justify-center gap-2 md:px-8 md:py-3 md:text-base",
                  "border border-sky-200/30 bg-sky-300 text-[#101923]",
                  "hover:bg-sky-200 hover:text-[#101923]",
                )}
                disabled={!selectedMode || !selectedModel}
                onClick={() => {
                  finishSetup(setState, selectedMode, selectedModel);
                }}
              >
                Continue
                <ArrowRight className="size-4" aria-hidden="true" />
              </AppButton>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
