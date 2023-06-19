// import * as React from "react";
import { Route, Routes } from "react-router-dom";

import ConfirmEmail from "./components/ConfirmEmail";
import ApplicationUpload from "./components/ApplicationUpload";
import ResetPassword from "./components/ResetPassword";

interface RouteSchema {
  path: string;
  component: JSX.Element;
  isAuthRequired?: boolean;
}
export default function Router() {
  const routes: RouteSchema[] = [
    {
      path: "/",
      component: <ConfirmEmail />,
    },
    {
      path: "/upload-application",
      component: <ApplicationUpload />,
    },
    {
      path: "/reset-password",
      component: <ResetPassword />,
    },
  ];

  return (
    <Routes>
      {routes.map((route: RouteSchema) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <div role="main" className="main-content">
              {route.component}
            </div>
          }
        />
      ))}
    </Routes>
  );
}
