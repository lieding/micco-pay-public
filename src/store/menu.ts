import { createSlice } from "@reduxjs/toolkit";
import type { ICourse, MenuMap } from "../typing";

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
      state.activeCategoryId = action.payload;
    },
  },
});

export const { setActiveCategory, setCatesAndCheckouts } = actions;
export default MenuReducer;
