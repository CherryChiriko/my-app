import React from "react";

import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";

const DeckDetails = () => {
  const activeTheme = useSelector(selectActiveTheme);
  return (
    <>
      <div
        className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
                  bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
      >
        Hello, this is the Deck Details component!
      </div>
    </>
  );
};
export default DeckDetails;
