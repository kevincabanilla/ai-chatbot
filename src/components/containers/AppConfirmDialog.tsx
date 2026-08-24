import AppButton from "../buttons/AppButton";
import { AppDialog, type DialogProps } from "./AppDialog";

export interface AppConfirmDialogProps extends DialogProps {
  dialogTitle?: string | null;
  confirmButtonText?: string | null;
  declineButtonText?: string | null;
  onConfirm?: () => void;
  onDecline?: () => void;
}

export const AppConfirmDialog = ({
  dialogTitle,
  confirmButtonText,
  declineButtonText,
  onConfirm,
  onDecline,
  children,
  ...props
}: AppConfirmDialogProps) => {
  return (
    <AppDialog {...props}>
      <div className="flex flex-col gap-6 p-6">
        {dialogTitle && (
          <div className="text-xl">
            <h1>{dialogTitle}</h1>
          </div>
        )}

        {children}

        <div className="flex justify-between">
          <AppButton
            variant="ghost"
            className="text-rose-500/90 bg-rose-500/2 hover:text-rose-500 hover:bg-rose-500/5"
            onClick={onDecline}
          >
            {declineButtonText ?? "No"}
          </AppButton>
          <AppButton onClick={onConfirm}>
            {confirmButtonText ?? "Yes"}
          </AppButton>
        </div>
      </div>
    </AppDialog>
  );
};
