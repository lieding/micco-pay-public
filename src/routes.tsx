import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages/index";
import OrderingPage from "./pages/ordering";

export const routes = [
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/order",
    element: <OrderingPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
