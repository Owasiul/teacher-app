import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../Component/Home/Home";
import Messsages from "../Component/Messages/Messsages";
import Register from "../Component/Auth/Register";
import Login from "../Component/Auth/Login";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/messages",
        element: <Messsages />,
      },
    ],
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
]);
