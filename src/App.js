import { useSelector } from "react-redux";
import { selectActiveTheme } from "./slices/themeSlice";
import Navbar from "./components/Navbar/Navbar";
import DeckManager from "./components/Decks/DeckManager";
import StudySession from "./components/StudySession";
import Fourzerofour from "./components/404";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const activeTheme = useSelector(selectActiveTheme);
  console.log("Active Theme in App:", activeTheme);
  // Apply dynamic background and text color directly as inline styles
  const appContainerStyles = {
    backgroundColor: activeTheme.bgColor,
    color: activeTheme.textColor,
    minHeight: "100vh",
  };

  return (
    <div style={appContainerStyles}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/decks" element={<DeckManager />}></Route>
          <Route path="*" element={<StudySession />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
