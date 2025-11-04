// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";
import {
  fetchDecks,
  selectAllDecks,
  selectDecksStatus,
  selectDecksError,
} from "../../slices/deckSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faExclamationCircle,
  faChartLine,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

import DashboardHero from "./DashboardHero";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTheme = useSelector(selectActiveTheme);

  // Redux deck info
  const decks = useSelector(selectAllDecks);
  const status = useSelector(selectDecksStatus);
  const error = useSelector(selectDecksError);

  // Load decks on mount (if not already loaded)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDecks());
    }
  }, [dispatch, status]);

  // Compute stats from real deck data
  const cards_due_today = decks.reduce((t, d) => t + (d.due || 0), 0);
  const mastered_cards = decks.reduce((t, d) => t + (d.mastered || 0), 0);

  // Example stats that will eventually come from backend streak + study logs
  const today = {
    study_time: 0,
    accuracy: 0,
    xp_earned: 0,
  };

  const streaks = {
    current_streak: 0,
    longest_streak: 0,
  };

  /** ---------------- LOADING UI ---------------- */
  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app} p-6`}
      >
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
            R E V U
          </h1>
          <p className={`text-lg ${activeTheme.text.muted}`}>
            Loading your learning dashboard...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${activeTheme.background.secondary} h-32 rounded-xl animate-pulse shadow-lg`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- ERROR UI ---------------- */
  if (status === "failed") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app} p-6`}
      >
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
            R E V U
          </h1>
          <div
            className={`${activeTheme.alert.warningBg} ${activeTheme.alert.warningText} p-6 rounded-lg flex flex-col md:flex-row items-center space-y-4 shadow-xl`}
          >
            <FontAwesomeIcon icon={faExclamationCircle} className="w-8 h-8" />
            <div className="flex-grow text-center">
              <p className="font-semibold text-lg mb-2">
                Failed to load your dashboard
              </p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              className={`px-6 py-2.5 rounded-lg font-semibold ${activeTheme.button.outline}`}
              onClick={() => dispatch(fetchDecks())}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /** ---------------- MAIN DASHBOARD ---------------- */
  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full py-10 px-4 md:px-8 lg:px-12 font-inter`}
    >
      <div className="max-w-screen-xl mx-auto space-y-12">
        <DashboardHero
          activeTheme={activeTheme}
          streaks={streaks}
          cards_due_today={cards_due_today}
          mastered_cards={mastered_cards}
          today={today}
        />

        {/* Decks Overview */}
        <div className="space-y-6">
          <h2
            className={`text-3xl font-bold flex items-center gap-3 ${activeTheme.text.primary}`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7" />
            Your Decks ({decks.length})
          </h2>

          {decks.length === 0 ? (
            <div
              className={`${activeTheme.background.secondary} text-center py-16 rounded-xl shadow-xl border ${activeTheme.border.dashed}`}
            >
              <FontAwesomeIcon
                icon={faBookOpen}
                className="w-20 h-20 mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold mb-3">No decks yet</h3>
              <button
                onClick={() => navigate("/decks")}
                className={`px-8 py-3 rounded-full font-semibold text-lg ${activeTheme.button.primaryBg} ${activeTheme.text.activeButton}`}
              >
                Create Your First Deck
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.slice(0, 2).map((deck) => (
                <div key={deck.id}>Mini card</div>
              ))}
              <div
                className={`${activeTheme.background.secondary} rounded-xl p-6 shadow-xl flex items-center justify-center`}
              >
                <button
                  onClick={() => navigate("/decks")}
                  className={`px-6 py-2 rounded-full font-semibold ${activeTheme.button.secondaryBg}`}
                >
                  Browse More Decks
                </button>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7" />
          Your Stats
        </h2>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`${activeTheme.background.secondary} rounded-xl p-6 shadow-xl`}
          >
            <h3 className="text-xl font-bold flex items-center gap-3">
              <FontAwesomeIcon icon={faChartLine} />
              Accuracy Rate
            </h3>
            <div className="text-4xl font-bold mt-4">0%</div>
          </div>

          <div
            className={`${activeTheme.background.secondary} rounded-xl p-6 shadow-xl`}
          >
            <h3 className="text-xl font-bold flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Best Streak
            </h3>
            <div className="text-4xl font-bold mt-4">0 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
