import { useSelector } from "react-redux";
import { selectActiveTheme } from "./features/themeSlice";
import Navbar from "./components/Navbar";
import DeckManager from "./components/DeckManager";
import StudySession from "./components/StudySession";
import SettingsPage from "./components/SettingsPage";
import Dashboard from "./components/Dashboard";
import Fourzerofour from "./components/404";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const activeTheme = useSelector(selectActiveTheme);

  // Apply dynamic background and text color directly as inline styles
  const appContainerStyles = {
    backgroundColor: activeTheme.bgColor,
    color: activeTheme.textColor, 
    minHeight: '100vh', 
  };

  return (
    <div style={appContainerStyles}>
      {/* <Navbar /> */}
      {/* Render different views based on currentView state */}
      <main className="container mt-3"> {/* Use a container for page content */}
        <Routes> {/* Define your routes here */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckManager />} />
          <Route path="/study" element={<StudySession />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Fourzerofour />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;