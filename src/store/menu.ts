import { createSlice } from "@reduxjs/toolkit";
import type {
  ICourse,
  MenuMap,
  QueryRestInfoResponse,
  SetMenuInfoPayloadType
} from "../typing";
import { CourseUtils, getDayTimeKey, isValidArray } from "../utils";

export const MENU_FEATURE_KEY = "menu";

const { reducer: MenuReducer, actions } = createSlice({
  name: MENU_FEATURE_KEY,
  initialState: {
    menuMap: <MenuMap>{},
    activeCategoryId: "",
    categories: <string[]>[],
    fastCheckouts: <ICourse[]>[],
    activeKw: '',
    labelSearchMenus: <ICourse[]>[],
    searchMode: false,
  },
  reducers: {
    setCatesAndCheckouts(state, action: { payload: QueryRestInfoResponse & { categories?: string[] } }) {
      let { categories = [], fastCheckouts = [], menuInfo = [], holiday } = action.payload;
      const dayTimeKey = getDayTimeKey();
      fastCheckouts = fastCheckouts.map(course =>
        CourseUtils.formatPriceIfNeedChange(course, holiday, dayTimeKey));
      menuInfo = menuInfo.map(course =>
        CourseUtils.formatPriceIfNeedChange(course, holiday, dayTimeKey));
      state.fastCheckouts = fastCheckouts;
      state.categories = categories;
      const categoryId = categories[0] as string;
      state.activeCategoryId = categoryId;
      state.menuMap[categoryId] = menuInfo;
    },
    setActiveCategory(state, action) {
      const categoryId = action.payload;
      state.activeCategoryId = categoryId;
    },
    setMenuInfo(state, action: SetMenuInfoPayloadType) {
      const { categoryId, menuInfo } = action.payload;
      state.menuMap[categoryId] = menuInfo;
    },
    slideMenu (state, action: { payload: { toRight: boolean } }) {
      const { payload: { toRight } } = action;
      const { activeCategoryId, categories } = state;
      const idx = categories.findIndex(id => id === activeCategoryId);
      // if nox is the most right
      if (
        (toRight && idx === categories.length - 1) ||
        (!toRight && idx === 0)
      ) {
        window.$resetMenuPosBeforeSlide?.(); 
      } else {
        let newIdx = toRight ? idx + 1 : idx - 1;
        state.activeCategoryId = categories[newIdx];
      }
      window.$resetMenuPosBeforeSlide = undefined;
    },
    toggleSearch (state, action: { payload: { activeKw: string } }) {
      const { activeKw } = action.payload;
      const searchMode = Boolean(activeKw.length);
      state.searchMode = searchMode;
      state.activeKw = activeKw;
    },
    setSearchRes (
      state, 
      action: { payload: { keyword: string, labelSearchMenus: ICourse[] } }
    ) {
      const { keyword, labelSearchMenus } = action.payload;
      if (keyword === state.activeKw && isValidArray(labelSearchMenus)) {
        state.labelSearchMenus = labelSearchMenus;
      }
    }
  },
});

export const {
  setActiveCategory,
  setCatesAndCheckouts,
  setMenuInfo,
  slideMenu,
  toggleSearch,
  setSearchRes,
} = actions;
export default MenuReducer;
