import { DayPeriod, ICourse, OrderingSummary } from "../typing";

export * as DateTimeUtils from "./date_time";

export * as LocalStorageUtils from "./localStorage";

export * as CourseUtils from './courseUtils';

export * as Paygreen from './paygreen';

export * as SessionStorageUtils from './sessionStorage';

export * as InputValidtors from './validator';

export function formatTabledisplay(table: String) {
  const lenOfCharsToFill = 3 - table.length;
  if (lenOfCharsToFill < 1) return table;
  return table.padStart(lenOfCharsToFill, "0");
}

export function getBadgeChar(summary: OrderingSummary, key: string) {
  if (key in summary && summary[key]?.count) {
    return summary[key]?.count.toString();
  }
  return "+";
}

export function isValidObject(obj: unknown): obj is {} {
  if (!!obj && typeof obj == "object") return true;
  return false;
}

export function isValidArray(obj: unknown): obj is Array<unknown> {
  if (!!obj && Array.isArray(obj)) return true;
  return false;
}

export function formatCourseLabel(course: ICourse) {
  return course.isPack ? `[Emporter] ${course.label}` : course.label;
}

function getDayTimePeriod () {
  const hour = new Date().getHours();
  if (hour >= 18) return DayPeriod.NIGHT;
  else if (hour > 12) return DayPeriod.AFTERNOON;
  else if (hour > 11) return DayPeriod.NOON;
  else if (hour > 5) return DayPeriod.MORNING;
  return DayPeriod.NIGHT;
}

function getIsNight () {
  return getDayTimePeriod() === DayPeriod.NIGHT;
}

export function getDayTimeKey () {
  const isNight = getIsNight();
  const day = new Date().getDay().toString();
  return [day, isNight ? DayPeriod.NIGHT : null].filter(a => a ?? false).join('-');
}

/**
 *
 * You can get an array of all an object's properties in ES5+ by calling the class method Object.keys(obj). 
 * The function recursively calls itself in the for / in loop when it compares the contents of each property
 * You can hide a "private" function inside a function of this kind by placing one function declaration inside of another. The inner function is not hoisted out into the global scope, so it is only visible inside of the parent function.
 * The reason this nested helper function is necessary is that `typeof null` is still "object" in JS, a major "gotcha" to watch out for.
 */
export function simpleDeepEqual(obj1: unknown, obj2: unknown) {
  if (obj1 === obj2) {
    return true;
  } else if (isValidObject(obj1) && isValidObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length)
      return false;
    for (const prop in obj1) {
      // @ts-ignore
      if (!simpleDeepEqual(obj1[prop], obj2[prop]))
        return false;
    }
    return true;
  }
  return false;
}

export function getRemainingTimeInSeconds (timestamp: number | string) {
  let min = 0, sec = 0, timestampNum: number;
  if (typeof(timestamp) !== 'number') {
    timestampNum = Number(timestamp);
    if (Number.isNaN(timestampNum)) {
      console.error('invalid timestamp parameter');
      return { min, sec };
    }
  } else {
    timestampNum = timestamp;
  }
  const delta = (timestampNum - Date.now()) / 1000;
  if (delta < 0) {
    console.error('invalid timestamp parameter');
    return { min, sec };
  }
  min = Math.floor(delta / 60);
  sec = Math.ceil(delta % 60);
  return { min, sec };
}

export function intFormatingInto2Digits (num: number) {
  const numStr = num.toFixed(0);
  return numStr.length < 2 ? `0${numStr}` : numStr;
}
