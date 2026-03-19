import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../Component/Home/Home";
import Messsages from "../Component/Messages/Messsages";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ index: true, element: <Home /> },{
      path: "/messages",
      element: <Messsages/>
    }],
  },
]);
