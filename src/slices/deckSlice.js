// src/slices/deckSlice.js
import { createSlice } from "@reduxjs/toolkit";
import decksData from "../data/decks";

const getInitialActiveDeck = (decks) => {
  if (decks.length === 0) return null;
  const sortedDeck = decks.sort((a, b) => b.due - a.due); // Sort decks by due count descending
  if (sortedDeck[0].due > 0) {
    return sortedDeck[0];
  } else return null;
};

const initialActiveDeck = getInitialActiveDeck(decksData);

const initialState = {
  decks: decksData,
  activeDeckId: initialActiveDeck.id,
};

export const deckSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    selectDeck: (state, action) => {
      state.activeDeckId = action.payload.id;
    },
  },
});

export const { selectDeck } = deckSlice.actions;

export const selectAllDecks = (state) => state.decks.decks;
export const selectActiveDeckId = (state) => state.decks.activeDeckId;
export const selectActiveDeck = (state) => {
  const { decks, activeDeckId } = state.decks;
  return decks.find((d) => d.id === activeDeckId) || null;
};

export default deckSlice.reducer;
