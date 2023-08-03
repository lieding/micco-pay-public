import { createSlice } from "@reduxjs/toolkit";
import {
  OrderingSummary,
  CoursePayloafType,
  TipType,
  Contact,
  PaymentOptionEnum,
} from "../typing";

export const ORDERING_FEATURE_KEY = "ordering";

const { reducer: OrderingReducer, actions } = createSlice({
  name: ORDERING_FEATURE_KEY,
  initialState: {
    summary: <OrderingSummary>{},
    tip: <TipType>{ customized: false, amount: 0, selected: false },
    fee: 0,
    amtAfterFee: 0,
    rounded: false,
    contact: <Contact>{ phone: "", name: "", mail: "" },
    paymentMethodKey: PaymentOptionEnum.BLUE_CARD,
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
    setFee(state, action) {
      const { fee, amtAfterFee } = action?.payload || {};
      state.fee = fee || 0;
      state.amtAfterFee = amtAfterFee || 0;
    },
    setRounded(state, action) {
      state.rounded = action.payload;
    },
    setContact(state, action: { payload: Contact }) {
      state.contact = { ...state.contact, ...action.payload };
    },
    setPaymentMethod(state, action: { payload: PaymentOptionEnum }) {
      state.paymentMethodKey = action.payload;
    },
  },
});

export const {
  addOrder,
  reduceOrder,
  setTip,
  setRounded,
  setContact,
  setFee,
  setPaymentMethod,
} = actions;
export default OrderingReducer;

export function getTotalCount(summary: OrderingSummary) {
  let cnt = 0;
  for (const key in summary) cnt += summary[key].count;
  return cnt;
}

export function getTotalAmount(
  summary: OrderingSummary,
  tip?: TipType,
  toRound = false
) {
  let amount =
    Object.values(summary).reduce((prev, cur) => {
      return prev + cur.count * cur.course.price;
    }, 0) + (tip?.selected ? tip?.amount || 0 : 0);
  amount = Number(amount.toFixed(2));
  return toRound ? Math.ceil(amount) : amount;
}

export function checkWithoutPayment(paymentMethod: PaymentOptionEnum) {
  return paymentMethod === PaymentOptionEnum.IN_CASH;
}
