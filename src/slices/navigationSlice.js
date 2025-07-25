import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentView: 'dashboard', // Set your initial active view
  },
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
  },
});

export const { setCurrentView } = navigationSlice.actions;
export const selectCurrentView = (state) => state.navigation.currentView;

export default navigationSlice.reducer;