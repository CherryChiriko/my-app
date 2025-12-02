import React from "react";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "./slices/themeSlice";
import {
  selectActiveDeck,
  selectDeckStatus,
  selectDeckError,
} from "./slices/deckSlice";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import DeckManager from "./components/Decks/views/DeckManager";
import DeckListView from "./components/Decks/views/DeckListView";
import StudySession from "./components/Study/views/StudySession";
import LoginPage from "./components/LoginPage";
import NotFound404 from "./components/404";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/General/routing/ScrollToTop";
import DecksLoader from "./components/Loaders/DecksLoader";
import CardsLoader from "./components/Loaders/CardsLoader";

function App() {
  const activeTheme = useSelector(selectActiveTheme);
  const { session, loading: authLoading } = useAuth();
  const status = useSelector(selectDeckStatus);
  const error = useSelector(selectDeckError);
  const activeDeck = useSelector(selectActiveDeck);

  // Auth check
  if (authLoading) {
    return (
      <div
        className={`${activeTheme.background.app} min-h-screen flex items-center justify-center`}
      >
        <p className={`${activeTheme.text.primary} text-xl animate-pulse`}>
          Checking session...
        </p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage activeTheme={activeTheme} />;
  }

  // Render DecksLoader to trigger fetch (but show loading UI)
  if (status === "loading" || status === "idle") {
    return (
      <>
        <DecksLoader session={session} authLoading={authLoading} />
        <div
          className={`${activeTheme.background.app} min-h-screen flex items-center justify-center`}
        >
          <p className={`${activeTheme.text.primary} text-xl animate-pulse`}>
            Loading decks...
          </p>
        </div>
      </>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`${activeTheme.background.app} min-h-screen flex items-center justify-center`}
      >
        <div
          className={`${activeTheme.text.primary} space-y-4 text-center text-xl`}
        >
          <p>Error loading decks: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-2 rounded ${activeTheme.button.accent2}`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // All good: decks loaded + user authenticated
  return (
    <div
      style={{
        backgroundColor: activeTheme.background.app,
        color: activeTheme.text.primary,
        minHeight: "100vh",
      }}
    >
      <CardsLoader activeDeck={activeDeck} />
      <Navbar />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckManager />}>
            <Route index element={<DeckListView />} />
          </Route>
          <Route path="/study" element={<StudySession />} />
          <Route path="*" element={<NotFound404 activeTheme={activeTheme} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
