import "./App.css";
import { MainView } from "./components";
import { LeftNav } from "./components/views/LeftNav";
import { StoreProvider } from "./providers/StoreProvider";

const App = () => {
  return (
    <StoreProvider>
      <div className="flex">
        <LeftNav />

        <div className="flex-1">
          <MainView />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
