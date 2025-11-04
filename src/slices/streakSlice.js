import { createSlice } from "@reduxjs/toolkit";

const today = () => new Date().toISOString().slice(0, 10);

const streakSlice = createSlice({
  name: "streak",
  initialState: {
    globalStreak: 0,
    lastUpdate: null,
  },
  reducers: {
    updateGlobalStreak: (state, action) => {
      const { anyDeckStudiedToday } = action.payload;
      const currentDay = today();

      if (state.lastUpdate === currentDay) return; // already rewarded today

      if (anyDeckStudiedToday) {
        state.globalStreak += 1;
      } else {
        state.globalStreak = 0;
      }

      state.lastUpdate = currentDay;
    },
  },
});

export const { updateGlobalStreak } = streakSlice.actions;
export const selectGlobalStreak = (s) => s.streak.globalStreak;
export default streakSlice.reducer;
