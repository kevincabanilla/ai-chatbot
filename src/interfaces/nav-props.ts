export interface NavProps {
  isMobile: boolean;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onSearchClicked: () => void;
  onSettingsClicked: () => void;
  onDeleteConversation: (cid: string) => void;
}
