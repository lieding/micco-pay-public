import { createSlice } from "@reduxjs/toolkit";
import type { OrderingSummary, CoursePayloafType } from "../typing";

export const ORDERING_FEATURE_KEY = "ordering";

const { reducer: OrderingReducer, actions } = createSlice({
  name: ORDERING_FEATURE_KEY,
  initialState: {
    summary: <OrderingSummary>{},
    tip: <null | number>null,
    rounded: false,
  },
  reducers: {
    addOrder(state, action: CoursePayloafType) {
      const { summary } = state;
      const { key } = action.payload;
      if (key in summary) summary[key].count++;
      else summary[key] = { count: 1, course: action.payload };
    },
    reduceOrder(state, action: CoursePayloafType) {
      const { summary } = state;
      const { key } = action.payload;
      if (key in summary) {
        const obj = summary[key];
        obj.count--;
        if (obj.count < 1) delete summary[key];
      }
    },
    setTip(state, action) {
      state.tip = action.payload;
    },
    setRounded(state, action) {
      state.rounded = action.payload;
    },
  },
});

export const { addOrder, reduceOrder, setTip, setRounded } = actions;
export default OrderingReducer;

export function getTotalCount(summary: OrderingSummary) {
  let cnt = 0;
  for (const key in summary) cnt += summary[key].count;
  return cnt;
}

export function getTotalAmount(summary: OrderingSummary, tip?: number | null) {
  return (
    Object.values(summary).reduce((prev, cur) => {
      return prev + cur.count * cur.course.price;
    }, 0) + (tip || 0)
  );
}
