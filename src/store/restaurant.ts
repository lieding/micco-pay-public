import { createSlice } from "@reduxjs/toolkit";
import { IRestaurant } from "../typing";
import { getInitParameters } from './'

export const RESTAURANT_FEATURE_KEY = "restaurant";

const { restaurantId, table } = getInitParameters();

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
