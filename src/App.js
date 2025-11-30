import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveTheme } from "./slices/themeSlice";
import {
  fetchDecks,
  selectDeckError,
  selectDeckStatus,
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

function App() {
  const activeTheme = useSelector(selectActiveTheme);
  const { session, loading: authLoading } = useAuth();
  const status = useSelector(selectDeckStatus);
  const error = useSelector(selectDeckError);
  const dispatch = useDispatch();

  // Fetch decks only once when session is available AND loading is done
  useEffect(() => {
    if (!authLoading && session && status === "idle") {
      console.log("App: dispatching fetchDecks because session present");
      dispatch(fetchDecks());
    }
  }, [authLoading, session, status, dispatch]);

  // Don't show anything while checking auth
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

  // Show login if no session
  if (!session) {
    return <LoginPage activeTheme={activeTheme} />;
  }

  // Show loading only on FIRST load (when status is loading and decks are empty)
  if (status === "loading") {
    return (
      <div
        className={`${activeTheme.background.app} min-h-screen flex items-center justify-center`}
      >
        <p className={`${activeTheme.text.primary} text-xl animate-pulse`}>
          Loading decks...
        </p>
      </div>
    );
  }

  // Don't render app until decks are loaded (succeeded or failed)
  if (status === "idle") {
    return (
      <div
        className={`${activeTheme.background.app} min-h-screen flex items-center justify-center`}
      >
        <p className={`${activeTheme.text.primary} text-xl animate-pulse`}>
          Preparing...
        </p>
      </div>
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
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: activeTheme.bgColor,
        color: activeTheme.textColor,
        minHeight: "100vh",
      }}
    >
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
