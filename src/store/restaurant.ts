import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const RESTAURANT_FEATURE_KEY = "restaurant";

const DefaultRestInfo = {
  name: "wokgrill-91170-1",
  displayName: "WOK GRILL VIRY-CHÂTILLON",
  address: "102 AVENUE DU GÉNÉRAL DE GAULLE 91170 VIRY-CHÂTILLON",
  introImgUrl:
    "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wok-grille-intro.png",
  logoUrl:
    "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wokgrille-logo.png",
};

const searchParams = new URL(window.location.href).searchParams;

const { reducer: RestaurantReducer, actions } = createSlice({
  name: RESTAURANT_FEATURE_KEY,
  initialState: {
    restaurantId: searchParams.get("restaurantId") ?? DefaultRestInfo.name,
    table: searchParams.get("table") ?? "1",
    restInfo: null,
    feeConfig: { percentage: 0, addition: 0 },
  },
  reducers: {
    setRestInfo(state, action) {
      state.restInfo = action.payload;
    },
    setFeeConfig (state, action) {
      state.feeConfig = action.payload;
    }
  },
});

export const { setRestInfo, setFeeConfig } = actions;

export default RestaurantReducer;
