import AppButton from "../buttons/AppButton";
import { AppDialog, type DialogProps } from "./AppDialog";

export interface AppConfirmDialogProps extends DialogProps {
  dialogTitle?: string | null;
  confirmButtonText?: string | null;
  declineButtonText?: string | null;
  autoClose?: boolean;
  onConfirm?: () => void;
  onDecline?: () => void;
}

export const AppConfirmDialog = ({
  dialogTitle,
  confirmButtonText,
  declineButtonText,
  autoClose = false,
  onConfirm,
  onDecline,
  onClose,
  children,
  ...props
}: AppConfirmDialogProps) => {
  return (
    <AppDialog className="max-w-lg" onClose={onClose} {...props}>
      <div className="flex flex-col gap-6 p-6">
        {dialogTitle && (
          <div className="text-lg sm:text-xl">
            <h1>{dialogTitle}</h1>
          </div>
        )}

        {children}

        <div className="flex justify-between">
          <AppButton
            variant="ghost"
            className="text-rose-500/90 bg-rose-500/2 hover:text-rose-500 hover:bg-rose-500/5"
            onClick={() => {
              onDecline?.();
              if (autoClose) onClose();
            }}
          >
            {declineButtonText ?? "No"}
          </AppButton>
          <AppButton
            onClick={() => {
              onConfirm?.();
              if (autoClose) onClose();
            }}
          >
            {confirmButtonText ?? "Yes"}
          </AppButton>
        </div>
      </div>
    </AppDialog>
  );
};
