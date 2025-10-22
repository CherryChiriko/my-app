import { createSlice } from "@reduxjs/toolkit";
import cardsData from "../data/cards";

const initialState = {
  cards: cardsData,
};

export const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    updateCard: (state, action) => {
      const updatedCard = action.payload;
      const index = state.cards.findIndex((c) => c.id === updatedCard.id);
      if (index !== -1) state.cards[index] = updatedCard;
    },
  },
});

export const { updateCard } = cardSlice.actions;

// Selectors
export const selectAllCards = (state) => state.cards.cards;
export const selectCardsByDeckId = (deckId) => (state) =>
  state.cards.cards.filter((c) => c.deckId === deckId);

export default cardSlice.reducer;
