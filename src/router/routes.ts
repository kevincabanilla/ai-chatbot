import { createElement, lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";
import AppLayout from "@/components/layout/AppLayout";

const MainView = lazy(() => import("@/components/views/MainView"));

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
  },
]);
