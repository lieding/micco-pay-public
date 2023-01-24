import { OrderingSummary } from "../typing";

export * as DateTimeUtils from "./date_time";

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
