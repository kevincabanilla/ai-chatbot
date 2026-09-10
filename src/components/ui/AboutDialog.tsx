import { Sparkles } from "lucide-react";
import GitHubIcon from "@/assets/icons/GitHub.svg";
import { cn } from "@/libs/utils";
import AppButton from "../buttons/AppButton";
import { AppDialog, type DialogProps } from "../containers/AppDialog";

export const AboutDialog = ({ onClose, ...props }: DialogProps) => {
  const appTitle = import.meta.env.VITE_APP_TITLE;
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const githubUrl = "https://github.com/kevincabanilla/ai-chatbot";

  return (
    <AppDialog onClose={onClose} {...props}>
      <div className="overflow-hidden rounded-2xl">
        <div className="relative border-b border-white/10 bg-linear-to-br from-accent/15 via-bg-secondary/60 to-transparent px-6 pb-7 pt-8 sm:px-8">
          <div className="absolute -right-12 -top-16 size-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-5 rounded-2xl border border-accent/30 bg-bg-primary/80 p-2 shadow-[0_0_32px_rgba(63,164,240,0.18)]">
              <img
                src="/favicon.svg"
                alt="App Icon"
                className="size-16 rounded-xl"
              />
            </div>

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles aria-hidden="true" className="size-3.5" />
              <span>AI assistant</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {appTitle}
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-foreground/60">
              Thoughtful answers, coding help, research, and everyday tasks in
              one focused conversation.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/8 pb-4 text-sm">
            <span className="text-foreground/50">Release version</span>
            <span className="font-mono text-xs text-foreground/80">
              v{appVersion}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "rounded-lg bg-accent/2 px-4 py-2 font-semibold text-accent/90 backdrop-blur-md",
                "transition-[background,border-color,box-shadow,color,transform] duration-300 ease-out",
                "hover:-translate-y-px hover:bg-accent/5 hover:text-accent",
              )}
            >
              <img
                src={GitHubIcon}
                alt="Github"
                aria-hidden="true"
                className="size-6"
              />
              Contribute
            </a>

            <AppButton variant="outline" onClick={onClose}>
              Close
            </AppButton>
          </div>
        </div>
      </div>
    </AppDialog>
  );
};
