/**
 * @tips: this file is generated by @polymita. do not modified this file
 */
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";

import { getConfig, createModulesContext } from "@polymita/next-connect";

import Root from "./page";
import RootLayout from "./layout";
import Main from "./main/page";
import MainXxxx from "./main/xxxx/page";
import Test from "./test/page";

const modulesContext = createModulesContext(
  getConfig(),
  globalThis.POLYMITA_MODULES || {},
);

function RootApplication({ location }) {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          element: <Root />,
          index: true,
        },
        {
          path: "/main",
          element: null,
          children: [
            {
              element: <Main />,
              index: true,
            },
            {
              path: "/main/xxxx",
              element: null,
              children: [
                {
                  element: <MainXxxx />,
                  index: true,
                },
              ],
            },
          ],
        },
        {
          path: "/test",
          element: null,
          children: [
            {
              element: <Test />,
              index: true,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

render(RootApplication);

function render(f) {
  let ele = React.createElement(f);
  const app = ReactDOM.createRoot(document.getElementById("app"));
  app.render(ele);
}
