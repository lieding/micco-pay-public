import { configureStore } from "@reduxjs/toolkit";
import RestauranrReducer, { RESTAURANT_FEATURE_KEY } from "./restaurant";
import OrderingReducer, { ORDERING_FEATURE_KEY } from "./ordering";
import MenuReducer, { MENU_FEATURE_KEY } from "./menu";
import PaygreenReducer, { PAYGREEN_FEATURE_KEY } from "./paygreen";
import { LocalStorageUtils } from "../utils";
import { api } from "./api";

function createMiddleware(getDefaultMiddleware: any) {
  return getDefaultMiddleware().concat(api.middleware);
}

const store = configureStore({
  reducer: {
    [RESTAURANT_FEATURE_KEY]: RestauranrReducer,
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
