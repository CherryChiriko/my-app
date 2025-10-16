// src/slices/deckSlice.js
import { createSlice } from '@reduxjs/toolkit';
import decksData from '../data/decks';
import allCards from '../data/cards'; // Import the complete list of cards

// Helper function to find the initial active deck with the most due cards
const getInitialActiveDeck = (decks) => {
    if (decks.length === 0) return null;
    const sortedDeck = decks.sort((a, b) => b.due - a.due); // Sort decks by due count descending
    if (sortedDeck[0].due > 0) {
      return sortedDeck[0];
    } else return null;
};

const getDeckCards = (deck) => {
  const filteredCards = allCards.filter(card => card.deckId === deck.id)
  return filteredCards;
};

const initialActiveDeck = getInitialActiveDeck(decksData);
const initialCards = initialActiveDeck ? getDeckCards(initialActiveDeck) : [];

const initialState = {
  decks: decksData,
  activeDeck: initialActiveDeck,
  allCards: initialCards, 
};

export const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    selectDeck: (state, action) => {
      const selectedDeck = action.payload;
      state.activeDeck = {
          ...selectedDeck,
          allCards: getDeckCards(selectedDeck), 
      };
    },
    updateCard: (state, action) => {
      const updatedCard = action.payload;
      const cardIndex = state.allCards.findIndex(card => card.id === updatedCard.id);
      if (cardIndex !== -1) {
        state.allCards[cardIndex] = updatedCard;
      }
    },
    // You can add more reducers here for creating decks, etc.
  },
});

export const { selectDeck, updateCard } = deckSlice.actions;

export const selectAllDecks = (state) => state.decks.decks;
export const selectActiveDeck = (state) => state.decks.activeDeck;
export const selectAllCards = (state) => state.decks.allCards;

export default deckSlice.reducer;