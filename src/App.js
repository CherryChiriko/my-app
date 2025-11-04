import { useSelector } from "react-redux";
import { selectActiveTheme } from "./slices/themeSlice";
import Navbar from "./components/Navbar/Navbar";
import DeckManager from "./components/Decks/DeckManager";
import Dashboard from "./components/Dashboard/Dashboard";
import StudySession from "./components/Study/StudySession";
import Fourzerofour from "./components/404";
import DeckListView from "./components/Decks/DeckListView";
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckManager />}>
            {/* Index route for /decks - shows the main deck list */}
            <Route index element={<DeckListView />} />
            {/* Nested route for /decks/import - shows the import page */}
            {/* <Route path="import" element={<Import />} /> */}
            {/* Nested route for viewing a specific deck */}
            {/* <Route path=":deckId" element={<DeckDetails />} /> */}
          </Route>
          <Route path="/study" element={<StudySession />} />
          <Route path="*" element={<Fourzerofour />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
