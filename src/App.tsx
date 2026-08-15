import { useState } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./router/routes";
import "./App.css";
import { MEDIA_QUERIES, useMediaQuery } from "./hooks";
import { StoreProvider } from "./providers/StoreProvider";
import { TopToolbar, LeftNav } from "./components/views";
import { SettingsDialog } from "./components/ui/SettingsDialog";
import { SearchDialog } from "./components/ui/SearchDialog";
import { AppContext } from "./contexts/AppContext";

const App = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isSetingsOpen, setIsSetingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <StoreProvider>
      <div className="flex">
        <LeftNav
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsCollapsed={setIsCollapsed}
          onSearchClicked={() => {
            setIsSearchOpen(true);
          }}
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

          <AppContext.Provider
            value={{
              isMobile,
              openSettings: () => {
                setIsSetingsOpen(true);
              },
            }}
          >
            <RouterProvider router={routes} />
          </AppContext.Provider>

          <SearchDialog
            open={isSearchOpen}
            onClose={() => {
              setIsSearchOpen(false);
            }}
          />

          <SettingsDialog
            open={isSetingsOpen}
            onClose={() => {
              setIsSetingsOpen(false);
            }}
          />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
