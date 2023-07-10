import { isValidObject, isValidArray } from "./utils";

export interface IRestaurant {
  name: string;
  displayName: string;
  address: string;
  introImgUrl: string;
  logoUrl: string;
  categories: string[];
}

export interface ICourse {
  key: string; // must be uniaue
  category: string;
  fastCheckout?: boolean; // default set false
  label: string;
  pics?: string[];
  price: number;
  restaurantId: string;
  isPack?: boolean;
}

export type OrderingSummary = Record<
  string,
  { course: ICourse; count: number }
>;

export type QueryRestInfoResponse = {
  restInfo?: IRestaurant;
  menuInfo?: ICourse[];
  fastCheckouts?: ICourse[];
};

export type MenuMap = Record<string, ICourse[]>;

export function isValidQueryRestInfoRes(
  obj: any
): obj is QueryRestInfoResponse {
  if (isValidObject(obj)) {
    const { menuInfo, restInfo } = obj as any;
    return isValidObject(restInfo) && isValidArray(menuInfo);
  }
  return false;
}

export type CoursePayloafType = {
  payload: ICourse;
};

export type QueryMenuInfoResponse = {
  menuInfo?: ICourse[];
};

export function isValidQueryMenuInfoRes(
  obj: any
): obj is QueryMenuInfoResponse {
  if (isValidObject(obj)) {
    const { menuInfo } = obj as any;
    return isValidArray(menuInfo);
  }
  return false;
}

export type SetMenuInfoPayloadType = {
  payload: { categoryId: string; menuInfo: ICourse[] };
};

export type Contact = {
  phone: string;
  name: string;
  mail: string;
};

export type TipType = {
  customized: boolean;
  amount: number;
  selected: boolean;
};

// All available payment status
// https://stripe.com/docs/payments/paymentintents/lifecycle
export enum PaymentResultEnum {
  SUCCEEDED = "succeeded",
  REQ_PAYMENT_METHOD = "requires_payment_method",
  REQ_CONFIRMATION = "requires_confirmation",
  REQ_ACTION = "requires_action",
  PROCESSING = "processing",
}

export enum PaymentStatus {
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  PROCESSING = "PROCESSING",
  IN_OPERATION = "IN_OPERATION",
  UNKNOWN = "UNKNOWN",
}

export interface PaymentResultParams {
  payment_intent?: string;
  payment_intent_client_secret?: string;
  redirect_status?: PaymentResultEnum;
}

export interface ScanOrderResponse {
  orders: Array<{
    count: number;
    name: string;
    courseKey: string;
    price: number;
  }>;
  paymentStatus: PaymentResultEnum;
  contact: {
    name: string;
    mail: string;
    phone: string;
  };
  tip: number;
  table: string;
  createdAt: string;
  amount: number;
  paymentIntent: string;
  rounded: boolean;
  id: string;
  restaurantId: string;
}
