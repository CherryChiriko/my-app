import { createSlice } from "@reduxjs/toolkit";
import themes from "../assets/themes";

const initialTheme = localStorage.getItem("currentThemeName");
const defaultTheme = themes[initialTheme] ? initialTheme : "classicDefault";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentThemeName: defaultTheme,
    allThemes: themes,
  },
  reducers: {
    setTheme: (state, action) => {
      const themeName = action.payload;
      if (themes[themeName]) {
        state.currentThemeName = themeName;
        localStorage.setItem("currentThemeName", themeName);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const selectCurrentThemeName = (state) => state.theme.currentThemeName;
export const selectActiveTheme = (state) =>
  state.theme.allThemes[state.theme.currentThemeName];
export const selectAllThemes = (state) => state.theme.allThemes;

export default themeSlice.reducer;
