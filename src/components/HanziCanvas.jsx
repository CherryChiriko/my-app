import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [character, setCharacter] = useState("码");
  const initialStatus = {
    totalMistakes: 0,
    strokesRemaining: 0,
    isQuizComplete: false,
    message: "Draw the character!",
  };
  const [quizStatus, setQuizStatus] = useState(initialStatus);
  const hanziWriterRef = useRef(null);

  const startQuiz = (char) => {
    // Reset the quiz state
    setQuizStatus(initialStatus);

    if (hanziWriterRef.current) {
      // Clear any previous writer instances to avoid conflicts
      hanziWriterRef.current.innerHTML = "";
      if (window.HanziWriter) {
        const writer = window.HanziWriter.create(hanziWriterRef.current, char, {
          width: 150,
          height: 150,
          showCharacter: false,
          padding: 5,
        });

        writer.quiz({
          onMistake: (strokeData) => {
            setQuizStatus((prevStatus) => ({
              ...prevStatus,
              totalMistakes: strokeData.totalMistakes,
              strokesRemaining: strokeData.strokesRemaining,
              message: `Mistake on stroke ${strokeData.strokeNum}!`,
            }));
          },
          onCorrectStroke: (strokeData) => {
            setQuizStatus((prevStatus) => ({
              ...prevStatus,
              totalMistakes: strokeData.totalMistakes,
              strokesRemaining: strokeData.strokesRemaining,
              message: `Correct! Strokes remaining: ${strokeData.strokesRemaining}`,
            }));
          },
          onComplete: (summaryData) => {
            setQuizStatus({
              totalMistakes: summaryData.totalMistakes,
              strokesRemaining: 0,
              isQuizComplete: true,
              message: `You did it! You finished drawing ${summaryData.character} with ${summaryData.totalMistakes} mistakes.`,
            });
          },
        });
      } else {
        setQuizStatus((prevStatus) => ({
          ...prevStatus,
          message:
            "HanziWriter not loaded. Please ensure the library is included.",
        }));
      }
    }
  };

  useEffect(() => {
    // Start the quiz when the component mounts
    startQuiz(character);
  }, [character]);

  const handleRestart = () => {
    // You can change the character here to test other quizzes
    const characters = ["永", "爱", "中", "国", "龙"];
    const nextChar = characters[Math.floor(Math.random() * characters.length)];
    setCharacter(nextChar);
    startQuiz(nextChar);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center space-y-6 transform transition-transform duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Hanzi Quiz
        </h1>
        <p className="text-xl text-gray-600 font-semibold">{character}</p>

        <div
          ref={hanziWriterRef}
          className="bg-gray-200 border-4 border-gray-300 rounded-lg overflow-hidden mx-auto"
          style={{ width: "150px", height: "150px" }}
        ></div>

        <div className="text-lg font-medium text-gray-800">
          <p className="text-2xl font-bold text-blue-600">
            {quizStatus.message}
          </p>
          {!quizStatus.isQuizComplete && (
            <div className="mt-4 space-y-2 text-gray-600">
              <p>
                Strokes Remaining:{" "}
                <span className="font-bold text-gray-900">
                  {quizStatus.strokesRemaining}
                </span>
              </p>
              <p>
                Total Mistakes:{" "}
                <span className="font-bold text-gray-900">
                  {quizStatus.totalMistakes}
                </span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleRestart}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
}
