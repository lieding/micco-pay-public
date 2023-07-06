import { createSlice } from "@reduxjs/toolkit";
import type { OrderingSummary, CoursePayloafType } from "../typing";

export const ORDERING_FEATURE_KEY = "ordering";

export type TipType = {
  customized: boolean;
  amount: number;
  selected: boolean;
};

const { reducer: OrderingReducer, actions } = createSlice({
  name: ORDERING_FEATURE_KEY,
  initialState: {
    summary: <OrderingSummary>{},
    tip: <TipType>{ customized: false, amount: 0, selected: false },
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
      const { payload } = action;
      const obj = { customized: false };
      if (typeof payload === "number") {
        const selected = state.tip.amount != payload;
        state.tip = { ...obj, selected, amount: selected ? payload : 0 };
      } else if (typeof payload === "object") {
        state.tip = {
          ...obj,
          ...payload,
        };
      }
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

export function getTotalAmount(summary: OrderingSummary, tip?: TipType) {
  return (
    Object.values(summary).reduce((prev, cur) => {
      return prev + cur.count * cur.course.price;
    }, 0) + (tip?.selected ? tip?.amount || 0 : 0)
  );
}
