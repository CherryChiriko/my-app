// src/components/DeckManager.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"; // Added icons
import decks from "../data/decks"; // Importing decks data

const DeckCard = ({ deck, activeTheme }) => {
  // Pass activeTheme to DeckCard
  const {
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

  // Calculate percentages for the progress bar
  const totalCards = mastered + learning + due;
  const masteredPercentage = (mastered / totalCards) * 100;
  const learningPercentage = (learning / totalCards) * 100;
  const duePercentage = (due / totalCards) * 100;

  return (
    <div
      className={`${activeTheme.cardBg} rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1`}
    >
      <h3 className={`text-2xl font-bold ${activeTheme.cardTextColor} mb-2`}>
        {name}
      </h3>
      <p className={`${activeTheme.cardDescriptionColor} text-sm mb-4`}>
        {description}
      </p>

      <div className="flex space-x-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`${activeTheme.tagBg} ${activeTheme.tagTextColor} text-xs px-3 py-1 rounded-full`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar with distinct sections */}
      <div
        className={`w-full ${activeTheme.progressBarBg} rounded-full h-2.5 mb-4 overflow-hidden`}
      >
        <div
          className={`${activeTheme.masteredColor} h-2.5 float-left`}
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className={`${activeTheme.learningColor} h-2.5 float-left`}
          style={{ width: `${learningPercentage}%` }}
          title={`Learning: ${learning}`}
        ></div>
        <div
          className={`${activeTheme.dueColor} h-2.5 float-left`}
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
      </div>

      <div
        className={`flex justify-between items-center ${activeTheme.cardFooterTextColor} text-sm mb-4`}
      >
        <div className="flex items-center space-x-2">
          <span className={`${activeTheme.statusMasteredText} font-semibold`}>
            {mastered} Mastered
          </span>
          <span className={`${activeTheme.statusLearningText} font-semibold`}>
            {learning} Learning
          </span>
          <span className={`${activeTheme.statusDueText} font-semibold`}>
            {due} Due
          </span>
        </div>
      </div>

      <div
        className={`flex justify-between items-center ${activeTheme.cardFooterTextColor} text-sm`}
      >
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      <button
        className={`mt-6 w-full ${activeTheme.studyButtonBg} ${activeTheme.studyButtonHover} ${activeTheme.tagTextColor} font-semibold py-2 rounded-lg transition-colors duration-200`}
      >
        Study Now
      </button>
    </div>
  );
};

const DeckManager = () => {
  const activeTheme = useSelector(selectActiveTheme); // Access the active theme

  return (
    <div
      className={`min-h-screen ${activeTheme.bgColor} ${activeTheme.textColor} w-full px-4 md:px-8`}
    >
      {" "}
      {/* Apply theme colors and full width with padding */}
      <header className="flex justify-between items-center py-6 mb-8">
        <h1 className={`text-4xl font-extrabold ${activeTheme.textColor} mb-3`}>
          Deck Manager
        </h1>
        <p className={`${activeTheme.cardDescriptionColor} text-lg mb-8`}>
          Create, edit, and manage your flashcard decks
        </p>
      </header>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        {" "}
        {/* Added responsiveness */}
        <div className="flex items-center space-x-4 w-full md:max-w-lg">
          <div className="relative w-full">
            <FontAwesomeIcon
              icon={faSearch}
              className={`h-5 w-5 ${activeTheme.iconColor} absolute left-3 top-1/2 transform -translate-y-1/2`}
            />
            <input
              type="text"
              placeholder="Search decks..."
              className={`w-full ${activeTheme.inputBg} ${activeTheme.inputTextColor} rounded-lg py-3 px-5 pl-10 focus:outline-none focus:ring-2 ${activeTheme.inputFocusRing} ${activeTheme.inputPlaceholderColor}`}
            />
            <div className="relative w-full"></div>
          </div>

          <button
            className={`${activeTheme.inputBg} ${activeTheme.iconColor} hover:${activeTheme.textColor} p-3 rounded-lg focus:outline-none focus:ring-2 ${activeTheme.inputFocusRing}`}
          >
            <FontAwesomeIcon icon={faFilter} className="h-6 w-6" />
          </button>
          <select
            className={`${activeTheme.inputBg} ${activeTheme.inputTextColor} rounded-lg py-3 px-4 focus:outline-none focus:ring-2 ${activeTheme.inputFocusRing}`}
          >
            <option>All Languages</option>
            <option>Japanese</option>
            <option>English</option>
          </select>
        </div>
        <div className="flex space-x-4 w-full md:w-auto justify-end">
          {" "}
          {/* Added w-full and justify-end for mobile alignment */}
          <button
            className={`flex items-center ${activeTheme.buttonSecondaryBg} ${activeTheme.buttonSecondaryHover} ${activeTheme.tagTextColor} font-semibold py-3 px-5 rounded-lg transition-colors duration-200`}
          >
            <FontAwesomeIcon icon={faUpload} className="h-5 w-5 mr-2" />
            Import
          </button>
          <button
            className={`flex items-center ${activeTheme.buttonPrimaryBg} ${activeTheme.buttonPrimaryHover} ${activeTheme.tagTextColor} font-semibold py-3 px-5 rounded-lg transition-colors duration-200`}
          >
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
            Create Deck
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {" "}
        {/* Added pb-8 for bottom padding */}
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} activeTheme={activeTheme} /> // Pass activeTheme to DeckCard
        ))}
      </div>
    </div>
  );
};

export default DeckManager;
