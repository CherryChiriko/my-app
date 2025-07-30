// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../slices/themeSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBookOpen,
  faBook,
  faClock,
  faBullseye,
  faTrophy,
  faChartLine,
  faCalendarAlt,
  faExclamationCircle, // Added back for error state
} from "@fortawesome/free-solid-svg-icons";
import decksData from "../data/decks"; // Renamed to avoid conflict with state variable
import MiniDeckCard from "./Decks/MiniDeckCard";
import RevuLogo from "../assets/Revu_logo.png";

const Dashboard = ({ onStartStudy, onViewDeck }) => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();

  // State for dashboard data and loading/error states
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate data fetching for dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Increased delay for better visibility

        // Mock dashboard stats
        const mockDashboardStats = {
          overview: {
            cards_due_today: decksData.reduce(
              (total, deck) => total + (deck.due || 0),
              0
            ),
            mastered_cards: decksData.reduce(
              (total, deck) => total + (deck.mastered || 0),
              0
            ),
          },
          today: {
            study_time: 45, // Example value
            accuracy: 88, // Example value
            xp_earned: 1250, // Example value
          },
          streaks: {
            current_streak: 7, // Example value
            longest_streak: 21, // Example value
          },
        };
        setDashboardData(mockDashboardStats);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error("Dashboard data fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const refetchData = () => {
    // Re-trigger the data fetching effect
    setDashboardData(null); // Clear previous data
    setError(null); // Clear previous error
    setLoading(true); // Set loading true
    // In a real app, you might call fetchDashboardStats() directly or trigger a Redux action
    // For this mock setup, we'll just re-run the effect by changing a dependency or calling it.
    // Since it's in useEffect with empty dependency, we'll just simulate by setting states.
    // In a real app, you'd likely have a dedicated function for refetching.
    setTimeout(() => {
      const mockDashboardStats = {
        overview: {
          cards_due_today: decksData.reduce(
            (total, deck) => total + (deck.due || 0),
            0
          ),
          mastered_cards: decksData.reduce(
            (total, deck) => total + (deck.mastered || 0),
            0
          ),
        },
        today: {
          study_time: 30,
          accuracy: 90,
          xp_earned: 1500,
        },
        streaks: {
          current_streak: 8,
          longest_streak: 22,
        },
      };
      setDashboardData(mockDashboardStats);
      setLoading(false);
    }, 1000);
  };

  // Destructure data for easier access, providing fallbacks
  const { overview = {}, today = {}, streaks = {} } = dashboardData || {};
  const userDecks = Array.isArray(decksData) ? decksData : [];

  // Calculate total due and mastered cards from actual decksData
  const cards_due_today = userDecks.reduce(
    (total, deck) => total + (deck.due || 0),
    0
  );
  const mastered_cards = userDecks.reduce(
    (total, deck) => total + (deck.mastered || 0),
    0
  );

  // Loading state UI
  if (loading) {
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
                className={`${activeTheme.card.bg} h-32 rounded-xl animate-pulse shadow-lg`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app} p-6`}
      >
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
            R E V U
          </h1>
          <div
            className={`${activeTheme.alert.warningBg} ${activeTheme.alert.warningText} p-6 rounded-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 shadow-xl`}
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="w-8 h-8 flex-shrink-0"
            />
            <div className="flex-grow text-center md:text-left">
              <p className="font-semibold text-lg mb-2">
                Oops! Something went wrong.
              </p>
              <p className="text-sm">
                Failed to load dashboard data: {error}. Please try again.
              </p>
            </div>
            <button
              className={`px-6 py-2.5 rounded-lg font-semibold ${activeTheme.button.outline} transition-colors duration-200`}
              onClick={refetchData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full py-10 px-4 md:px-8 lg:px-12 font-inter`}
    >
      <div className="max-w-screen-xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          {/* <h1
            className={`text-6xl font-extrabold ${activeTheme.text.primary} tracking-tight`}
          > */}
          <img src={RevuLogo} alt="Revu Logo" className="w-32 object-contain" />
          {/* </h1> */}
          <p className={`text-xl ${activeTheme.text.muted} max-w-2xl mx-auto`}>
            Study flashcards with intelligent spaced repetition to master any
            subject.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Streak Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`}
          >
            <div className="mb-3">
              <h3 className="text-base font-medium flex items-center gap-3 opacity-90">
                <FontAwesomeIcon icon={faFire} className="w-5 h-5" />
                Current Streak
              </h3>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">
                {streaks.current_streak || 0}
              </div>
              <p className={`text-sm opacity-80`}>days in a row</p>
            </div>
          </div>

          {/* Cards Due Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`}
          >
            <div className="mb-3">
              <h3 className="text-base font-medium flex items-center gap-3 opacity-90">
                <FontAwesomeIcon icon={faBullseye} className="w-5 h-5" />
                Cards Due
              </h3>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">
                {cards_due_today || 0}
              </div>
              <p className={`text-sm opacity-80`}>ready to review</p>
            </div>
          </div>

          {/* Mastered Cards Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`}
          >
            <div className="mb-3">
              <h3 className="text-base font-medium flex items-center gap-3 opacity-90">
                <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
                Mastered
              </h3>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">
                {mastered_cards || 0}
              </div>
              <p className={`text-sm opacity-80`}>cards learned</p>
            </div>
          </div>

          {/* Study Time Card */}
          <div
            className={`rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`}
          >
            <div className="mb-3">
              <h3 className="text-base font-medium flex items-center gap-3 opacity-90">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
                Study Time
              </h3>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">
                {today.study_time || 0}
              </div>
              <p className={`text-sm opacity-80`}>minutes today</p>
            </div>
          </div>
        </div>

        {/* Main Action */}
        <div className="text-center py-4">
          {(cards_due_today || 0) > 0 ? (
            <button
              onClick={() => navigate("/study")}
              className={`inline-flex items-center justify-center text-xl px-16 py-7 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300
                bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}
                ${activeTheme.gradients.buttonHoverFrom} ${activeTheme.gradients.buttonHoverTo}
                font-semibold tracking-wide`}
            >
              <FontAwesomeIcon icon={faBook} className="w-7 h-7 mr-3" />
              Start Studying ({cards_due_today} due)
            </button>
          ) : (
            <div className="space-y-4 p-8 rounded-xl border border-dashed ${activeTheme.border.dashed} ${activeTheme.card.bg} shadow-lg">
              <div
                className={`text-3xl font-semibold ${activeTheme.text.primary}`}
              >
                🎉 All caught up!
              </div>
              <p className={`${activeTheme.text.muted} text-lg`}>
                No cards are due for review right now. Keep up the great work!
              </p>
            </div>
          )}
        </div>

        {/* Decks Overview */}
        <div className="space-y-6">
          <h2
            className={`text-3xl font-bold flex items-center gap-3 ${activeTheme.text.primary}`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7" />
            Your Decks ({userDecks.length})
          </h2>

          {userDecks.length === 0 ? (
            <div
              className={`${activeTheme.card.bg} text-center py-16 rounded-xl shadow-xl border ${activeTheme.border.dashed}`}
            >
              <div className="p-6">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className={`w-20 h-20 mx-auto ${activeTheme.icon.default} mb-6`}
                />
                <h3
                  className={`text-2xl font-semibold mb-3 ${activeTheme.text.primary}`}
                >
                  No decks yet
                </h3>
                <p className={`${activeTheme.text.muted} mb-6 text-lg`}>
                  Create your first deck to start your learning journey.
                </p>
                <button
                  onClick={() => navigate("/decks")} // Navigate to /decks which is DeckListView
                  className={`px-8 py-3 rounded-full font-semibold text-lg
                    ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton}
                    shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  Create Your First Deck
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDecks.slice(0, 2).map((deck) => {
                return (
                  <MiniDeckCard
                    key={deck.id}
                    deck={deck}
                    activeTheme={activeTheme}
                  />
                );
              })}
              {/* Browse more */}
              <div
                className={`${activeTheme.card.bg} rounded-xl p-6 shadow-xl flex items-center justify-center`}
              >
                <div className="text-center space-y-2 flex flex-col items-center">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className={`w-12 h-12 ${activeTheme.icon.default} mx-auto`}
                  />
                  <button
                    onClick={() => navigate("/decks")}
                    className={`px-6 py-2 rounded-full font-semibold text-base
                  ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.text.activeButton}
                  shadow-md transition-all duration-200`}
                  >
                    Browse More Decks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <h2
          className={`text-3xl font-bold flex items-center gap-3 ${activeTheme.text.primary}`}
        >
          <FontAwesomeIcon icon={faBookOpen} className="w-7 h-7" />
          Your Stats
        </h2>
        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Accuracy Rate Card */}
          <div className={`${activeTheme.card.bg} rounded-xl p-6 shadow-xl`}>
            <div className="mb-3">
              <h3
                className={`text-xl font-bold flex items-center gap-3 ${activeTheme.text.primary}`}
              >
                <FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />
                Accuracy Rate
              </h3>
            </div>
            <div>
              <div
                className={`text-4xl font-bold ${activeTheme.card.statusMasteredText} mb-2`}
              >
                {Math.round(today.accuracy || 0)}%
              </div>
              <div
                className={`w-full h-2.5 ${activeTheme.progress.track} rounded-full overflow-hidden`}
              >
                <div
                  className={`${activeTheme.progress.fill} h-full`}
                  style={{ width: `${today.accuracy || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Best Streak Card */}
          <div className={`${activeTheme.card.bg} rounded-xl p-6 shadow-xl`}>
            <div className="mb-3">
              <h3
                className={`text-xl font-bold flex items-center gap-3 ${activeTheme.text.primary}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
                Best Streak
              </h3>
            </div>
            <div>
              <div
                className={`text-4xl font-bold ${activeTheme.card.statusLearningText} mb-2`}
              >
                {streaks.longest_streak || 0}
              </div>
              <p className={`text-base ${activeTheme.text.muted}`}>days</p>
            </div>
          </div>

          {/* Placeholder for another stat or call to action */}
          <div
            className={`${activeTheme.card.bg} rounded-xl p-6 shadow-xl flex items-center justify-center`}
          >
            <div className="text-center space-y-3">
              <FontAwesomeIcon
                icon={faBookOpen}
                className={`w-12 h-12 ${activeTheme.icon.default} mx-auto`}
              />
              <h3
                className={`text-xl font-semibold ${activeTheme.text.primary}`}
              >
                Explore More Decks
              </h3>
              <p className={`text-sm ${activeTheme.text.muted}`}>
                Discover new topics and expand your knowledge.
              </p>
              <button
                onClick={() => navigate("/decks")}
                className={`px-6 py-2 rounded-full font-semibold text-base
                  ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.text.activeButton}
                  shadow-md transition-all duration-200`}
              >
                Browse Decks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
