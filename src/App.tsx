import "./App.css";
import { MainView } from "./components";
import { StoreProvider } from "./providers/StoreProvider";

const App = () => {
  return (
    <StoreProvider>
      <MainView />
    </StoreProvider>
  );
};

export default App;
