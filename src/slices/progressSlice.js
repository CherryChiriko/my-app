import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import { computeSM2 } from "../utils/srs";

const TABLES = {
  A: "card_a_progress",
  C: "card_c_progress",
};

export const updateProgress = createAsyncThunk(
  "progress/updateProgress",
  async ({ card, rating, study_mode, user_id }, { rejectWithValue }) => {
    if (!card?.id || !user_id || !study_mode) {
      return rejectWithValue(
        "Missing required fields: card, user_id, or study_mode"
      );
    }

    const table = TABLES[study_mode];
    if (!table) {
      return rejectWithValue(`Invalid study mode: ${study_mode}`);
    }

    try {
      const updates = computeSM2(card, rating);

      const { error } = await supabase.from(table).upsert([
        {
          card_id: card.id,
          user_id,
          ...updates,
        },
      ]);

      if (error) throw error;

      return { cardId: card.id, study_mode, updates };
    } catch (err) {
      console.error("updateProgress error:", err);
      return rejectWithValue(err.message || "Failed to update card progress");
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    byCardId: {},
    status: "idle",
    error: null,
  },
  reducers: {
    clearProgress(state) {
      state.byCardId = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProgress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { cardId, updates } = action.payload;
        state.byCardId[cardId] = {
          ...state.byCardId[cardId],
          ...updates,
        };
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update progress";
      });
  },
});

export const { clearProgress } = progressSlice.actions;

// Selectors
export const selectProgress = (state) => state.progress.byCardId;
export const selectProgressStatus = (state) => state.progress.status;
export const selectProgressError = (state) => state.progress.error;
export const selectCardProgress = (state, cardId) =>
  state.progress.byCardId[cardId] || null;

export default progressSlice.reducer;
