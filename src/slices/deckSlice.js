import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import decksData from "../data/decks"; // local fallback

/** Utility to determine initial active deck */
const getInitialActiveDeck = (decks) => {
  if (!decks || decks.length === 0) return null;
  const sortedDeck = [...decks].sort((a, b) => b.due - a.due); // copy first to avoid mutation
  if (sortedDeck[0].due > 0) return sortedDeck[0];
  return sortedDeck[0]; // fallback to first deck even if none are due
};

/** API base */
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://your-production-backend-url.com";

/** Optional async fetch (backend or local fallback) */
export const fetchDecks = createAsyncThunk("decks/fetchDecks", async () => {
  try {
    const res = await fetch(`${API_BASE}/decks`);
    if (!res.ok) throw new Error("Backend unavailable");
    const data = await res.json();
    return Array.isArray(data) ? data : data.decks || [];
  } catch (err) {
    console.warn("⚠️ Using local decks data fallback.");
    return decksData;
  }
});

/** Initial setup */
const initialDecks = decksData;
const initialActiveDeck = getInitialActiveDeck(initialDecks);

const initialState = {
  decks: initialDecks,
  activeDeckId: initialActiveDeck ? initialActiveDeck.id : null,
  status: "idle",
  error: null,
};

/** Slice */
export const deckSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    selectDeck: (state, action) => {
      state.activeDeckId = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decks = action.payload;

        // If no active deck yet, pick one based on getInitialActiveDeck()
        const newActive = getInitialActiveDeck(state.decks);
        state.activeDeckId = newActive ? newActive.id : null;
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

/** Actions */
export const { selectDeck } = deckSlice.actions;

/** Selectors */
export const selectAllDecks = (state) => state.decks.decks;
export const selectActiveDeckId = (state) => state.decks.activeDeckId;
export const selectActiveDeck = (state) => {
  const { decks, activeDeckId } = state.decks;
  return decks.find((d) => d.id === activeDeckId) || null;
};
export const selectDecksStatus = (state) => state.decks.status;
export const selectDecksError = (state) => state.decks.error;

export default deckSlice.reducer;
