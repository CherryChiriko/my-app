import React, { useEffect, useRef } from "react";

const HanziCanvas = ({
  character,
  quizActive,
  onQuizComplete,
  activeTheme,
  strokeColor,
}) => {
  const hanziWriterRef = useRef(null);
  const writerInstanceRef = useRef(null);

  console.log(String(strokeColor));

  useEffect(() => {
    if (!character || !window.HanziWriter || !hanziWriterRef.current) return;

    // Clear any previous writer
    hanziWriterRef.current.innerHTML = "";
    writerInstanceRef.current = null;

    // Create writer
    const options = {
      width: 250,
      height: 250,
      padding: 5,
      strokeColor,
      showCharacter: false,
      showOutline: false,
    };

    const writer = window.HanziWriter.create(
      hanziWriterRef.current,
      character,
      options
    );

    if (quizActive) {
      // QUIZ MODE
      writer.quiz({
        onComplete: (summary) => {
          onQuizComplete?.(summary.totalMistakes);
        },
      });
    } else {
      // REVEAL MODE
      writer.showCharacter();
    }

    writerInstanceRef.current = writer;

    // Cleanup on unmount or re-render
    return () => {
      if (hanziWriterRef.current) {
        hanziWriterRef.current.innerHTML = "";
      }
      writerInstanceRef.current = null;
    };
  }, [character, quizActive, onQuizComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <div
        ref={hanziWriterRef}
        className={` ${activeTheme.background.canvas}  border-4 ${activeTheme.border.card} rounded-xl shadow-lg transition-all duration-300`}
        style={{ width: "250px", height: "250px" }}
      ></div>
    </div>
  );
};

export default HanziCanvas;
