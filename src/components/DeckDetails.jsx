import React from "react";

import { useSelector } from "react-redux";
import { selectActiveTheme } from "../slices/themeSlice";
import RevuLogo from "../assets/Revu_logo.png";

const DeckDetails = () => {
  const activeTheme = useSelector(selectActiveTheme);
  return (
    <h1>
      <div
        className="w-32 h-10"
        style={{
          backgroundImage: `linear-gradient(to right, ${activeTheme.gradients.from.replace(
            "from-",
            "#"
          )}, ${activeTheme.gradients.to.replace("to-", "#")})`,
          WebkitMaskImage: `url(${RevuLogo})`,
          maskImage: `url(${RevuLogo})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      />
      <div className="background-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
        Hello, this is the Deck Details component!
      </div>
    </h1>
  );
};
export default DeckDetails;
