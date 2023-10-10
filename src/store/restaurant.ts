import { createSlice } from "@reduxjs/toolkit";
import { IClient, IRestaurant, QueryRestInfoResponse } from "../typing";
import { getInitParameters } from './'

export const RESTAURANT_FEATURE_KEY = "restaurant";

const { restaurantId, table, clientId } = getInitParameters();

interface IRestaurantState {
  restaurantId: string
  table: string
  clientId: string | undefined
  restInfo: IRestaurant | null
  feeConfig: { percentage: number, addition: number }
  clientInfo: IClient | null
}

const { reducer: RestaurantReducer, actions } = createSlice({
  name: RESTAURANT_FEATURE_KEY,
  initialState: <IRestaurantState> {
    restaurantId,
    clientId,
    table,
    restInfo: null,
    feeConfig: { percentage: 0, addition: 0 },
    clientInfo: null
  },
  reducers: {
    setRestInfo(state, action) {
      state.restInfo = action.payload;
    },
    setFeeConfig (state, action) {
      state.feeConfig = action.payload;
    },
    setClientInfo (state, action) {
      state.clientInfo = action.payload;
    }
  },
});

export const { setRestInfo, setFeeConfig, setClientInfo } = actions;

export default RestaurantReducer;
