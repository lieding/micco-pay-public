import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const RESTAURANT_FEATURE_KEY = "restaurant";

const restInfo = {
  name: "wokgrill-91170-1",
  displayName: "WOK GRILL VIRY-CHÂTILLON",
  address: "102 AVENUE DU GÉNÉRAL DE GAULLE 91170 VIRY-CHÂTILLON",
  introImgUrl:
    "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wok-grille-intro.png",
  logoUrl:
    "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wokgrille-logo.png",
};

const { reducer: RestaurantReducer, actions } = createSlice({
  name: RESTAURANT_FEATURE_KEY,
  initialState: { restaurantId: restInfo.name, table: "1", restInfo: null },
  reducers: {
    setRestInfo(state, action) {
      state.restInfo = action.payload;
    },
  },
});

export const { setRestInfo } = actions;

/*export const loadRestInfo = (payload: any) =>
  createAsyncThunk(`${RESTAURANT_FEATURE_KEY}/queryRestInfo`, (_, thunkAPI) => {
    thunkAPI.dispatch(setRestInfo(payload));
  });*/

export default RestaurantReducer;
