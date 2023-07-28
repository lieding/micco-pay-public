import {
  OrderingSummary,
  PaymentResultEnum,
  PaymentResultParams,
  PaymentStatus,
} from "../../typing";
import { RootState } from "../../store";
import { BASE_URL } from "../../consts";

export function createOrderPostBody(
  total: number,
  state: RootState,
  searchParams: URLSearchParams
) {
  const { restaurantId, table } = state.restaurant;
  const { tip, summary, contact, rounded, fee } = state.ordering;
  const paymentIntent = searchParams.get("payment_intent"),
    // paymentClientSecret = searchParams.get("payment_intent_client_secret"),
    paymentStatus = searchParams.get("redirect_status");
  const date = new Date();
  const id = date.getTime() + Math.round(Math.random() * 10000).toString();
  return {
    id,
    paymentIntent,
    restaurantId,
    table,
    paymentStatus,
    orderStatus: "PAID",
    contact,
    fee,
    amount: total,
    tip: tip.selected ? tip.amount : 0,
    rounded,
    orders: extractMenuOrders(summary),
    createdAt: date.toISOString(),
  };
}

function extractMenuOrders(summary: OrderingSummary) {
  return Object.values(summary).map(({ count, course }) => ({
    count,
    courseKey: course.key,
    name: course.label,
    price: course.price,
  }));
}

export function createOrder(data: any) {
  const body = JSON.stringify(data);
  return fetch(`${BASE_URL}/createOrder`, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

export function parsePaymentStatus(result: PaymentResultEnum) {
  switch (result) {
    case PaymentResultEnum.SUCCEEDED:
      return PaymentStatus.SUCCEEDED;
    case PaymentResultEnum.REQ_PAYMENT_METHOD:
      return PaymentStatus.FAILED;
    case PaymentResultEnum.PROCESSING:
      return PaymentStatus.PROCESSING;
    case PaymentResultEnum.REQ_ACTION:
    case PaymentResultEnum.REQ_CONFIRMATION:
      return PaymentStatus.IN_OPERATION;
    default:
      return PaymentStatus.UNKNOWN;
  }
}
