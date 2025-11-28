import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localDecks from "../data/decks.js";
import { supabase } from "../utils/supabaseClient";

const API_BASE = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const orderDecksByPriority = (decks) => {
  // 1️⃣ Decks with due cards first, sorted descending by due
  const dueDecks = decks.filter((d) => d.due > 0).sort((a, b) => b.due - a.due);

  // 2️⃣ Decks with new cards (unlearned), excluding those already in dueDecks
  const newDecks = decks.filter(
    (d) => !dueDecks.includes(d) && d.cardsCount - d.mastered - d.due > 0
  );

  // 3️⃣ Remaining decks (all mastered)
  const masteredDecks = decks.filter(
    (d) => !dueDecks.includes(d) && !newDecks.includes(d)
  );

  // Merge them in order
  return [...dueDecks, ...newDecks, ...masteredDecks];
};

/** Fetch decks with backend + fallback */
export const fetchDecks = createAsyncThunk(
  "decks/fetchDecks",
  async (_, thunk) => {
    try {
      console.log(
        "🌐 fetchDecks: starting fetch from Supabase...",
        new Date().toISOString()
      );
      const res = await fetch(`${API_BASE}/rest/v1/decks`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) throw new Error();

      const remoteDecks = await res.json();

      console.log("✅ fetchDecks: fetched decks from Supabase:", remoteDecks);
      return { remote: remoteDecks, local: localDecks };
    } catch {
      console.warn("⚠ Backend unavailable — using local decks only.");
      return { remote: [], local: localDecks };
    }
  }
);

/** Slice */
const deckSlice = createSlice({
  name: "decks",
  initialState: {
    decks: localDecks, // temporary until fetch runs
    activeDeckId: localDecks[0]?.id || null,
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveDeck(state, action) {
      state.activeDeckId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        const { remote, local } = action.payload;
        const decks = remote ? remote : local;
        state.decks = orderDecksByPriority(decks);

        // Recalculate the best active deck
        state.activeDeckId = orderDecksByPriority(decks)[0]?.id || null;

        state.status = "succeeded";
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setActiveDeck } = deckSlice.actions;

export const selectDecks = (state) => state.decks.decks;
export const selectActiveDeck = (state) =>
  state.decks.decks.find((d) => d.id === state.decks.activeDeckId) || null;
export const selectDeckStatus = (state) => state.decks.status;
export const selectDeckError = (state) => state.decks.error;

export default deckSlice.reducer;
