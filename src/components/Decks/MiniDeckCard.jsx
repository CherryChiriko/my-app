import React from "react";
import { useNavigate } from "react-router-dom";

const MiniDeckCard = ({ deck, activeTheme }) => {
  const navigate = useNavigate();
  const calculateProgress = (mastered, total) =>
    total > 0 ? (mastered / total) * 100 : 0;
  const progress = calculateProgress(deck.mastered || 0, deck.cardsCount || 0);

  return (
    <div
      key={deck.id}
      className={`cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-l-8 ${activeTheme.card.bg} rounded-xl shadow-md overflow-hidden`}
      style={{ borderLeftColor: activeTheme.card.progressBarBg || "#4ECDC4" }} // Fallback color
      onClick={() => navigate(`/decks/${deck.id}`)} // Navigate to specific deck view
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className={`text-xl font-semibold ${activeTheme.text.primary}`}>
              {deck.name}
            </h3>
            <p
              className={`text-sm ${activeTheme.card.description} line-clamp-2`}
            >
              {deck.language}
            </p>
          </div>
          {(deck.due || 0) > 0 && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${activeTheme.card.due} ${activeTheme.text.activeButton} ml-2 shadow-sm`}
            >
              {deck.due} due
            </span>
          )}
        </div>

        <div className="space-y-4 mb-4">
          <div
            className={`flex justify-between text-sm ${activeTheme.text.muted}`}
          >
            <span>Progress:</span>
            <span className="font-semibold">
              {Math.round(progress)}% mastered
            </span>
          </div>

          <div
            className={`w-full h-2.5 ${activeTheme.progress.track} rounded-full overflow-hidden`}
          >
            <div
              className={`${activeTheme.progress.fill} h-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
//             </div>
//   );
// };

export default MiniDeckCard;
