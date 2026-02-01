import { createBrowserRouter } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CreateCircle } from "./pages/CreateCircle";
import { Circles } from "./pages/Circles";
import { CircleDetail } from "./pages/CircleDetail";
import { CreditProfile } from "./pages/CreditProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/create",
    element: <CreateCircle />,
  },
  {
    path: "/circles",
    element: <Circles />,
  },
  {
    path: "/circle/:address",
    element: <CircleDetail />,
  },
  {
    path: "/credit",
    element: <CreditProfile />,
  },
]);
