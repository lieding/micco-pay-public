import { createSlice } from "@reduxjs/toolkit";

export const STRIPE_FEATURE_KEY = "stripe";

const { reducer: StripeReducer, actions } = createSlice({
  name: STRIPE_FEATURE_KEY,
  initialState: {
    publicKey: "",
    clientSecret: "",
    initialized: false,
  },
  reducers: {
    setStripeInfo(state, action) {
      const { clientSecret, publicKey } = action.payload;
      state.clientSecret = clientSecret;
      state.publicKey = publicKey;
      state.initialized = true;
    },
  },
});

export const { setStripeInfo } = actions;
export default StripeReducer;
