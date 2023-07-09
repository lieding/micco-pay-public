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

export enum PaymentResultEnum {
  SUCCEEDED = "succeeded",
}

export interface PaymentResultParams {
  payment_intent?: string;
  payment_intent_client_secret?: string;
  redirect_status?: PaymentResultEnum;
}
