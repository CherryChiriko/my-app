// src/components/Decks/DeckListView.jsx
import { React, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";

import DeckCard from "./DeckCard";
import decks from "../../data/decks";
import { useNavigate } from "react-router-dom";

const DeckListView = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
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

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4 w-full md:max-w-lg">
            <div className="relative w-full">
              <FontAwesomeIcon
                icon={faSearch}
                className={`h-5 w-5 ${activeTheme.icon.default} absolute left-3 top-1/2 transform -translate-y-1/2`}
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
              className={`bg-gray-800 text-white rounded-lg py-3 px-4 pr-8 focus:outline-none focus:ring-2 ${activeTheme.ring.input}`}
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

          <div className="flex space-x-4 w-full md:w-auto justify-end">
            <button
              onClick={handleImportClick}
              className={`flex items-center ${activeTheme.button.secondaryBg} ${activeTheme.button.secondaryHover} ${activeTheme.card.tagText} font-semibold py-3 px-5 rounded-lg transition-colors duration-200`}
            >
              <FontAwesomeIcon icon={faUpload} className="h-5 w-5 mr-2" />
              Import
            </button>

            <button
              className={`flex items-center ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.card.tagText} font-semibold py-3 px-5 rounded-lg transition-colors duration-200`}
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
              Create Deck
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} activeTheme={activeTheme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckListView;
