// DeckGrid.jsx - New component to handle the deck list
import React from "react";
import DeckCardModel from "../../Decks/components/DeckCardModel";

function DeckGrid({ currentDecks, viewMode, activeTheme, gridClasses }) {
  return (
    <div className={gridClasses}>
      {currentDecks.map((deck) => (
        <DeckCardModel
          key={deck.id}
          deck={deck}
          activeTheme={activeTheme}
          variant={viewMode === "grid" ? "full" : "compact"}
        />
      ))}
    </div>
  );
}

export default DeckGrid;
