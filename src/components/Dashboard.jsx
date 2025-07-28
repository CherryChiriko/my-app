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
  // faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import decks from "../data/decks";

const Dashboard = ({ onStartStudy, onViewDeck }) => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();

  // Mock data for hooks - in a real app, these would come from actual data fetching
  const [dashboardData, setDashboardData] = useState(null);
  // const [decks, setDecks] = useState(null);
  // const [dashboardLoading, setDashboardLoading] = useState(true);
  // const [decksLoading, setDecksLoading] = useState(true);
  // const [dashboardError, setDashboardError] = useState(null);
  // const [decksError, setDecksError] = useState(null);

  // // Simulate data fetching
  // useEffect(() => {
  //   const fetchMockData = async () => {
  //     try {
  //       // Simulate network delay
  //       await new Promise((resolve) => setTimeout(resolve, 1000));

  //       // Mock dashboard stats
  //       const mockDashboardStats = {
  //         overview: {
  //           cards_due_today: 15,
  //           mastered_cards: 120,
  //         },
  //         today: {
  //           study_time: 45,
  //           accuracy: 88,
  //           xp_earned: 1250,
  //         },
  //         streaks: {
  //           current_streak: 7,
  //           longest_streak: 21,
  //         },
  //       };

  //       // Mock decks data
  //       const mockDecks = [
  //         {
  //           id: "japanese-hiragana-basics",
  //           name: "Japanese Hiragana Basics",
  //           description: "Learn basic hiragana characters",
  //           cardsCount: 46,
  //           mastered: 20,
  //           learning: 14,
  //           due: 12,
  //           color: "#4ECDC4", // Example color
  //           tags: ["hiragana", "beginner"],
  //         },
  //         {
  //           id: "french-verbs",
  //           name: "French Verbs",
  //           description: "Conjugate common French verbs",
  //           cardsCount: 28,
  //           mastered: 15,
  //           learning: 8,
  //           due: 5,
  //           color: "#C70039",
  //           tags: ["french", "intermediate"],
  //         },
  //         {
  //           id: "us-history-civil-war",
  //           name: "US History: Civil War",
  //           description: "Key figures and events of the Civil War",
  //           cardsCount: 48,
  //           mastered: 30,
  //           learning: 10,
  //           due: 8,
  //           color: "#FFC300",
  //           tags: ["history", "advanced"],
  //         },
  //       ];

  //       setDashboardData(mockDashboardStats);
  //       setDecks(mockDecks);
  //       setDashboardLoading(false);
  //       setDecksLoading(false);
  //     } catch (err) {
  //       setDashboardError("Failed to fetch dashboard data.");
  //       setDecksError("Failed to fetch decks data.");
  //       setDashboardLoading(false);
  //       setDecksLoading(false);
  //     }
  //   };

  //   fetchMockData();
  // }, []);

  // const refetchDashboard = () => {
  //   setDashboardLoading(true);
  //   setDashboardError(null);
  //   // In a real app, re-call your data fetching logic
  //   // For mock, just re-run the effect or a specific function
  //   console.log("Refetching dashboard data...");
  //   // Simulate re-fetching
  //   setTimeout(() => {
  //     setDashboardData({
  //       overview: { cards_due_today: 10, mastered_cards: 130 },
  //       today: { study_time: 30, accuracy: 90, xp_earned: 1500 },
  //       streaks: { current_streak: 8, longest_streak: 22 },
  //     });
  //     setDashboardLoading(false);
  //   }, 500);
  // };

  // const refetchDecks = () => {
  //   setDecksLoading(true);
  //   setDecksError(null);
  //   // Simulate re-fetching
  //   setTimeout(() => {
  //     setDecks([
  //       {
  //         id: "japanese-hiragana-basics",
  //         name: "Japanese Hiragana Basics",
  //         description: "Learn basic hiragana characters",
  //         cardsCount: 46,
  //         mastered: 25,
  //         learning: 10,
  //         due: 11,
  //         color: "#4ECDC4",
  //         tags: ["hiragana", "beginner"],
  //       },
  //       {
  //         id: "french-verbs",
  //         name: "French Verbs",
  //         description: "Conjugate common French verbs",
  //         cardsCount: 28,
  //         mastered: 18,
  //         learning: 5,
  //         due: 5,
  //         color: "#C70039",
  //         tags: ["french", "intermediate"],
  //       },
  //     ]);
  //     setDecksLoading(false);
  //   }, 500);
  // };

  const calculateProgress = (mastered, total) =>
    total > 0 ? (mastered / total) * 100 : 0;

  // // Loading states
  // if (dashboardLoading || decksLoading) {
  //   return (
  //     <div
  //       className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} p-6`}
  //     >
  //       <div className="max-w-7xl mx-auto space-y-8">
  //         <div className="text-center space-y-4">
  //           <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
  //             Revu
  //           </h1>
  //           <p className={`text-lg ${activeTheme.text.muted}`}>
  //             Loading your learning dashboard...
  //           </p>
  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //           {[1, 2, 3, 4].map((i) => (
  //             <div
  //               key={i}
  //               className={`${activeTheme.card.bg} h-32 rounded-xl animate-pulse`}
  //             ></div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Error states
  // if (dashboardError || decksError) {
  //   return (
  //     <div
  //       className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} p-6`}
  //     >
  //       <div className="max-w-7xl mx-auto space-y-8">
  //         <div className="text-center space-y-4">
  //           <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
  //             Revu
  //           </h1>
  //         </div>

  //         <div
  //           className={`${activeTheme.alert.warningBg} ${activeTheme.alert.warningText} p-4 rounded-lg flex items-center space-x-3`}
  //         >
  //           <FontAwesomeIcon
  //             icon={faExclamationCircle}
  //             className="h-4 w-4 flex-shrink-0"
  //           />
  //           <div className="flex-grow flex items-center justify-between">
  //             <span>
  //               Failed to load dashboard data: {dashboardError || decksError}
  //             </span>
  //             <button
  //               className={`px-3 py-1.5 rounded-md text-sm font-semibold ${activeTheme.button.outline} transition-colors duration-200`}
  //               onClick={() => {
  //                 refetchDashboard();
  //                 refetchDecks();
  //               }}
  //             >
  //               Retry
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // const overview = dashboardData?.overview || {};
  const cards_due_today = decks.reduce(
    (total, deck) => total + (deck.due || 0),
    0
  );
  const mastered_cards = decks.reduce(
    (total, deck) => total + (deck.mastered || 0),
    0
  );
  console.log("Cards due today:", cards_due_today);
  console.log("Mastered cards:", mastered_cards);

  const today = dashboardData?.today || {};
  const streaks = dashboardData?.streaks || {};
  const userDecks = Array.isArray(decks) ? decks : [];

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full py-8 px-4 md:px-8`}
    >
      <div className="max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`text-5xl font-bold ${activeTheme.text.primary}`}>
            Revu
          </h1>
          <p className={`text-lg ${activeTheme.text.muted}`}>
            Study flashcards with intelligent spaced repetition
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Streak Card */}
          <div
            className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
          >
            <div className="pb-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faFire} className="w-4 h-4" />
                Current Streak
              </h3>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {streaks.current_streak || 0}
              </div>
              <p className={`text-sm ${activeTheme.text.activeButton}`}>
                days in a row
              </p>
            </div>
          </div>

          {/* Cards Due Card */}
          <div
            className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
          >
            <div className="pb-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faBullseye} className="w-4 h-4" />
                Cards Due
              </h3>
            </div>
            <div>
              <div className="text-3xl font-bold">{cards_due_today || 0}</div>
              <p className={`text-sm ${activeTheme.text.activeButton}`}>
                ready to review
              </p>
            </div>
          </div>

          {/* Mastered Cards Card */}
          <div
            className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
          >
            <div className="pb-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="w-4 h-4" />
                Mastered
              </h3>
            </div>
            <div>
              <div className="text-3xl font-bold">{mastered_cards || 0}</div>
              <p className={`text-sm ${activeTheme.text.activeButton}`}>
                cards learned
              </p>
            </div>
          </div>

          {/* Study Time Card */}
          <div
            className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
            bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
          >
            <div className="pb-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                Study Time
              </h3>
            </div>
            <div>
              <div className="text-3xl font-bold">{today.study_time || 0}</div>
              <p className={`text-sm ${activeTheme.text.activeButton}`}>
                minutes today
              </p>
            </div>
          </div>
        </div>

        {/* Main Action */}
        <div className="text-center">
          {(cards_due_today || 0) > 0 ? (
            <button
              onClick={() => navigate("/study")}
              className={`inline-flex items-center justify-center text-lg px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}
                ${activeTheme.gradients.buttonHoverFrom} ${activeTheme.gradients.buttonHoverTo}`}
            >
              <FontAwesomeIcon icon={faBook} className="w-6 h-6 mr-2" />
              Start Studying ({cards_due_today} due)
            </button>
          ) : (
            <div className="space-y-4">
              <div
                className={`text-2xl font-semibold ${activeTheme.text.primary}`}
              >
                🎉 All caught up!
              </div>
              <p className={`${activeTheme.text.muted}`}>
                No cards are due for review right now.
              </p>
            </div>
          )}
        </div>

        {/* Decks Overview */}
        <div className="space-y-6">
          <h2
            className={`text-2xl font-bold flex items-center gap-2 ${activeTheme.text.primary}`}
          >
            <FontAwesomeIcon icon={faBookOpen} className="w-6 h-6" />
            Your Decks ({userDecks.length})
          </h2>

          {userDecks.length === 0 ? (
            <div
              className={`${activeTheme.card.bg} text-center py-12 rounded-lg shadow-xl`}
            >
              <div className="p-6">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className={`w-16 h-16 mx-auto ${activeTheme.text.muted} mb-4`}
                />
                <h3
                  className={`text-lg font-semibold mb-2 ${activeTheme.text.primary}`}
                >
                  No decks yet
                </h3>
                <p className={`${activeTheme.text.muted} mb-4`}>
                  Create your first deck to start learning
                </p>
                <button
                  onClick={() => navigate("/decks")} // Navigate to /decks which is DeckListView
                  className={`px-4 py-2 rounded-lg font-semibold ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton}`}
                >
                  Create Your First Deck
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDecks.map((deck) => {
                const progress = calculateProgress(
                  deck.mastered || 0,
                  deck.cardsCount || 0
                );

                return (
                  <div
                    key={deck.id}
                    className={`cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-lg border-l-4 ${activeTheme.card.bg} rounded-lg shadow-md`}
                    style={{ borderLeftColor: deck.color || "#4ECDC4" }}
                    onClick={() => navigate(`/decks/${deck.id}`)} // Navigate to specific deck view
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-1">
                          <h3
                            className={`text-lg font-semibold ${activeTheme.text.primary}`}
                          >
                            {deck.name}
                          </h3>
                        </div>
                        {(deck.due || 0) > 0 && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white ml-2`}
                          >
                            {deck.due} due
                          </span>
                        )}
                      </div>

                      <div className="space-y-4 mb-4">
                        <div
                          className={`flex justify-between text-sm ${activeTheme.text.muted}`}
                        >
                          <span>{Math.round(progress)}% mastered</span>
                        </div>

                        <div
                          className={`w-full h-2 ${activeTheme.progress.track} rounded-full overflow-hidden`}
                        >
                          <div
                            className={`${activeTheme.progress.fill} h-full`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="space-y-1">
                            <div className="text-green-500 font-semibold">
                              {deck.mastered || 0}
                            </div>
                            <div
                              className={`text-xs ${activeTheme.text.muted}`}
                            >
                              Mastered
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-orange-500 font-semibold">
                              {deck.learning || 0}
                            </div>
                            <div
                              className={`text-xs ${activeTheme.text.muted}`}
                            >
                              Learning
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-blue-500 font-semibold">
                              {deck.due || 0}
                            </div>
                            <div
                              className={`text-xs ${activeTheme.text.muted}`}
                            >
                              Due
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Accuracy Rate Card */}
          <div className={`${activeTheme.card.bg} rounded-lg p-6 shadow-xl`}>
            <div className="mb-2">
              <h3
                className={`text-lg font-bold flex items-center gap-2 ${activeTheme.text.primary}`}
              >
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                Accuracy Rate
              </h3>
            </div>
            <div>
              <div
                className={`text-3xl font-bold ${activeTheme.card.statusMasteredText}`}
              >
                {Math.round(today.accuracy || 0)}%
              </div>
              <div
                className={`w-full h-2 ${activeTheme.progress.track} rounded-full mt-2 overflow-hidden`}
              >
                <div
                  className={`${activeTheme.progress.fill} h-full`}
                  style={{ width: `${today.accuracy || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Best Streak Card */}
          <div className={`${activeTheme.card.bg} rounded-lg p-6 shadow-xl`}>
            <div className="mb-2">
              <h3
                className={`text-lg font-bold flex items-center gap-2 ${activeTheme.text.primary}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
                Best Streak
              </h3>
            </div>
            <div>
              <div
                className={`text-3xl font-bold ${activeTheme.card.statusLearningText}`}
              >
                {streaks.longest_streak || 0}
              </div>
              <p className={`text-sm ${activeTheme.text.muted} mt-1`}>days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
