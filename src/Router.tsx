// import * as React from "react";
import { Route, Routes } from "react-router-dom";

import ConfirmEmail from "./components/ConfirmEmail";
import ApplicationUpload from "./components/ApplicationUpload";
import ResetPassword from "./components/ResetPassword";
import ApplicationDelete from "./components/ApplicationDelete";
import MoodTracker from "./components/MoodTracker";

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
      path: "/delete-application",
      component: <ApplicationDelete />,
    },
    {
      path: "/reset-password",
      component: <ResetPassword />,
    },
    {
      path: "/mood-tracker",
      component: <MoodTracker />,
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
