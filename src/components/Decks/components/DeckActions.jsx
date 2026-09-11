import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faRedo } from "@fortawesome/free-solid-svg-icons";
import { useCharacterPracticeAccess } from "../../../hooks/useCharacterPracticeAccess";
import PaywallModal from "../../Paywall/PaywallModal"; // Adjust path to where PaywallModal resides

export function DeckActions({
  deck,
  showLearn,
  showReview,
  handleAction,
  activeTheme,
  due = 0,
  large = false,
  isCharacterMode,
}) {
  const [showPaywall, setShowPaywall] = useState(false);
  const { canStartPractice } = useCharacterPracticeAccess();

  const onButtonClick = (e, actionType) => {
    // Intercept action if character practice limit is reached
    console.log(
      "isCharacterMode:",
      isCharacterMode,
      "canStartPractice:",
      canStartPractice,
    );
    if (isCharacterMode && actionType === "learn" && !canStartPractice) {
      e.stopPropagation();
      e.preventDefault();
      setShowPaywall(true);
      return;
    }

    handleAction(e, actionType);
  };

  const largeClasses =
    "flex-1 py-2 rounded-lg font-semibold flex items-center justify-center";

  // Compact: pill badge with icon + count
  const compactClasses =
    "h-7 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold";

  return (
    <>
      <div className={large ? "mt-3 flex space-x-3" : "flex space-x-2"}>
        {showLearn && (
          <button
            onClick={(e) => onButtonClick(e, "learn")}
            className={`${activeTheme.button.primary} ${
              activeTheme.text.activeButton
            } ${large ? largeClasses : compactClasses}`}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              className={large ? "mr-2" : "w-3 h-3"}
            />
            Learn
          </button>
        )}
        {showReview && (
          <button
            onClick={(e) => onButtonClick(e, "review")}
            className={`${activeTheme.button.accent} ${
              activeTheme.text.activeButton
            } ${large ? largeClasses : compactClasses}`}
          >
            <FontAwesomeIcon
              icon={faRedo}
              className={large ? "mr-2" : "w-3 h-3"}
            />
            {`Review (${due})`}
          </button>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Daily Limit Reached"
        description="You've used your 1 free Character Practice session for today. Upgrade to Pro for unlimited daily sessions and custom batch sizes!"
      />
    </>
  );
}
