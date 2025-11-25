import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveTheme } from "./slices/themeSlice";
import {
  fetchDecks,
  selectDeckError,
  selectDeckStatus,
} from "./slices/deckSlice";
import Navbar from "./components/Navbar/Navbar";
import DeckManager from "./components/Decks/DeckManager";
import Dashboard from "./components/Dashboard/Dashboard";
import StudySession from "./components/Study/views/StudySession";
import NotFound404 from "./components/404";
import DeckListView from "./components/Decks/DeckListView";
import ScrollToTop from "./helpers/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const activeTheme = useSelector(selectActiveTheme);
  const dispatch = useDispatch();
  const status = useSelector(selectDeckStatus);
  const error = useSelector(selectDeckError);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDecks());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading decks...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p>Error loading decks: {error}</p>
          <button onClick={() => dispatch(fetchDecks())}>Retry</button>
        </div>
      </div>
    );
  }

  const appContainerStyles = {
    backgroundColor: activeTheme.bgColor,
    color: activeTheme.textColor,
    minHeight: "100vh",
  };

  return (
    <div style={appContainerStyles}>
      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckManager />}>
            {/* Index route for /decks - shows the main deck list */}
            <Route index element={<DeckListView />} />
            {/* Nested route for /decks/import - shows the import page */}
            {/* <Route path="import" element={<Import />} /> */}
            {/* Nested route for viewing a specific deck */}
            {/* <Route path=":deck_id" element={<DeckDetails />} /> */}
          </Route>
          <Route path="/study" element={<StudySession />} />
          <Route path="*" element={<NotFound404 activeTheme={activeTheme} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
