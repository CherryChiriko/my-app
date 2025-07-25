import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice"; // Adjust path as needed

const Import = ({ isOpen, onClose, onImport }) => {
  const activeTheme = useSelector(selectActiveTheme);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  const handleImportClick = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      setFileName("");
      onClose(); // Close popup after initiating import
    } else {
      // You might want to display a message to the user that no file is selected
      console.log("No file selected for import.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className={`${activeTheme.card.bg} rounded-lg shadow-xl p-6 w-full max-w-md relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${activeTheme.text.secondary} hover:${activeTheme.text.primary} transition-colors duration-200`}
        >
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>
        <h2 className={`text-2xl font-bold ${activeTheme.card.text} mb-4`}>
          Import Excel File
        </h2>
        <p className={`${activeTheme.card.description} mb-6`}>
          Please select an Excel file (.xlsx, .xls) to import your decks.
        </p>

        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className={`block ${activeTheme.text.primary} text-sm font-medium mb-2`}
          >
            Choose File:
          </label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"
            style={{
              borderColor: activeTheme.border.bottom
                .replace("border-", "#")
                .replace("700", "500"),
            }}
          >
            {" "}
            {/* Dynamic border color */}
            <div className="space-y-1 text-center">
              <svg
                className={`mx-auto h-12 w-12 ${activeTheme.text.secondary}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className={`relative cursor-pointer ${activeTheme.text.primary} rounded-md font-medium hover:${activeTheme.text.secondary} focus-within:outline-none focus-within:ring-2 focus-within:${activeTheme.ring.focus} focus-within:ring-offset-2`}
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </label>
                <p className={`pl-1 ${activeTheme.text.secondary}`}>
                  or drag and drop
                </p>
              </div>
              <p className={`text-xs ${activeTheme.text.secondary}`}>
                {fileName ? fileName : "Excel files (.xlsx, .xls)"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleImportClick}
          disabled={!selectedFile}
          className={`w-full ${activeTheme.button.primaryBg} ${activeTheme.button.primaryHover} ${activeTheme.text.activeButton} font-semibold py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Import Deck
        </button>
      </div>
    </div>
  );
};

export default Import;
