import { createSlice } from "@reduxjs/toolkit";
import { RootState, getInitParameters } from ".";
import { DisplayMode } from "../typing";

export const CONFIG_FEATURE_KEY = "config";

const { displayMode } = getInitParameters();

const { reducer: ConfigReducer, actions } = createSlice({
  name: CONFIG_FEATURE_KEY,
  initialState: {
    displayMode: <DisplayMode>displayMode,
  },
  reducers: {
    setDisplayMode(state, action: { payload: { mode: DisplayMode } }) {
      state.displayMode = action.payload.mode;
    }
  },
});

export const { setDisplayMode } = actions;

export function checkHideMiccopayLogo (displayMode: DisplayMode) {
  if (displayMode === DisplayMode.DEFAULT_MARKET)
    return true;
  return false;
}
 
export default ConfigReducer;