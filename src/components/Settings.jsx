import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActiveTheme,
  selectAllThemes,
  setTheme,
} from "../slices/themeSlice"; // Assuming setTheme action exists
import Header from "../components/General/Header"; // Reusing the Header component

const Settings = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const allThemes = useSelector(selectAllThemes);
  const dispatch = useDispatch();

  // Mock user settings data
  const userSettings = {
    username: "FlashcardMasterUser",
    email: "user@example.com",
    notificationEnabled: true,
    darkModePreferred: true, // This could be linked to theme selection later
  };

  const handleThemeChange = (themeName) => {
    dispatch(setTheme(themeName)); // Dispatch action to change the theme
  };

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header
          title="Settings"
          description="Manage your application preferences and user profile."
        />

        <div className="space-y-10">
          {/* Two-column layout for sections - Adjusted grid-cols for narrower right column */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 space-y-10 lg:space-y-0">
            {/* Theme Settings Section */}
            <section
              className={`${activeTheme.card.bg} rounded-lg p-6 shadow-xl`}
            >
              <h2
                className={`text-2xl font-bold ${activeTheme.card.text} mb-4`}
              >
                Theme Settings
              </h2>
              <p className={`${activeTheme.card.description} mb-6`}>
                Choose your preferred visual theme for the application.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.keys(allThemes).map((themeName) => {
                  const theme = allThemes[themeName];

                  return (
                    <div
                      key={themeName}
                      className="p-4 rounded-lg cursor-pointer border-1
                    transform hover:scale-105 transition-all duration-300
                    flex items-center space-x-4"
                      onClick={() => handleThemeChange(themeName)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full shadow-md flex-shrink-0
                          bg-gradient-to-br ${theme.gradients.from} ${theme.gradients.to}`}
                      ></div>
                      <div>
                        <p className={`font-semibold ${activeTheme.card.text}`}>
                          {theme.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* User Settings Section */}
            <section
              className={`${activeTheme.card.bg} rounded-lg p-6 shadow-xl`}
            >
              <h2
                className={`text-2xl font-bold ${activeTheme.card.text} mb-4`}
              >
                User Profile
              </h2>
              <p className={`${activeTheme.card.description} mb-6`}>
                View and manage your account information.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <span className={`${activeTheme.text.secondary}`}>
                    Username:
                  </span>
                  <span className={`${activeTheme.text.primary} font-medium`}>
                    {userSettings.username}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <span className={`${activeTheme.text.secondary}`}>
                    Email:
                  </span>
                  <span className={`${activeTheme.text.primary} font-medium`}>
                    {userSettings.email}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <span className={`${activeTheme.text.secondary}`}>
                    Notifications:
                  </span>
                  <span
                    className={`${
                      userSettings.notificationEnabled
                        ? "text-green-500"
                        : "text-red-500"
                    } font-medium`}
                  >
                    {userSettings.notificationEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                {/* Add more user settings fields as needed */}
              </div>
              {/* You could add an "Edit Profile" button here */}
              {/*
            <button className={`mt-6 ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton} font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}>
              Edit Profile
            </button>
            */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

// On mobile?

{
  /* Theme Selector Dropdown */
}
{
  /* <select
          value={currentThemeName} // Controlled component: value reflects current Redux state
          onChange={handleThemeChange} // Call handler on change
          // Dynamic Tailwind classes for styling the dropdown
          className={`p-2 rounded-md border ${activeTheme.bgColor} ${activeTheme.textColor} focus:outline-none focus:ring-2 ${activeTheme.buttonRing}`}
        > */
}
{
  /* Map over the theme keys to create options for the dropdown */
}
{
  /* {Object.keys(themes).map((themeKey) => (
            <option key={themeKey} value={themeKey}>
              {themes[themeKey].name}{" "} */
}
{
  /* Display the human-readable theme name */
}
{
  /* </option>
          ))}
        </select> */
}
