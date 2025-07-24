// src/components/AnswerReveal.jsx
import React from 'react';

const AnswerReveal = ({ character, reading, romanization, meaning, onRate }) => {

  const handlePlayReading = () => {
    alert(`Playing reading for ${reading}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exit Study
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Japanese Hiragana Basics</h2>
          <p className="text-gray-400 text-sm">1 of 2</p> {/* Example values */}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Reviewed: <span className="text-white font-semibold">1</span></p>
          <p className="text-sm text-gray-400">Accuracy: <span className="text-green-400 font-semibold">100%</span></p>
        </div>
      </header>

      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-10">
        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `50%` }}></div> {/* Example progress */}
      </div>

      <div className="bg-gray-800 rounded-lg p-8 mb-8">
        <div className="text-center mb-6">
          <span className="text-8xl font-bold text-white">{character}</span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-md">
            <p className="text-gray-400 text-sm">Reading:</p>
            <p className="text-3xl font-bold text-white">{reading}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <p className="text-gray-400 text-sm">Romanization:</p>
            <p className="text-2xl font-bold text-white">{romanization}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Meaning:</p>
              <p className="text-2xl font-bold text-white">{meaning}</p>
            </div>
            <button
              onClick={handlePlayReading}
              className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-40 transition-colors duration-200"
              aria-label="Play reading audio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9l-.707.707m-2.829 2.828l-.707.707m-2.828-2.828l-.707-.707M7.071 17.657l-.707.707M12 4v16m0-12h.01M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onRate('again')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-200"
        >
          <span className="text-3xl">😢</span>
          <span className="text-lg mt-2">Again</span>
          <span className="text-xs text-gray-200">(<1m)</span>
        </button>
        <button
          onClick={() => onRate('hard')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-200"
        >
          <span className="text-3xl">🤔</span>
          <span className="text-lg mt-2">Hard</span>
          <span className="text-xs text-gray-200">(1d)</span>
        </button>
        <button
          onClick={() => onRate('good')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-200"
        >
          <span className="text-3xl">👍</span>
          <span className="text-lg mt-2">Good</span>
          <span className="text-xs text-gray-200">(3d)</span>
        </button>
        <button
          onClick={() => onRate('easy')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg flex flex-col items-center justify-center transition-colors duration-200"
        >
          <span className="text-3xl">🤩</span>
          <span className="text-lg mt-2">Easy</span>
          <span className="text-xs text-gray-200">(7d)</span>
        </button>
      </div>
    </div>
  );
};

export default AnswerReveal;