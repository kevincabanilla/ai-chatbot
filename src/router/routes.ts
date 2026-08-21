import { createElement, lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";
import AppLayout from "@/components/layout/AppLayout";

const MainView = lazy(() => import("@/components/views/MainView"));
const ErrorBoundary = lazy(() => import("@/components/views/ErrorBoundary"));

export const routes = createBrowserRouter([
  {
    element: createElement(AppLayout),
    children: [
      {
        path: "/",
        Component: MainView,
      },
      {
        path: "*",
        loader: () => redirect("/"),
      },
    ],
    ErrorBoundary,
  },
]);
