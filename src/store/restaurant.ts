import { createSlice } from "@reduxjs/toolkit";
import { SessionStorageUtils } from '../utils';
import { IRestaurant } from "../typing";

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

const sessionStorageObj = SessionStorageUtils.loadRestConfig(); 

let restaurantId = sessionStorageObj?.restaurantId || DefaultRestInfo.name;
let table = sessionStorageObj?.table || "1";

const paramOfRestaurantId = searchParams.get("restaurantId");
const paramOfTable = searchParams.get("table");
if (paramOfRestaurantId) {
  restaurantId = paramOfRestaurantId;
}
if (paramOfTable) {
  table = paramOfTable;
}
SessionStorageUtils.saveRestConfig({ restaurantId, table });

const { reducer: RestaurantReducer, actions } = createSlice({
  name: RESTAURANT_FEATURE_KEY,
  initialState: {
    restaurantId,
    table,
    restInfo: null as (IRestaurant | null),
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
