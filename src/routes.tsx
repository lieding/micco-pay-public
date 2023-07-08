import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages/index";
import OrderingPage from "./pages/ordering";
import ConfirmPage from "./pages/confirm";
import PaymentPage from "./pages/payment";
import ResultPage from "./pages/result";

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
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/result",
    element: <ResultPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
