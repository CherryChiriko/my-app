import { useEffect, useRef } from "react";

const WRITER_CONFIG = {
  width: 250,
  height: 250,
  padding: 5,
  strokeAnimationSpeed: 2,
  delayBetweenStrokes: 100,
  drawingColor: "rgba(0,0,0,0)",
  highlightWrongColor: "#ff4d4d",
};

export function useHanziWriter({
  character,
  displayState,
  onQuizComplete,
  activeTheme,
  strokeColor,
  showAnswer,
}) {
  const outlineColor = activeTheme.isDark
    ? "rgb(212,212,212)"
    : "rgb(64,64,64)";

  const containerRef = useRef(null);
  const writerRef = useRef(null);

  // Create/recreate writer when character changes
  useEffect(() => {
    if (!character || !window.HanziWriter || !containerRef.current) {
      return;
    }

    // Clear previous writer
    containerRef.current.innerHTML = "";
    writerRef.current = null;

    try {
      const writer = window.HanziWriter.create(
        containerRef.current,
        character,
        {
          ...WRITER_CONFIG,
          strokeColor,
          outlineColor,
          highlightColor: strokeColor,
        }
      );
      writerRef.current = writer;
    } catch (error) {
      console.error("Failed to create HanziWriter:", error);
    }
  }, [character, strokeColor, outlineColor]);

  // Apply mode-specific behavior when displayState changes
  useEffect(() => {
    const writer = writerRef.current;
    if (!writer) return;

    try {
      switch (displayState) {
        case "animation":
          writer.hideCharacter();
          writer.loopCharacterAnimation();
          break;

        case "outline":
          writer.hideCharacter();
          writer.quiz({
            onComplete: () => onQuizComplete?.(0),
          });
          break;

        case "quiz":
          writer.hideCharacter();
          writer.hideOutline();
          writer.quiz({
            onComplete: (summary) => {
              const mistakes = summary?.totalMistakes ?? 0;
              onQuizComplete?.(mistakes);
            },
          });
          break;

        default:
          writer.showCharacter();
      }
    } catch (error) {
      console.error(`Failed to apply ${displayState} mode:`, error);
    }
  }, [displayState, onQuizComplete]);

  // Show character when answer is revealed
  useEffect(() => {
    const writer = writerRef.current;
    if (!writer || !showAnswer) return;

    try {
      writer.showCharacter();
    } catch (error) {
      console.error("Failed to show character:", error);
    }
  }, [showAnswer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (writerRef.current) {
        writerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return { containerRef };
}
