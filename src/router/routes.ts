import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";

const MainView = lazy(() => import("@/components/views/MainView"));

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: MainView,
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);
