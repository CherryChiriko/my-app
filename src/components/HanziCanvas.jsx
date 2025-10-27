import React, { useState, useEffect, useRef } from "react";

const HanziCanvas = ({
  character,
  quizActive,
  onQuizComplete,
  activeTheme,
}) => {
  const hanziWriterRef = useRef(null);
  const writerInstanceRef = useRef(null);

  const initialStatus = {
    totalMistakes: 0,
    strokesRemaining: 0,
    isQuizComplete: false,
  };

  const [quizStatus, setQuizStatus] = useState(initialStatus);

  // --- Quiz Logic ---
  const startQuiz = (char) => {
    if (!char || !quizActive) return;

    setQuizStatus(initialStatus);

    if (hanziWriterRef.current) {
      hanziWriterRef.current.innerHTML = "";
      if (window.HanziWriter) {
        const writer = window.HanziWriter.create(hanziWriterRef.current, char, {
          width: 250,
          height: 250,
          showCharacter: false,
          showOutline: false,
          padding: 5,
          delayBetweenStrokes: 0, // Faster progression
          strokeColor: "#337ab7",
          showHintAfterMisses: 1,
        });

        writerInstanceRef.current = writer;
        // writer.showOutline(); // Show outline for guidance

        writer.quiz({
          onMistake: (strokeData) => {
            setQuizStatus((prevStatus) => ({
              ...prevStatus,
              totalMistakes: strokeData.totalMistakes,
              strokesRemaining: strokeData.strokesRemaining,
            }));
          },
          onCorrectStroke: (strokeData) => {
            setQuizStatus((prevStatus) => ({
              ...prevStatus,
              totalMistakes: strokeData.totalMistakes,
              strokesRemaining: strokeData.strokesRemaining,
            }));
          },
          onComplete: (summaryData) => {
            setQuizStatus({
              totalMistakes: summaryData.totalMistakes,
              strokesRemaining: 0,
              isQuizComplete: true,
            });
            // Report score back to CardRenderer
            onQuizComplete(summaryData.totalMistakes);
          },
        });
      } else {
        setQuizStatus((prevStatus) => ({
          ...prevStatus,
        }));
      }
    }
  };

  // Start/Restart quiz when character or quizActive state changes
  useEffect(() => {
    if (quizActive && character) {
      startQuiz(character);
    }
    return () => {
      if (hanziWriterRef.current) {
        hanziWriterRef.current.innerHTML = "";
      }
    };
  }, [character, quizActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      {/* HanziWriter Canvas */}
      <div
        ref={hanziWriterRef}
        className={`bg-white border-4 ${activeTheme.border.card} rounded-xl shadow-lg transition-all duration-300`}
        style={{ width: "250", height: "250" }}
      ></div>
    </div>
  );
};

export default HanziCanvas;
