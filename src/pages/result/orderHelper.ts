import {
  IReviewInfo,
  OrderingSummary,
  OrderStatus,
  PaymentOptionEnum,
  PaymentResultEnum,
  PaymentResultParams,
  PaymentStatus,
} from "../../typing";
import { RootState } from "../../store";
import { BASE_URL } from "../../consts";

export function createOrderPostBody(
  paymentStatus: PaymentResultEnum,
  total: number,
  state: RootState,
) {
  const { restaurantId, table, restInfo } = state.restaurant;
  const { tip, summary, contact, rounded, fee, paymentMethodKey } =
    state.ordering;
  const { paymentOrderID: orderId } = state.paygreen;
  const date = new Date();
  const id = date.getTime() + Math.round(Math.random() * 10000).toString();
  const orderStatus =
    paymentMethodKey === PaymentOptionEnum.IN_CASH
      ? OrderStatus.UNPAID
      : OrderStatus.PAID;
  return {
    id,
    restaurantName: (restInfo as any)?.displayName,
    orderId,
    restaurantId,
    table,
    paymentStatus,
    orderStatus,
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

export function addReview(restaurantId: string, id: string, reviewInfo: IReviewInfo) {
  const body = JSON.stringify({ restaurantId, id, reviewInfo });
  return fetch(`${BASE_URL}/add-review`, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .catch(console.error);
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
