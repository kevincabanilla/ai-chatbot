import { useState } from "react";
import "./App.css";
import { MEDIA_QUERIES, useMediaQuery } from "./hooks";
import { StoreProvider } from "./providers/StoreProvider";
import { MainView } from "./components";
import { LeftNav } from "./components/views/LeftNav";
import { TopToolbar } from "./components/views/TopToolbar";

const App = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <StoreProvider>
      <div className="flex">
        <LeftNav
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          setIsCollapsed={setIsCollapsed}
        />

        <div className="flex-1">
          <TopToolbar
            isVisible={isMobile}
            onOpenDrawer={(shouldOpen) => {
              setIsCollapsed(!shouldOpen);
            }}
          />
          <MainView />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
