import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Map study modes to tables
const CARD_SOURCES = {
  A: "cards_a",
  C: "cards_c",
};

/** Fetch cards for a specific deck (remote + fallback local optional) */
export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async ({ deck_id, studyMode }, { rejectWithValue }) => {
    const table = CARD_SOURCES[studyMode];
    console.log(
      `🌐 fetchCards: fetching cards for deckId=${deck_id}, studyMode=${studyMode}`
    );

    if (!table) return rejectWithValue("Unknown studyMode");
    if (!table) {
      console.warn(
        `⚠️ fetchCards: Unknown studyMode ${studyMode}, falling back to local data`
      );
    }

    try {
      const res = await fetch(
        `${API_BASE}/rest/v1/${table}?deck_id=eq.${deck_id}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch cards");

      const data = await res.json();
      console.log(`✅ fetchCards: fetched ${data.length} cards from Supabase`);
      return data;
    } catch (err) {
      console.warn(
        "⚠️ Backend unavailable — could fallback to local data if available."
      );
      return []; // optional: filter from local cards JSON
    }
  }
);

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateCard(state, action) {
      const updatedCard = action.payload;
      const index = state.cards.findIndex((c) => c.id === updatedCard.id);
      if (index !== -1) state.cards[index] = updatedCard;
    },
    clearCards(state) {
      state.cards = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateCard, clearCards } = cardSlice.actions;

export const selectCards = (state) => state.cards.cards;
export const selectCardsStatus = (state) => state.cards.status;
export const selectCardsError = (state) => state.cards.error;

export default cardSlice.reducer;
