import { configureStore } from "@reduxjs/toolkit";
import { DisplayMode } from "../typing";
import { LocalStorageUtils } from "../utils";
import { api } from "./api";
import { SessionStorageUtils } from '../utils';
import RestauranrReducer, { RESTAURANT_FEATURE_KEY } from "./restaurant";
import OrderingReducer, { ORDERING_FEATURE_KEY } from "./ordering";
import MenuReducer, { MENU_FEATURE_KEY } from "./menu";
import ConfigReducer, { CONFIG_FEATURE_KEY } from './config';
import PaygreenReducer, { PAYGREEN_FEATURE_KEY } from "./paygreen";
export { useGetRestInfoQuery, useQueryMenuInfoQuery } from "./api";


export function getInitParameters () {
  if (!window.initParams) OnInit();
  return window.initParams;
}

function OnInit () {
  const DefaultRestInfo = {
    name: "wokgrill-91170-1",
    displayName: "WOK GRILL VIRY-CHÂTILLON",
    address: "102 AVENUE DU GÉNÉRAL DE GAULLE 91170 VIRY-CHÂTILLON",
    introImgUrl:
      "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wok-grille-intro.png",
    logoUrl:
      "https://micco-pay-images.s3.eu-west-3.amazonaws.com/wokgrille-logo.png",
  };
  
  const DefaultConfig = {
    displayMode: DisplayMode.DEFAULT_RESTAUTANT,
  }

  const searchParams = new URL(window.location.href).searchParams;

  const sessionStorageObj = SessionStorageUtils.loadRestConfig(); 

  let restaurantId = sessionStorageObj?.restaurantId || DefaultRestInfo.name;
  let table = sessionStorageObj?.table || "1";
  let displayMode = sessionStorageObj?.displayMode || DefaultConfig.displayMode;
  let clientId = sessionStorageObj?.clientId;

  restaurantId = searchParams.get("restaurantId") || restaurantId;
  table = searchParams.get("table") || table;
  displayMode = searchParams.get("displayMode") || displayMode;
  clientId = searchParams.get("clientId") || clientId;

  const initParams = { restaurantId, table, displayMode, clientId };
  window.initParams = initParams;
  SessionStorageUtils.saveRestConfig(initParams);
}

function createMiddleware(getDefaultMiddleware: any) {
  return getDefaultMiddleware().concat(api.middleware);
}

const store = configureStore({
  reducer: {
    [RESTAURANT_FEATURE_KEY]: RestauranrReducer,
    [CONFIG_FEATURE_KEY]: ConfigReducer,
    [ORDERING_FEATURE_KEY]: OrderingReducer,
    [MENU_FEATURE_KEY]: MenuReducer,
    [api.reducerPath]: api.reducer,
    [PAYGREEN_FEATURE_KEY]: PaygreenReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: createMiddleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store;

export function persistStore() {
  LocalStorageUtils.persistGlobalStore({
    ...store.getState(),
    [MENU_FEATURE_KEY]: null,
    [api.reducerPath]: null,
  });
}


