import { RouterProvider } from "react-router";
import { StoreProvider } from "./providers/StoreProvider";
import { routes } from "./router/routes";
import "./App.css";

const App = () => {
  return (
    <StoreProvider>
      <RouterProvider router={routes} />
    </StoreProvider>
  );
};

export default App;
