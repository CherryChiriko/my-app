import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Font Awesome is causing resolution errors. Replacing with Lucide icons.
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch, faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Search, UploadCloud, Plus } from "lucide-react";

// ======================================================================
// TEMPORARY MOCKS FOR COMPILATION STABILITY (Replacing Redux and Data Imports)
// ======================================================================

// Mock Redux State and Selectors
const mockTheme = {
  isDark: true,
  background: { app: "bg-gray-900", secondary: "bg-gray-800" },
  text: {
    primary: "text-white",
    secondary: "text-gray-400",
    activeButton: "text-white",
  },
  icon: { default: "text-gray-400" },
  input: {
    bg: "bg-gray-700",
    text: "text-white",
    placeholder: "placeholder-gray-500",
  },
  ring: { input: "ring-indigo-500" },
  button: {
    primary: "bg-indigo-600 hover:bg-indigo-700",
    secondaryBg: "bg-gray-700",
    secondaryHover: "hover:bg-gray-600",
  },
  accent: "text-indigo-400",
  border: { card: "border-gray-700" },
};
const useSelector = () => mockTheme; // Mock useSelector to return the theme directly
const selectActiveTheme = () => mockTheme; // Mock theme selector
const useDispatch = () => (action) =>
  console.log("Mock Dispatch (Redux not available):", action);
const selectDeck = (deck) => ({ type: "MOCK_SELECT_DECK", payload: deck });

// Mock Data Source
const decks = [
  {
    id: "d1",
    name: "Japanese N5 Vocab",
    description: "Essential vocabulary for JLPT N5.",
    mastered: 150,
    learning: 50,
    due: 15,
    tags: ["Japanese", "JLPT", "Vocab"],
    cardsCount: 215,
    language: "Japanese",
    lastStudied: "2 days ago",
  },
  {
    id: "d2",
    name: "React Hooks Deep Dive",
    description: "Understanding useState, useEffect, and custom hooks.",
    mastered: 30,
    learning: 10,
    due: 5,
    tags: ["Code", "React", "Frontend"],
    cardsCount: 45,
    language: "English",
    lastStudied: "Today",
  },
  {
    id: "d3",
    name: "History of Rome",
    description: "From Republic to Empire.",
    mastered: 50,
    learning: 20,
    due: 30,
    tags: ["History", "Ancient", "Latin"],
    cardsCount: 100,
    language: "Latin",
    lastStudied: "1 week ago",
  },
];

// Define consistent status colors (Mastered/Learning/Due)
const STATUS_COLORS = {
  mastered: { bar: "bg-green-500", text: "text-green-400" },
  learning: { bar: "bg-yellow-500", text: "text-yellow-400" },
  due: { bar: "bg-red-500", text: "text-red-400" },
};
// ======================================================================

// DeckCard Component (Migrated from DeckManager.jsx for self-containment)
const DeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const progressBarBg = activeTheme.isDark ? "bg-gray-700" : "bg-gray-200";

  const {
    id,
    name,
    description,
    mastered,
    learning,
    due,
    tags,
    cardsCount,
    language,
    lastStudied,
  } = deck;

  const totalCards = mastered + learning + due;
  const masteredPercentage = totalCards > 0 ? (mastered / totalCards) * 100 : 0;
  const learningPercentage = totalCards > 0 ? (learning / totalCards) * 100 : 0;
  const duePercentage = totalCards > 0 ? (due / totalCards) * 100 : 0;

  const handleCardClick = () => {
    navigate(`${id}`);
  };

  const handleStudyNow = (e) => {
    e.stopPropagation();
    dispatch(selectDeck(deck));
    navigate("/study");
  };

  return (
    <div
      className={`${activeTheme.background.secondary} rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer border ${activeTheme.border.card}`}
      onClick={handleCardClick}
    >
      <h3 className={`text-2xl font-bold ${activeTheme.text.primary} mb-2`}>
        {name}
      </h3>
      <p className={`${activeTheme.text.secondary} text-sm mb-4`}>
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${activeTheme.background.app} ${activeTheme.accent} text-xs px-3 py-1 rounded-full font-medium`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div
        className={`w-full ${progressBarBg} rounded-full h-2.5 mb-4 overflow-hidden`}
      >
        <div
          className={`${STATUS_COLORS.mastered.bar} h-2.5 float-left`}
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className={`${STATUS_COLORS.learning.bar} h-2.5 float-left`}
          style={{ width: `${learningPercentage}%` }}
          title={`Learning: ${learning}`}
        ></div>
        <div
          className={`${STATUS_COLORS.due.bar} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
      </div>

      {/* Status Indicators */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm mb-4`}
      >
        <div className="flex items-center space-x-4">
          <span className={`${STATUS_COLORS.mastered.text} font-semibold`}>
            {mastered} Mastered
          </span>
          <span className={`${STATUS_COLORS.learning.text} font-semibold`}>
            {learning} Learning
          </span>
          <span className={`${STATUS_COLORS.due.text} font-semibold`}>
            {due} Due
          </span>
        </div>
      </div>

      {/* Footer Details */}
      <div
        className={`flex justify-between items-center ${activeTheme.text.secondary} text-sm`}
      >
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      {/* Study Now Button */}
      <button
        onClick={handleStudyNow}
        className={`mt-6 w-full ${activeTheme.button.primary} ${activeTheme.text.activeButton} font-semibold py-2 rounded-lg transition-colors duration-200 shadow-md`}
      >
        Study Now
      </button>
    </div>
  );
};

const DeckListView = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");

  // Dynamically derive unique languages from the mock data
  const uniqueLanguages = [
    "All Languages",
    ...new Set(decks.map((deck) => deck.language)),
  ];

  // Filter decks based on search term and selected language
  const filteredDecks = decks.filter((deck) => {
    const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();

    const matchesSearchTerm =
      deck.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      deck.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      deck.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm));

    const matchesLanguage =
      selectedLanguage === "All Languages" ||
      deck.language.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearchTerm && matchesLanguage;
  });

  const handleImportClick = () => {
    navigate("import"); // Navigate to the nested import route
  };

  // Define button text color based on the theme (using activeTheme.text.activeButton for consistency)
  const buttonTextColor = activeTheme.text.activeButton;

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4 w-full md:max-w-lg">
            <div className="relative w-full">
              <Search
                size={20} // Equivalent to h-5 w-5
                className={`${activeTheme.icon.default} absolute left-3 top-1/2 transform -translate-y-1/2`}
              />
              <input
                type="text"
                placeholder="Search decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${activeTheme.input.bg} ${activeTheme.input.text} rounded-lg py-3 px-5 pl-12 focus:outline-none focus:ring-2 ${activeTheme.ring.input} ${activeTheme.input.placeholder}`}
              />
            </div>
            <select
              className={`py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 ${activeTheme.ring.input} ${activeTheme.background.secondary} ${activeTheme.text.primary} appearance-none cursor-pointer`}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 w-full md:w-auto justify-end">
            <button
              onClick={handleImportClick}
              className={`flex items-center ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.text.secondary} font-semibold py-3 px-5 rounded-lg transition-colors duration-200 shadow-md`}
            >
              {/* Replaced FontAwesomeIcon with Lucide UploadCloud icon */}
              <UploadCloud size={20} className="mr-2" />
              Import
            </button>

            <button
              className={`flex items-center ${activeTheme.button.primary} ${buttonTextColor} font-semibold py-3 px-5 rounded-lg transition-colors duration-200 shadow-md`}
            >
              {/* Replaced FontAwesomeIcon with Lucide Plus icon */}
              <Plus size={20} className="mr-2" />
              Create Deck
            </button>
          </div>
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} activeTheme={activeTheme} />
          ))}
        </div>

        {/* Handle no results */}
        {filteredDecks.length === 0 && (
          <div className={`text-center py-12 ${activeTheme.text.secondary}`}>
            <h2 className="text-xl font-semibold mb-2">No decks found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckListView;
