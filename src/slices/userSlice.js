// src/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (!profile) throw new Error("Profile not found");

      return profile;
    } catch (err) {
      console.error("fetchUserProfile error:", err);
      return rejectWithValue(err.message || "Failed to fetch profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearUser(state) {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
    // Update profile when streak is updated
    updateProfileFromStreak(state, action) {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { clearUser, updateProfileFromStreak } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user?.profile;
export const selectUsername = (state) => state.user?.profile?.username;
export const selectGlobalStreak = (state) =>
  state.user?.profile?.global_streak ?? 0;
export const selectGlobalMaxStreak = (state) =>
  state.user?.profile?.global_max_streak ?? 0;
export const selectGlobalStreakActive = (state) => {
  const profile = state.user?.profile;
  if (!profile?.global_last_active) return false;

  const today = new Date().toISOString().split("T")[0];
  return profile.global_last_active === today;
};
export const selectUserStatus = (state) => state.user?.status;
export const selectUserError = (state) => state.user?.error;

export default userSlice.reducer;
