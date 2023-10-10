import { isValidObject, isValidArray } from "./utils";

export enum DisplayMode {
  DEFAULT_RESTAUTANT = 'R',
  DEFAULT_MARKET = 'M'
}

export enum DayPeriod {
  MORNING,
  NOON,
  AFTERNOON,
  NIGHT = "night",
}

export interface IPgPaymentConfig {
  platform: PgPaymentMethod
  currency: 'eur'
  reused: boolean
}

export interface IRestaurant {
  name: string;
  displayName: string;
  address: string;
  introImgUrl: string;
  logoUrl: string;
  categories: string[];
  paymentMethods?: IPgPaymentConfig[]
  cateKey4OrderingFastBar?: string
}

export interface ICourse {
  key: string; // must be unique
  category: string;
  fastCheckout?: boolean; // default set false
  label: string;
  pics?: string[];
  price: number;
  restaurantId: string;
  isPack?: boolean;
  priceChange?: {
    [key: string]: number;
  };
  subtitle?: string;
  volume?: string;
}

export type OrderingSummary = Record<
  string,
  { course: ICourse; count: number }
>;

export interface IClient {
  id: string
  imgUrl: string
  name: string
  title: string
  location?: LocationResOption
}

export type QueryRestInfoResponse = {
  restInfo?: IRestaurant;
  menuInfo?: ICourse[];
  fastCheckouts?: ICourse[];
  holiday?: string | false;
  clientInfo?: IClient
  feeConfig?: { percentage: number; addition: number };
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
  firstName: string
  lastName: string
  mail: string;
};

export type TipType = {
  customized: boolean;
  amount: number;
  selected: boolean;
};

// All available payment status
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
  IN_CASH = "IN_CASH",
}

export interface PaymentResultParams {
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

export enum PaymentOptionEnum {
  DIGITAL_WALLET = "DIGITAL_WALLET",
  BLUE_CARD = "BLUE_CARD",
  RESTAURANT_TICKET = "RESTAURANT_TICKET",
  IN_CASH = "IN_CASH",
}

export enum OrderStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export enum PgPaymentMethod {
  BANK_CARD = 'bank_card',
  APPLE_PAY = 'apple_pay',
  SWILE = 'swile',
  AMEX = 'amex',
  ANCV = 'ancv',
  CONECS = 'conecs',
  RESTOFLASH = 'restoflash'
}

export function filterRestaurantTicketPaymentMethods (method: PgPaymentMethod) {
  return [
    PgPaymentMethod.CONECS,
    PgPaymentMethod.RESTOFLASH,
    PgPaymentMethod.SWILE
  ].includes(method);
}

export enum RequestStatusEnum {
  INIT,
  LOADING,
  RESOLVED,
  REJECTED
}

export enum PgPaymentFlowStatusEnum {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED= 'failed'
}

export enum PgPaymentFlowStatus {
  INIT,
  EN_SELECTION,
  FORM_FILLING,
  SUBMITING,
  SUBMIT_SUCCESS,
  SUBMIT_FAILED
}

export interface IReviewInfo {
  general: number
  plat: number
  service: number
  atmosphere: number
  ratio: number
}

/// city: "Paris"
// citycode: "75118"
// context: "75, Paris, Île-de-France"
// district: "Paris 18e Arrondissement" Attention, this value maybe Null
/// housenumber "113" Attention, this value maybe Null
// id: "75118_5122"
// importance: 0.74667
// label: "Avenue Junot 75018 Paris"
// name: "Avenue Junot"
// postcode: "75018"
// score: 0.2724245454545455
// street: "Avenue Junot"
// type: "street"  OR "housenumber"
// x: 651328.83
// y: 6865553.21
export interface LocationResOption {
  id: string
  city: string
  citycode: string
  context: string
  district?: string
  housenumber?: string
  postcode: string
  street: string
  label: string
  type: "street" | "housenumber" | "municipality"
}