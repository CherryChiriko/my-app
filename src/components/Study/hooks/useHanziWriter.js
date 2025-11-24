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
    console.log("[HanziWriter] useEffect:create triggered", {
      character,
      strokeColor,
      outlineColor,
      containerRefExists: !!containerRef.current,
      hanziWriterExists: !!window.HanziWriter,
    });

    if (!character || !window.HanziWriter || !containerRef.current) {
      console.log("[HanziWriter] SKIPPED creation because:", {
        missingCharacter: !character,
        missingHW: !window.HanziWriter,
        missingContainer: !containerRef.current,
      });
      return;
    }

    // Clear previous writer
    containerRef.current.innerHTML = "";
    writerRef.current = null;

    try {
      console.log("[HanziWriter] Creating writer instance...");
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
      console.log("[HanziWriter] Writer created successfully", writer);
    } catch (error) {
      console.error("[HanziWriter] FAILED to create writer:", error);
    }
  }, [character, strokeColor, outlineColor]);

  // Apply mode-specific behavior when displayState changes
  useEffect(() => {
    const writer = writerRef.current;
    console.log("[useHanziWriter] APPLY MODE", {
      displayState,
      hasWriter: !!writer,
    });
    console.log(
      "Container size:",
      containerRef.current?.offsetWidth,
      containerRef.current?.offsetHeight
    );

    if (!writer) return;

    try {
      switch (displayState) {
        case "animation":
          console.log("[useHanziWriter] Starting animation loop");
          writer.hideCharacter();
          writer.loopCharacterAnimation();
          break;

        case "outline":
          console.log("[useHanziWriter] Starting outline quiz");
          writer.hideCharacter();
          writer.quiz({
            onComplete: () => {
              console.log("[useHanziWriter] Outline quiz complete");
              onQuizComplete?.(0);
            },
          });
          break;

        case "quiz":
          console.log("[useHanziWriter] Starting FULL quiz (interactive)");
          writer.hideCharacter();
          writer.hideOutline();
          writer.quiz({
            onComplete: (summary) => {
              console.log("[useHanziWriter] Quiz complete summary:", summary);
              const mistakes = summary?.totalMistakes ?? 0;
              onQuizComplete?.(mistakes);
            },
          });
          break;

        case "reveal":
        default:
          console.log("[useHanziWriter] Reveal mode – show character");
          writer.showCharacter();
      }
    } catch (error) {
      console.error(`[useHanziWriter] FAILED IN MODE ${displayState}`, error);
    }
  }, [displayState, onQuizComplete]);
  useEffect(() => {
    console.log("[useHanziWriter] showAnswer effect", {
      showAnswer,
      hasWriter: !!writerRef.current,
    });

    if (!writerRef.current || !showAnswer) return;

    try {
      console.log("[useHanziWriter] Showing character (answer revealed)");
      writerRef.current.showCharacter();
    } catch (error) {
      console.error("[useHanziWriter] Failed to show character", error);
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
