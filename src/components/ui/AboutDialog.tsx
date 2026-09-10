import { AppDialog, type DialogProps } from "../containers/AppDialog";

export const AboutDialog = ({ onClose, ...props }: DialogProps) => {
  return (
    <AppDialog onClose={onClose} {...props}>
      {/*  */}
    </AppDialog>
  );
};
