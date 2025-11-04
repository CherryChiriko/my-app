import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import decksData from "../data/decks"; // local fallback
import { updateGlobalStreak } from "./streakSlice";

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
      // track last deck chosen
      state.lastStudiedDeckId = action.payload.id;
    },
    recordStudyActivity: (state, action) => {
      const { deckId, learnCount, reviewCount } = action.payload;
      const deck = state.decks.find((d) => d.id === deckId);
      if (!deck) return;

      const today = new Date().toISOString().slice(0, 10);

      // if new day → reset daily counters & possibly reset streak
      if (deck.lastStudyDate !== today) {
        // reset streak if day skipped
        if (deck.lastStudyDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const prevDay = yesterday.toISOString().slice(0, 10);
          if (deck.lastStudyDate !== prevDay) {
            deck.streak = 0;
          }
        }

        deck.dailyLearned = 0;
        deck.dailyReviewed = 0;
      }

      // update counters
      deck.dailyLearned += learnCount;
      deck.dailyReviewed += reviewCount;
      deck.lastStudyDate = today;

      // streak increment condition
      if (!deck.streakCreditedToday) {
        if (deck.dailyLearned >= 10 || deck.dailyReviewed >= 25) {
          deck.streak += 1;
          deck.streakCreditedToday = true;
        }
      }

      const anyDeckHasActivity = state.decks.some(
        (d) => d.lastStudyDate === today && d.streakCreditedToday
      );

      if (anyDeckHasActivity) {
        // dispatch safely only from thunk version or middleware
        window.store.dispatch(
          updateGlobalStreak({ anyDeckStudiedToday: true })
        );
      }
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
export const { selectDeck, recordStudyActivity } = deckSlice.actions;

/** Selectors */
export const selectAllDecks = (state) => state.decks.decks;
export const selectActiveDeckId = (state) => state.decks.activeDeckId;
export const selectLastStudiedDeckId = (state) => state.decks.lastStudiedDeckId;

export const selectActiveDeck = (state) => {
  const { decks, activeDeckId } = state.decks;
  return decks.find((d) => d.id === activeDeckId) || null;
};
export const selectDecksStatus = (state) => state.decks.status;
export const selectDecksError = (state) => state.decks.error;

export default deckSlice.reducer;
