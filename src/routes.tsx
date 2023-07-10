import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import IndexPage from "./pages/index";
// import OrderingPage from "./pages/ordering";
// import ConfirmPage from "./pages/confirm";
// import PaymentPage from "./pages/payment";
// import ResultPage from "./pages/result";

const OrderingPage = lazy(() => import("./pages/ordering"));
const ConfirmPage = lazy(() => import("./pages/confirm"));
const PaymentPage = lazy(() => import("./pages/payment"));
const ResultPage = lazy(() => import("./pages/result"));
const ScanOrderPage = lazy(() => import("./pages/getOrderByScan"));

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
  {
    path: "/scanOrder",
    element: <ScanOrderPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
