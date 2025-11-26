import React from "react";
import DeckCardItem from "./DeckCardItem";

export default function DeckCard({ decks, activeTheme, variant, gridClasses }) {
  return (
    <div className={gridClasses}>
      {decks.map((deck) => (
        <DeckCardItem
          key={deck.id}
          deck={deck}
          activeTheme={activeTheme}
          variant={variant}
        />
      ))}
    </div>
  );
}
