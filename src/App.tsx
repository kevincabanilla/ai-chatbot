import { useState } from "react";
import "./App.css";
import { MEDIA_QUERIES, useMediaQuery } from "./hooks";
import { StoreProvider } from "./providers/StoreProvider";
import { MainView, TopToolbar, LeftNav } from "./components/views";
import { AppDialog } from "./components/containers/AppDialog";

const App = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isSetingsOpen, setIsSetingsOpen] = useState(false);

  return (
    <StoreProvider>
      <div className="flex">
        <LeftNav
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsCollapsed={setIsCollapsed}
          onSettingsClicked={() => {
            setIsSetingsOpen(true);
          }}
        />

        <div className="flex-1">
          <TopToolbar
            isVisible={isMobile}
            onOpenDrawer={(shouldOpen) => {
              setIsCollapsed(!shouldOpen);
            }}
          />
          <MainView isMobile={isMobile} />

          <AppDialog
            open={isSetingsOpen}
            onClose={() => {
              setIsSetingsOpen(false);
            }}
          >
            Test
          </AppDialog>
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
