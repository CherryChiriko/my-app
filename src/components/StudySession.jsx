// src/components/StudySession.jsx
import React, { useRef, useEffect, useState } from "react";

const StudySession = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [character, setCharacter] = useState("あ"); // Example character
  const [progress, setProgress] = useState({ current: 1, total: 2 });
  const [reviewed, setReviewed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Add null check for canvas

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FFFFFF"; // White drawing color

    const startDrawing = ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = nativeEvent;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Cleanup event listeners
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, [isDrawing]); // Re-run effect when isDrawing changes

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleGuidedDrawing = () => {
    // Implement logic to display faded stroke order or guide lines
    alert("Guided drawing feature is not yet implemented.");
  };

  const playAudio = () => {
    // Implement audio playback for the character
    alert(`Playing audio for ${character}`);
  };

  const revealAnswer = () => {
    // Transition to the answer reveal state/component
    alert("Revealing answer...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <button className="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Exit Study
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Japanese Hiragana Basics
          </h2>
          <p className="text-gray-400 text-sm">
            {progress.current} of {progress.total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">
            Reviewed:{" "}
            <span className="text-white font-semibold">{reviewed}</span>
          </p>
          <p className="text-sm text-gray-400">
            Accuracy:{" "}
            <span className="text-green-400 font-semibold">{accuracy}%</span>
          </p>
        </div>
      </header>

      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-10">
        <div
          className="bg-purple-500 h-2.5 rounded-full"
          style={{ width: `${(progress.current / progress.total) * 100}%` }}
        ></div>
      </div>

      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-lg p-8 flex justify-center items-center relative h-64 mb-8">
        <span className="text-8xl font-bold text-white">{character}</span>
        <div className="absolute top-4 right-4 flex flex-col space-y-4">
          <button
            onClick={playAudio}
            className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-40 transition-colors duration-200"
            aria-label="Play audio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9l-.707.707m-2.829 2.828l-.707.707m-2.828-2.828l-.707-.707M7.071 17.657l-.707.707M12 4v16m0-12h.01M12 8h.01"
              />
            </svg>
          </button>
          <button
            onClick={revealAnswer}
            className="p-3 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-40 transition-colors duration-200"
            aria-label="Reveal answer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-white">
            Draw the character:
          </h4>
          <div className="flex space-x-3">
            <button
              onClick={handleGuidedDrawing}
              className="flex items-center text-blue-400 hover:text-blue-300 text-sm px-4 py-2 rounded-lg border border-blue-400 hover:border-blue-300 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v14c0 1.105-.895 2-2 2H8V9l4-2 8 4V5l-8-2-4 2v10l-4 2z"
                />
              </svg>
              Guided
            </button>
            <button
              onClick={handleClearCanvas}
              className="flex items-center text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg border border-red-400 hover:border-red-300 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m10 0h4M3 7h4"
                />
              </svg>
              Clear
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width="400"
          height="200"
          className="bg-gray-700 border border-gray-600 rounded-lg w-full h-48 cursor-crosshair"
        ></canvas>
      </div>
    </div>
  );
};

export default StudySession;
