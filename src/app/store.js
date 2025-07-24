import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import navigationReducer from "../features/navigationSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
  },
});
