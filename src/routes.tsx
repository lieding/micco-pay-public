import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages/index";
import OrderingPage from "./pages/ordering";
import ConfirmPage from "./pages/confirm";

export const routes = [
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/order",
    element: <OrderingPage />,
  },
  {
    path: "/confirm",
    element: <ConfirmPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
