import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";

/** Priority ordering */
const orderDecksByPriority = (decks) => {
  if (!decks || decks.length === 0) return [];

  const dueDecks = decks.filter((d) => d.due > 0).sort((a, b) => b.due - a.due);
  const newDecks = decks.filter(
    (d) => !dueDecks.includes(d) && d.cards_count - d.mastered - d.due > 0
  );
  const masteredDecks = decks.filter(
    (d) => !dueDecks.includes(d) && !newDecks.includes(d)
  );

  return [...dueDecks, ...newDecks, ...masteredDecks];
};

/** Fetch decks */
export const fetchDecks = createAsyncThunk(
  "decks/fetchDecks",
  async (_, { rejectWithValue }) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map id to deck_id for consistency
      return (data || []).map((deck) => ({
        ...deck,
        deck_id: deck.id,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const deckSlice = createSlice({
  name: "decks",
  initialState: {
    decks: [],
    activeDeckId: null,
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
        state.error = null;
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        // action.payload is the array of decks
        const decks = action.payload;

        // Normalize: map id to deck_id for consistency
        const normalized = decks.map((d) => ({
          ...d,
          deck_id: d.id, // Always use id from database as deck_id
        }));

        // Sort by priority
        const sorted = orderDecksByPriority(normalized);

        state.decks = sorted;
        state.activeDeckId = sorted[0]?.deck_id || null;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load decks";
      });
  },
});

export const { setActiveDeck } = deckSlice.actions;

export const selectDecks = (state) => state.decks.decks;
export const selectActiveDeck = (state) => {
  const deck = state.decks.decks.find(
    (d) => d.deck_id === state.decks.activeDeckId
  );
  return deck || null;
};
export const selectDeckStatus = (state) => state.decks.status;
export const selectDeckError = (state) => state.decks.error;

export default deckSlice.reducer;
