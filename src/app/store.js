import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import deckReducer from "../slices/deckSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    decks: deckReducer,
  },
});
