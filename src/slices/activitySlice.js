import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import { getTodayISO } from "../utils/dateHelper";
import { demoActivityRows, isDemoUserId } from "../utils/demoMode";

export const selectSettingsState = (state) => state.settings;

/* -------------------------------------------
   Helper Functions
-------------------------------------------- */
const dateKey = () => getTodayISO();

/* -------------------------------------------
   Initial State
-------------------------------------------- */
const initialState = {
  days: {},
  status: "idle",
  error: null,
  lastUpdated: null,
};

/* -------------------------------------------
   Async Thunks
-------------------------------------------- */
export const fetchDailyActivity = createAsyncThunk(
  "activity/fetchDaily",
  async ({ user_id } = {}, { rejectWithValue }) => {
    try {
      let userId = user_id;

      if (isDemoUserId(userId)) {
        return demoActivityRows;
      }

      if (!userId) {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {
          throw new Error("Not authenticated");
        }

        userId = userData.user.id;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 60);
      const cutoffStr = cutoffDate.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("daily_user_stats")
        .select(
          "date, cards_reviewed, cards_learned, time_studied_seconds, total_xp, has_practiced_character",
        )
        .eq("user_id", userId)
        .gte("date", cutoffStr);

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* -------------------------------------------
   Slice
-------------------------------------------- */
export const activitySlice = createSlice({
  name: "activity",
  initialState,

  reducers: {
    logStudySession: (state, action) => {
      const {
        cardsReviewed = 0,
        cardsLearned = 0,
        isCharacterLearn = false,
        forcedDateKey,
      } = action.payload;

      const key = forcedDateKey || dateKey();
      const existing = state.days[key] || {};

      state.days[key] = {
        date: key,

        cardsReviewed: (existing.cardsReviewed || 0) + cardsReviewed,

        cardsLearned: (existing.cardsLearned || 0) + cardsLearned,

        timeStudiedSeconds: existing.timeStudiedSeconds || 0,

        totalXP: existing.totalXP || 0,

        cardsStudied:
          (existing.cardsStudied || 0) + cardsReviewed + cardsLearned,

        // Character LEARN mode triggers the daily flag lock
        hasPracticedCharacter:
          Boolean(existing.hasPracticedCharacter) || Boolean(isCharacterLearn),
      };

      state.lastUpdated = new Date().toISOString();
    },

    resetActivity: (state) => {
      state.days = {};
      state.lastUpdated = new Date().toISOString();
      state.status = "idle";
      state.error = null;
    },

    updateDayFromRealtime: (state, action) => {
      const {
        date,
        cards_reviewed,
        cards_learned,
        time_studied_seconds,
        total_xp,
        has_practiced_character,
      } = action.payload;

      state.days[date] = {
        date,
        cardsReviewed: cards_reviewed || 0,
        cardsLearned: cards_learned || 0,
        timeStudiedSeconds: time_studied_seconds || 0,
        totalXP: total_xp || 0,
        cardsStudied: (cards_reviewed || 0) + (cards_learned || 0),

        hasPracticedCharacter: Boolean(has_practiced_character),
      };

      state.lastUpdated = new Date().toISOString();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyActivity.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchDailyActivity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.days = {};

        action.payload.forEach((d) => {
          state.days[d.date] = {
            date: d.date,

            cardsReviewed: d.cards_reviewed || 0,

            cardsLearned: d.cards_learned || 0,

            timeStudiedSeconds: d.time_studied_seconds || 0,

            totalXP: d.total_xp || 0,

            cardsStudied: (d.cards_reviewed || 0) + (d.cards_learned || 0),

            hasPracticedCharacter: Boolean(d.has_practiced_character),
          };
        });

        state.lastUpdated = new Date().toISOString();
      })

      .addCase(fetchDailyActivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch daily activity";

        console.error("fetchDailyActivity failed:", action.payload);
      });
  },
});

/* -------------------------------------------
   Base Selectors
-------------------------------------------- */

export const selectActivityDays = (state) => state.activity?.days || {};

const selectActivityStatus = (state) => state.activity?.status;

const selectActivityError = (state) => state.activity?.error;

/* -------------------------------------------
   Memoized Selectors
-------------------------------------------- */

export const selectIsActivityLoading = createSelector(
  [selectActivityStatus],
  (status) => status === "loading",
);

export const selectActivityLoadError = createSelector(
  [selectActivityError],
  (error) => error,
);

/* -------------------------------------------
   Today's Activity
-------------------------------------------- */

export const selectTodayActivity = createSelector(
  [selectActivityDays],
  (days) => {
    const today = dateKey();

    return (
      days[today] || {
        date: today,
        cardsReviewed: 0,
        cardsLearned: 0,
        timeStudiedSeconds: 0,
        cardsStudied: 0,
        totalXP: 0,
        hasPracticedCharacter: false,
      }
    );
  },
);

/* -------------------------------------------
   Character Practice Entitlement
-------------------------------------------- */

export const selectHasPracticedCharacterToday = createSelector(
  [selectTodayActivity],
  (todayActivity) => Boolean(todayActivity.hasPracticedCharacter),
);

// Backward-compatibility alias for components expecting a numeric count
export const selectCharacterSessionsToday = createSelector(
  [selectHasPracticedCharacterToday],
  (hasPracticed) => (hasPracticed ? 1 : 0),
);

/* -------------------------------------------
   Activity Days
-------------------------------------------- */

export const selectSortedActivityDays = createSelector(
  [selectActivityDays],
  (days) => {
    return Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
  },
);

/* -------------------------------------------
   Active Days
-------------------------------------------- */

export const selectActiveDaysCount = createSelector(
  [selectActivityDays],
  (days) => {
    return Object.values(days).filter((d) => (d.cardsStudied || 0) > 0).length;
  },
);

/* -------------------------------------------
   Activity For Specific Date
-------------------------------------------- */

export const selectActivityByDate = (date) =>
  createSelector([selectActivityDays], (days) => {
    return (
      days[date] || {
        date,
        cardsReviewed: 0,
        cardsLearned: 0,
        timeStudiedSeconds: 0,
        cardsStudied: 0,
        totalXP: 0,
        hasPracticedCharacter: false,
      }
    );
  });

/* -------------------------------------------
   Total Stats
-------------------------------------------- */

export const selectTotalActivity = createSelector(
  [selectActivityDays],
  (days) => {
    return Object.values(days).reduce(
      (acc, day) => ({
        cardsReviewed: acc.cardsReviewed + day.cardsReviewed,

        cardsLearned: acc.cardsLearned + day.cardsLearned,

        timeStudiedSeconds:
          acc.timeStudiedSeconds + (day.timeStudiedSeconds || 0),

        cardsStudied: acc.cardsStudied + day.cardsStudied,

        totalXP: acc.totalXP + (day.totalXP || 0),

        totalDays: acc.totalDays + 1,
      }),
      {
        cardsReviewed: 0,
        cardsLearned: 0,
        timeStudiedSeconds: 0,
        cardsStudied: 0,
        totalXP: 0,
        totalDays: 0,
      },
    );
  },
);

/* -------------------------------------------
   Heatmap Data
-------------------------------------------- */

export const selectHeatmapData = createSelector(
  [selectActivityDays, selectSettingsState],
  (days, settings) => {
    const reviewLimit = settings?.reviewLimit || 10;

    const learnLimit = settings?.learnLimit || 5;

    return Object.values(days)
      .map((d) => {
        const objective = Math.round(
          Math.max(d.cardsReviewed / reviewLimit, d.cardsLearned / learnLimit) *
            100,
        );

        const percent = Math.min(100, objective);

        return {
          date: d.date,
          value: percent,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  },
);

/* -------------------------------------------
   Actions
-------------------------------------------- */

export const { logStudySession, resetActivity, updateDayFromRealtime } =
  activitySlice.actions;

export default activitySlice.reducer;
