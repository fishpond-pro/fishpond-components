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

import {
  getConfig,
  createModulesContext,
  getModulesContext,
  getDynamicRoutes,
  mergeDynamicRoutesToTree,
  getDynamicModelIndexes,
  createApiPlugin,
  ConnectProvider,
} from "@polymita/next-connect";

import RootLayout from "./layout";
import Back from "./back/page";
import Main from "./main/page";

function RootApplication({ location }) {
  const routes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/back",
          element: null,
          children: [
            {
              element: <Back />,
              index: true,
            },
          ],
        },
        {
          path: "/main",
          element: null,
          children: [
            {
              element: <Main />,
              index: true,
            },
          ],
        },
      ],
    },
  ];
  const dynamicRoutes = getDynamicRoutes();
  if (dynamicRoutes.length) {
    routes.push(...mergeDynamicRoutesToTree(dynamicRoutes));
  }
  console.log("[RootApplication] routes: ", routes);
  const router = createBrowserRouter(routes);

  return (
    <ConnectProvider
      pkgName="@polymita/message-list"
      modelIndexes={getDynamicModelIndexes()}
      plugin={createApiPlugin()}
    >
      <RouterProvider router={router} />
    </ConnectProvider>
  );
}

render(RootApplication);

function render(f) {
  let ele = React.createElement(f);
  const app = ReactDOM.createRoot(document.getElementById("app"));
  app.render(ele);
}
