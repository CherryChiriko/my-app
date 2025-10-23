// src/slices/cardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cardsData from "../data/cards";

// Local or backend API base
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://your-production-backend-url.com";

/** 🧠 Async thunk: fetch cards by deckId (offline fallback supported) */
export const fetchCardsByDeckId = createAsyncThunk(
  "cards/fetchByDeckId",
  async (deckId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/cards?deckId=${deckId}`);
      if (!res.ok) throw new Error("Failed to fetch cards from backend");
      const data = await res.json();
      return data; // expects an array of cards
    } catch (err) {
      console.warn("⚠️ Backend unavailable — using local data.");
      // fallback to local data filtered by deck
      return cardsData.filter((c) => c.deckId === deckId);
    }
  }
);

const initialState = {
  cards: [],
  status: "idle",
  error: null,
};

/** 🧩 Card Slice */
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardsByDeckId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCardsByDeckId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(fetchCardsByDeckId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateCard } = cardSlice.actions;

/** 🎯 Selectors */
export const selectAllCards = (state) => state.cards.cards;
export const selectCardsStatus = (state) => state.cards.status;
export const selectCardsError = (state) => state.cards.error;

export default cardSlice.reducer;
