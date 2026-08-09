// src/components/Study/components/Controls/RevealButton.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const RevealButton = ({ onReveal, activeTheme, variant = "standard" }) => {
  const isDemo = variant === "demo";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onReveal();
      }}
      className={`rounded-full font-semibold ${activeTheme.button.primary} ${
        activeTheme.text.activeButton
      } transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
        isDemo
          ? "px-4 py-1.5 text-xs mb-1"
          : "px-5 py-2.5 text-xs md:px-6 md:py-3 md:text-base"
      }`}
    >
      <FontAwesomeIcon
        icon={faEye}
        className={
          isDemo ? "w-3 h-3 mr-1.5" : "w-3.5 h-3.5 mr-1.5 md:w-4 md:h-4 md:mx-2"
        }
      />
      Reveal Answer
    </button>
  );
};

export default RevealButton;
