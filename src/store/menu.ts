import { createSlice } from "@reduxjs/toolkit";
import type { ICourse, MenuMap, SetMenuInfoPayloadType } from "../typing";
import { useQueryMenuInfoQuery } from "./api";

export const MENU_FEATURE_KEY = "menu";

const { reducer: MenuReducer, actions } = createSlice({
  name: MENU_FEATURE_KEY,
  initialState: {
    menuMap: <MenuMap>{},
    activeCategoryId: "",
    categories: <string[]>[],
    fastCheckouts: <ICourse[]>[],
  },
  reducers: {
    setCatesAndCheckouts(state, action) {
      const { categories, fastCheckouts, menuInfo } = action.payload;
      state.fastCheckouts = fastCheckouts;
      state.categories = categories;
      const categoryId = categories[0] as string;
      state.activeCategoryId = categoryId;
      state.menuMap[categoryId] = menuInfo;
    },
    setActiveCategory(state, action) {
      const categoryId = (state.activeCategoryId = action.payload);
      const { restaurantId } = require("./store").store?.getState().restaurant;
      useQueryMenuInfoQuery({ categoryId, restaurantId });
    },
    setMenuInfo(state, action: SetMenuInfoPayloadType) {
      const { categoryId, menuInfo } = action.payload;
      state.menuMap[categoryId] = menuInfo;
    },
  },
});

export const { setActiveCategory, setCatesAndCheckouts, setMenuInfo } = actions;
export default MenuReducer;
