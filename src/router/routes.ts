import { createElement, lazy } from "react";
import { Navigate, createBrowserRouter, redirect } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/hooks";

const MainView = lazy(() => import("@/components/views/MainView"));
const SetupView = lazy(() => import("@/components/views/SetupView"));
const ErrorBoundary = lazy(() => import("@/components/views/ErrorBoundary"));

const MainRoute = () => {
  const { state } = useStore();

  return state.settings.initialized
    ? createElement(MainView)
    : createElement(Navigate, { to: "/setup", replace: true });
};

const SetupRoute = () => {
  const { state } = useStore();

  return state.settings.initialized
    ? createElement(Navigate, { to: "/", replace: true })
    : createElement(SetupView);
};

export const routes = createBrowserRouter([
  {
    path: "/setup",
    Component: SetupRoute,
    ErrorBoundary,
  },
  {
    element: createElement(AppLayout),
    children: [
      {
        path: "/",
        Component: MainRoute,
      },
      {
        path: "*",
        loader: () => redirect("/"),
      },
    ],
    ErrorBoundary,
  },
]);
