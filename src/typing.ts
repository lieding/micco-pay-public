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
