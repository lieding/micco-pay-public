import { createSlice } from "@reduxjs/toolkit";
import { PgPaymentFlowStatus } from "../typing";

export const PAYGREEN_FEATURE_KEY = "paygreen";

const { reducer: PaygreenReducer, actions } = createSlice({
  name: PAYGREEN_FEATURE_KEY,
  initialState: {
    publicKey: "",
    objectSecret: "",
    paymentOrderID: "",
    expiresAt: 0,
    initialized: false,
    paymentFlowStatus: PgPaymentFlowStatus.INIT,
  },
  reducers: {
    setPaygreenInfo(state, action) {
      const {
        publicKey,
        expiresAt,
        objectSecret, 
        buyerId,
        paymentOrderID,
      } = action.payload;
      state.objectSecret = objectSecret;
      state.publicKey = publicKey;
      state.paymentOrderID = paymentOrderID;
      state.expiresAt = new Date(expiresAt).getTime();
    },
    reset(state) {
      state.objectSecret = "";
      state.paymentOrderID = "";
      state.expiresAt = 0;
      state.publicKey = "";
      state.initialized = false;
      window.paygreenjs?.unmount();
    },
    setInitStatus (state, action: { payload: boolean }) {
      state.initialized = action.payload;
    },
    setPaymentFlowStatus (state, action: { payload: PgPaymentFlowStatus }) {
      state.paymentFlowStatus = action.payload;
    },
  },
});

export const {
  setPaygreenInfo,
  reset: resetPaygreenInfo,
  setInitStatus: setPaygreenInitStatus,
  setPaymentFlowStatus,
} = actions;
export default PaygreenReducer;
