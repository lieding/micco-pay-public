import { isValidObject } from ".";
import { DayPeriod, ICourse, QueryRestInfoResponse } from "../typing";

/**
 * Some courses are configured to change the price depending on if it is holiday, 
 * day or night, and the date of the week; We assume that the price in the [course] object is 'defaultPrice'
 * and all the price variation are set in the 'priceChange' property
*/
export function formatPriceIfNeedChange (course: ICourse, holiday: QueryRestInfoResponse["holiday"], dayTimeKey: string) {
  const { priceChange, price: defaultPrice } = course;
  let price = defaultPrice;
  if (isValidObject(priceChange)) {
    const priceChangeObj = priceChange as { [key: string]: number };
    const {
      holiday: holidayDefault,
      night: nightDefault
    } = priceChangeObj;
    const dayTimeChange = priceChangeObj[dayTimeKey];
    if (holiday) {
      price = priceChangeObj[holiday] || holidayDefault || defaultPrice;
    } else if (dayTimeChange) {
      price = dayTimeChange;
    } else if (dayTimeKey.includes(DayPeriod.NIGHT)) {
      price = nightDefault || defaultPrice;
    }
    return { ...course, price };
  }
  return course;
} 