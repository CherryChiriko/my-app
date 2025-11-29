import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import deckReducer from "../slices/deckSlice";
import cardReducer from "../slices/cardSlice";
import streakReducer from "../slices/streakSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    decks: deckReducer,
    cards: cardReducer,
    users: userReducer,
    streak: streakReducer,
  },
});
