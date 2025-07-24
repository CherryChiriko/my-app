// src/components/DeckManager.jsx
import React from "react";

const DeckCard = ({ deck }) => {
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
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <div className="flex space-x-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar with distinct sections */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
        <div
          className="bg-green-500 h-2.5 float-left"
          style={{ width: `${masteredPercentage}%` }}
          title={`Mastered: ${mastered}`}
        ></div>
        <div
          className="bg-orange-500 h-2.5 float-left"
          style={{ width: `${learningPercentage}%` }}
          title={`Learning: ${learning}`}
        ></div>
        <div
          className="bg-red-500 h-2.5 float-left"
          style={{ width: `${duePercentage}%` }}
          title={`Due: ${due}`}
        ></div>
      </div>

      <div className="flex justify-between items-center text-gray-300 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-semibold">
            {mastered} Mastered
          </span>
          <span className="text-orange-400 font-semibold">
            {learning} Learning
          </span>
          <span className="text-red-400 font-semibold">{due} Due</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span>
          {cardsCount} cards • {language}
        </span>
        <span>Last studied: {lastStudied}</span>
      </div>

      <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200">
        Study Now
      </button>
    </div>
  );
};

const DeckManager = () => {
  const decks = [
    {
      id: 1,
      name: "Japanese Hiragana Basics",
      description: "Learn basic hiragana characters",
      mastered: 20,
      learning: 14,
      due: 12,
      tags: ["hiragana", "beginner"],
      cardsCount: 46,
      language: "japanese",
      lastStudied: "20/01/2025",
    },
    // Add more deck data here
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center">
          {/* FlashMaster Logo/Name */}
          <span className="text-3xl font-extrabold text-purple-500">
            FlashMaster
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* User Settings/Theme Toggle */}
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            {/* Replace with a gear icon or user avatar */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37zM12 15a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            {/* Sun/Moon icon for theme toggle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 6.675l-.707.707M6.675 6.675l-.707-.707m10.65 0l.707-.707M6.675 17.325l-.707.707M12 15a3 3 0 110-6 3 3 0 010 6z"
              />
            </svg>
          </button>
        </div>
      </header>

      <h1 className="text-4xl font-extrabold text-white mb-3">Deck Manager</h1>
      <p className="text-gray-400 text-lg mb-8">
        Create, edit, and manage your flashcard decks
      </p>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4 w-full max-w-lg">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search decks..."
              className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="bg-gray-800 text-gray-400 hover:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            {/* Filter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-6.414a1 1 0 01.293-.707L3 4z"
              />
            </svg>
          </button>
          <select className="bg-gray-800 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Languages</option>
            <option>Japanese</option>
            <option>English</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import
          </button>
          <button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Deck
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
};

export default DeckManager;
