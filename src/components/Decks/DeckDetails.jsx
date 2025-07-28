import React from "react";

import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";
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
      <div
        className={`rounded-lg p-6 shadow-xl transform hover:scale-105 transition-all duration-300
                  bg-gradient-to-br ${activeTheme.gradients.from} ${activeTheme.gradients.to} text-white`}
      >
        <div className="pb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            Current Streak
          </h3>
        </div>
        <div>
          <div className="text-3xl font-bold">7</div>
          <p className={`text-sm ${activeTheme.text.activeButton}`}>
            days in a row
          </p>
        </div>
      </div>
    </h1>
  );
};
export default DeckDetails;
