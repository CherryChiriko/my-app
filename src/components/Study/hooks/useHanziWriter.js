import { useEffect, useRef } from "react";

/**
 * displayState:
 * - "animation" -> animate character
 * - "outline"   -> show outline
 * - "quiz"      -> quiz
 * - "reveal"    -> show full character
 */

export function useHanziWriter({
  character,
  displayState = "reveal",
  onQuizComplete,
  activeTheme,
  strokeColor,
}) {
  const outlineColor = activeTheme.isDark
    ? "rgb(212,212,212)"
    : "rgb(64,64,64)";

  const containerRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    if (!character || !window.HanziWriter || !containerRef.current) return;

    // clear previous
    containerRef.current.innerHTML = "";
    writerRef.current = null;

    const options = {
      width: 250,
      height: 250,
      padding: 5,
      strokeColor,
      showCharacter: false,
      strokeAnimationSpeed: 2, //2x normal speed
      delayBetweenStrokes: 100,
      outlineColor: outlineColor,
      drawingColor: "rgba(0,0,0,0)",
      highlightColor: strokeColor,
      highlightWrongColor: "#ff4d4d",
    };

    const writer = window.HanziWriter.create(
      containerRef.current,
      character,
      options
    );
    writerRef.current = writer;

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
        writer.showCharacter();
    }

    return () => {
      writerRef.current = null;
    };
  }, [character, displayState, strokeColor, onQuizComplete, outlineColor]);

  return { containerRef };
}
