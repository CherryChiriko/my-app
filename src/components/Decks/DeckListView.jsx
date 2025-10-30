// src/components/Decks/DeckListView.jsx (Dynamically Enhanced)
import { React, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUpload,
  faPlus,
  faSort,
  faThLarge, // Grid view icon (large cards)
  faList, // List view icon (smaller cards/dense list)
} from "@fortawesome/free-solid-svg-icons";

import DeckCard from "./DeckCard";
import DeckCompact from "./DeckCompact";
import decks from "../../data/decks";
import { useNavigate } from "react-router-dom";

const DeckListView = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [sortBy, setSortBy] = useState("lastStudied-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // --- Dynamic Configuration based on viewMode ---
  const DECKS_PER_PAGE = useMemo(() => {
    // Large Card View (Grid) shows 3 decks per page (as per original setting)
    if (viewMode === "grid") return 3;
    // Compact View (List) shows 6 decks per page (as requested)
    if (viewMode === "list") return 6;
    return 3; // Default
  }, [viewMode]);
  // --- END Dynamic Configuration ---

  // Derived Data
  const uniqueLanguages = useMemo(
    () => ["All Languages", ...new Set(decks.map((deck) => deck.language))],
    [decks]
  );

  // --- 1. Filtering & Sorting Logic ---
  const filteredDecks = useMemo(() => {
    let result = decks.filter((deck) => {
      const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();

      const matchesSearchTerm =
        deck.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        deck.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        deck.tags.some((tag) =>
          tag.toLowerCase().includes(lowerCaseSearchTerm)
        );

      const matchesLanguage =
        selectedLanguage === "All Languages" ||
        deck.language.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearchTerm && matchesLanguage;
    });

    // --- Sorting ---
    result.sort((a, b) => {
      const [field, direction] = sortBy.split("-");
      const aValue = a[field] || "";
      const bValue = b[field] || "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // NOTE: We no longer reset currentPage here. We do it in the viewMode change handler.
    return result;
  }, [decks, searchTerm, selectedLanguage, sortBy]);

  // --- 3. Pagination Logic ---
  // The DECKS_PER_PAGE variable is now dynamic based on useMemo above
  const totalPages = Math.ceil(filteredDecks.length / DECKS_PER_PAGE);
  const indexOfLastDeck = currentPage * DECKS_PER_PAGE;
  const indexOfFirstDeck = indexOfLastDeck - DECKS_PER_PAGE;

  const currentDecks = filteredDecks.slice(indexOfFirstDeck, indexOfLastDeck);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handler for view mode change: Resets page to 1
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    // Resetting to page 1 is crucial when changing view mode
    // because DECKS_PER_PAGE changes, potentially leaving the user on a non-existent page.
    setCurrentPage(1);
  };

  // Handlers
  const handleImportClick = () => {
    navigate("import");
  };

  const PaginationControls = () => {
    // Only show controls if there's more than one page
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${activeTheme.button.secondary} ${activeTheme.text.secondary} font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50`}
        >
          Previous
        </button>

        {/* Simple Page Indicator */}
        <span className={`${activeTheme.text.secondary} px-3`}>
          Page {currentPage}/{totalPages}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${activeTheme.button.secondary} ${activeTheme.text.secondary} font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50`}
        >
          Next
        </button>
      </div>
    );
  };

  // View mode class names
  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "flex flex-col space-y-3";

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          {/* Search, Filter, and Sort Section (Same) */}
          <div className="flex items-center space-x-4 w-full md:max-w-3xl">
            {/* Search Input */}
            <div className="relative w-full">
              <FontAwesomeIcon
                icon={faSearch}
                className={`h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${activeTheme.text.secondary}`}
              />
              <input
                type="text"
                placeholder="Search deck..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${activeTheme.background.canvas} ${activeTheme.text.secondary} rounded-lg py-3 px-5 pl-12 focus:outline-none focus:ring-2 ${activeTheme.ring.focus}`}
              />
            </div>

            {/* Language Select */}
            <select
              className={`${activeTheme.background.canvas} ${activeTheme.text.secondary} rounded-lg py-3 px-4 pr-8 focus:outline-none focus:ring-2 ${activeTheme.ring.focus} w-40`}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Sort By Select */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faSort}
                className={`h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 ${activeTheme.text.secondary} pointer-events-none`}
              />
              <select
                className={`${activeTheme.background.canvas} ${activeTheme.text.secondary} rounded-lg py-3 px-4 pr-8 focus:outline-none focus:ring-2 ${activeTheme.ring.focus} w-40 appearance-none`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="lastStudied-desc">Last Studied</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="cardCount-desc">Cards (High to Low)</option>
                <option value="cardCount-asc">Cards (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons & View Toggle Section */}
          <div className="flex space-x-4 w-full md:w-auto justify-end">
            {/* View Mode Toggle (Uses new handler) */}
            <div
              className={`flex rounded-lg p-1 ${activeTheme.background.canvas}`}
            >
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "grid"
                    ? activeTheme.button.secondary
                    : activeTheme.background.canvas
                } ${activeTheme.text.secondary}`}
                title="Large Card View"
              >
                <FontAwesomeIcon icon={faThLarge} className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "list"
                    ? activeTheme.button.secondary
                    : activeTheme.background.canvas
                } ${activeTheme.text.secondary}`}
                title="Compact List View"
              >
                <FontAwesomeIcon icon={faList} className="h-5 w-5" />
              </button>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImportClick}
              className={`flex items-center ${activeTheme.button.secondary} ${activeTheme.text.secondary} font-semibold py-2 px-3 rounded-lg transition-colors duration-200`}
            >
              <FontAwesomeIcon icon={faUpload} className="h-5 w-5 mr-2" />
              Import
            </button>

            {/* Create Deck Button (Primary Action) */}
            <button
              className={`flex items-center ${activeTheme.button.primary} ${activeTheme.text.primary} font-semibold py-2 px-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
              Create Deck
            </button>
          </div>
        </div>

        {/* --- Deck Card/List Grid --- */}
        {currentDecks.length > 0 ? (
          <div className={gridClasses}>
            {currentDecks.map((deck) =>
              viewMode === "grid" ? (
                <DeckCard key={deck.id} deck={deck} activeTheme={activeTheme} />
              ) : (
                // NOTE: Using the renamed component
                <DeckCompact
                  key={deck.id}
                  deck={deck}
                  activeTheme={activeTheme}
                />
              )
            )}
          </div>
        ) : (
          /* --- No Results Message --- */
          <div
            className={`p-10 text-center rounded-lg border-2 border-dashed ${activeTheme.border.secondary} ${activeTheme.background.canvas} mt-10`}
          >
            <p
              className={`text-2xl font-bold mb-3 ${activeTheme.text.primary}`}
            >
              😥 No Decks Found.
            </p>
            <p className={`${activeTheme.text.secondary}`}>
              Your current filters or search term **"{searchTerm}"** didn't
              match any decks.
            </p>
            <div className="mt-5">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLanguage("All Languages");
                }}
                className={`font-semibold ${activeTheme.text.accent} hover:${activeTheme.text.primary} transition-colors duration-200`}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* --- Pagination Controls --- */}
        <PaginationControls />
      </div>
    </div>
  );
};

export default DeckListView;
