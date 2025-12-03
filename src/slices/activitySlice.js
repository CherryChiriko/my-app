import { createSlice } from "@reduxjs/toolkit";
import startOfToday from "date-fns/startOfToday";

const dateKey = () => {
  const d = startOfToday();
  return d.toISOString().slice(0, 10);
};

const initialState = {
  days: {}, // keyed by YYYY-MM-DD
  lastUpdated: null,
};

export const selectActivityDays = (state) => state.activity.days;

export const selectHeatmapData = (state) => {
  const days = state.activity.days;
  return Object.values(days)
    .map((d) => ({
      date: d.date,
      value: d.cardsStudied || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const makeSelectHeatmapData =
  (metric = "cardsStudied") =>
  (state) => {
    const days = state.activity.days;
    return Object.values(days)
      .map((d) => ({
        date: d.date,
        value: d[metric] ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    logStudySession: (state, action) => {
      const {
        cardsStudied = 0,
        cardsReviewed = 0,
        cardsLearned = 0,
        timeStudiedSeconds = 0,
        xpEarned = 0,
        forcedDateKey, // optional override (useful for debugging)
      } = action.payload;

      const key = forcedDateKey || dateKey();

      if (!state.days[key]) {
        state.days[key] = {
          date: key,
          cardsStudied: 0,
          cardsReviewed: 0,
          cardsLearned: 0,
          timeStudiedSeconds: 0,
          xpEarned: 0,
        };
      }

      state.days[key].cardsStudied += cardsStudied;
      state.days[key].cardsReviewed += cardsReviewed;
      state.days[key].cardsLearned += cardsLearned;
      state.days[key].timeStudiedSeconds += timeStudiedSeconds;
      state.days[key].xpEarned += xpEarned;

      state.lastUpdated = new Date().toISOString();
    },

    resetActivity: (state) => {
      state.days = {};
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { logStudySession, resetActivity } = activitySlice.actions;
export default activitySlice.reducer;
