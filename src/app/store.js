import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import deckReducer from "../slices/deckSlice";
import cardReducer from "../slices/cardSlice";
import streakReducer from "../slices/streakSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    decks: deckReducer,
    cards: cardReducer,
    streak: streakReducer,
  },
});
