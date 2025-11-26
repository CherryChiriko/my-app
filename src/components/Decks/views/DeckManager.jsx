import { React } from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../../slices/themeSlice";

import Header from "../../General/ui/Header";

import { Outlet } from "react-router-dom";

const DeckManager = () => {
  const activeTheme = useSelector(selectActiveTheme);

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full`}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <Header
          title="Deck Manager"
          description="Create, edit, and manage your flashcard decks"
        />
        <Outlet />
      </div>
    </div>
  );
};

export default DeckManager;
