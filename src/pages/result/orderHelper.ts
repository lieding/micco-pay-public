import type { OrderingSummary, PaymentResultParams } from "../../typing";
import { RootState } from "../../store";
import { BASE_URL } from "../../consts";

export function createOrderPostBody(
  total: number,
  state: RootState,
  searchParams: URLSearchParams
) {
  const { restaurantId, table } = state.restaurant;
  const { tip, summary, contact, rounded } = state.ordering;
  const paymentIntent = searchParams.get("payment_intent"),
    paymentClientSecret = searchParams.get("payment_intent_client_secret"),
    paymentStatus = searchParams.get("redirect_status");

  return {
    id: paymentClientSecret,
    paymentIntent,
    restaurantId,
    table,
    paymentStatus,
    contact,
    amount: total,
    tip: tip.selected ? tip.amount : 0,
    rounded,
    orders: extractMenuOrders(summary),
    createdAt: new Date().toISOString(),
  };
}

function extractMenuOrders(summary: OrderingSummary) {
  return Object.values(summary).map(({ count, course }) => ({
    count,
    courseKey: course.key,
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
