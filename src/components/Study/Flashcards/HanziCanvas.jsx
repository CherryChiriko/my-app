import { useEffect, useRef } from "react";

/**
 * displayState:
 * - "animation" -> animate character
 * - "outline"   -> show outline
 * - "quiz"      -> quiz
 * - "reveal"    -> show full character
 */

const HanziCanvas = ({
  character,
  displayState = "reveal",
  onQuizComplete,
  activeTheme,
  strokeColor,
}) => {
  const outlineColor = activeTheme.isDark
    ? "rgb(212,212,212)"
    : "rgb(64,64,64)";

  const hanziWriterRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    if (!character || !window.HanziWriter || !hanziWriterRef.current) return;

    // clear previous
    hanziWriterRef.current.innerHTML = "";
    writerRef.current = null;

    const options = {
      width: 250,
      height: 250,
      padding: 5,
      strokeColor,
      showCharacter: false,
      // showOutline: false,
      // showOutline: true, // Outline is *on by default*
      strokeAnimationSpeed: 2, //4x normal speed
      delayBetweenStrokes: 100,
      outlineColor: outlineColor,
      drawingColor: "rgba(0,0,0,0)",
      highlightColor: strokeColor,
      highlightWrongColor: "#ff4d4d",
    };

    const writer = window.HanziWriter.create(
      hanziWriterRef.current,
      character,
      options
    );
    writerRef.current = writer;

    // Decide what to do based on displayState
    switch (displayState) {
      case "animation":
        writer.loopCharacterAnimation();
        break;
      case "outline":
        writer.quiz();
        break;
      case "quiz":
        writer.hideOutline();
        writer.quiz({
          showOutline: false,
          onComplete: (summary) => {
            const mistakes = summary?.totalMistakes ?? 0;
            onQuizComplete?.(mistakes);
          },
        });
        break;
      default:
        console.log("Im here");
        writer.showCharacter();
    }

    return () => {
      writerRef.current = null;
    };
  }, [character, displayState, strokeColor, onQuizComplete, outlineColor]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <div
        ref={hanziWriterRef}
        className={`${activeTheme?.background?.canvas ?? "bg-white"} border-4 ${
          activeTheme?.border?.card ?? "border-gray-200"
        } rounded-xl shadow-lg transition-all duration-300`}
        style={{ width: "250px", height: "250px" }}
      />
    </div>
  );
};

export default HanziCanvas;
