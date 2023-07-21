import { DayPeriod, ICourse, OrderingSummary } from "../typing";

export * as DateTimeUtils from "./date_time";

export * as LocalStorageUtils from "./localStorage";

export * as CourseUtils from './courseUtils';

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
