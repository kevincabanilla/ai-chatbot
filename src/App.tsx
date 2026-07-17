import { useState } from "react";
import "./App.css";
import { MEDIA_QUERIES, useMediaQuery } from "./hooks";
import { MainView } from "./components";
import { LeftNav } from "./components/views/LeftNav";
import { StoreProvider } from "./providers/StoreProvider";
import { TopToolbar } from "./components/views/TopToolbar";

const App = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.lg);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <StoreProvider>
      <div className="flex">
        <LeftNav
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div className="flex-1">
          <TopToolbar isMobile={isMobile} setIsMobileOpen={setIsMobileOpen} />
          <MainView />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
