import { useStateManager } from "@/hooks";
import {
  AppConfirmDialog,
  type AppConfirmDialogProps,
} from "../containers/AppConfirmDialog";

export interface DeleteConversationDialogProps extends AppConfirmDialogProps {
  conversationId: string;
}

export const DeleteConversationDialog = ({
  conversationId,
  ...props
}: DeleteConversationDialogProps) => {
  const { state, deleteConversation } = useStateManager();
  const conversation = !conversationId
    ? null
    : (state.conversationsById[conversationId] ?? null);

  return (
    <AppConfirmDialog
      dialogTitle="Delete this conversatiion?"
      {...props}
      onConfirm={() => {
        deleteConversation(conversationId);
        props.onClose();
      }}
      onDecline={() => {
        props.onClose();
      }}
    >
      <div>
        {conversation && <p>{conversation.title}</p>}

        <span className="text-xs text-white/20">This cannot be undone.</span>
      </div>
    </AppConfirmDialog>
  );
};
