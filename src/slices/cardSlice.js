// src/slices/cardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";

const TABLES = {
  A: "cards_a",
  C: "cards_c",
};
const PROGRESS = {
  A: "cards_a_progress",
  C: "cards_c_progress",
};

export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async ({ deck_id, studyMode, user_id = 1 }) => {
    const table = TABLES[studyMode];
    const progressTable = PROGRESS[studyMode];

    const { data, error } = await supabase
      .from(table)
      .select(
        `
        *,
        progress:${progressTable} (
          ease_factor,
          review_interval,
          repetitions,
          due_date,
          last_studied,
          status,
          suspended
        )
      `
      )
      .eq("deckId", deck_id)
      .eq(`${progressTable}.user_id`, user_id);

    if (error) throw error;

    return data.map((c) => ({
      ...c,
      ...(c.progress?.[0] ?? {
        ease_factor: 2.5,
        review_interval: 0,
        repetitions: 0,
        due_date: null,
        last_studied: null,
        status: "new",
        suspended: false,
      }),
    }));
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

export const { clearCards } = cardSlice.actions;

export const selectCards = (state) => state.cards.cards;
export const selectCardsStatus = (state) => state.cards.status;

export default cardSlice.reducer;
