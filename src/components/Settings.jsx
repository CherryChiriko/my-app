import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActiveTheme,
  selectAllThemes,
  setTheme,
} from "../slices/themeSlice"; // Assuming setTheme action exists
import Header from "../components/Header"; // Reusing the Header component

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
              {/* TEST */}
              allThemes.map((theme) => (
              <React.Fragment key={theme.name}>
                <div
                  className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
        bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
                >
                  <div className="pb-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      Current Streak
                    </h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">7</div>
                    <p className={`text-sm ${activeTheme.text.activeButton}`}>
                      days in a row
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
                />
              </React.Fragment>
              ));
              <div
                className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
                  bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
              >
                <div className="pb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    Current Streak
                  </h3>
                </div>
                <div>
                  <div className="text-3xl font-bold">7</div>
                  <p className={`text-sm ${activeTheme.text.activeButton}`}>
                    days in a row
                  </p>
                </div>
              </div>
              <div
                className={`bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to}`}
              />
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, ${activeTheme.gradients.from.replace(
                    "from-",
                    ""
                  )}, ${activeTheme.gradients.to.replace("to-", "")})`,
                  transform: "scale(1.5)",
                  transformOrigin: "center center",
                  zIndex: 1,
                }}
              ></div>
              {/* TEST */}
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
