// src/pages/Dashboard.jsx (Remade UI)
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";
import { selectGlobalStreak } from "../../slices/streakSlice";
import {
  fetchDecks,
  selectAllDecks,
  selectDecksStatus,
  selectDecksError,
} from "../../slices/deckSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faFire,
  faClock,
  faBullseye,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import DeckCompact from "../Decks/DeckCompact";

/* ----------------- Helper UI Components (in-file for now) ----------------- */

/* XP Progress Bar */
const XPBar = ({ totalXP = 0, activeTheme }) => {
  // simple level formula: level = floor(sqrt(totalXP / 10))
  const level = Math.floor(Math.sqrt(totalXP / 10));
  const xpForLevel = (level + 1) ** 2 * 10;
  const xpThisLevel = totalXP - level ** 2 * 10;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((xpThisLevel / xpForLevel) * 100))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeTheme.background.accent || "bg-indigo-500"
            }`}
          >
            <span className="font-semibold">Lv</span>
          </div>
          <div>
            <div className="text-sm opacity-80">Progress to next level</div>
            <div className="text-lg font-bold">Level {level}</div>
          </div>
        </div>
        <div className="text-sm opacity-70">{totalXP} XP</div>
      </div>

      <div
        className="w-full bg-opacity-20 rounded-full h-3 overflow-hidden"
        style={{
          backgroundColor: activeTheme.background.progressTrack || "#2d3748",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${
              activeTheme.gradients.fromHex || "#7c3aed"
            }, ${activeTheme.gradients.toHex || "#06b6d4"})`,
          }}
        />
      </div>
      <div className="mt-2 text-xs opacity-70">
        {xpThisLevel}/{xpForLevel} XP ({pct}%)
      </div>
    </div>
  );
};

/* Small stat card */
const StatCard = ({ icon, label, value, activeTheme }) => (
  <div
    className={`${activeTheme.background.secondary} rounded-2xl p-4 shadow-sm flex items-center gap-4`}
  >
    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-opacity-20">
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
    </div>
    <div>
      <div className="text-sm opacity-75">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

/* Heatmap: GitHub-style monthly grid. Expects array of {date: 'YYYY-MM-DD', value: number} */
const Heatmap = ({ data = [], activeTheme }) => {
  // Map dates to values for quick lookup
  const map = useMemo(() => {
    const m = new Map();
    data.forEach((d) => m.set(d.date, d.value));
    return m;
  }, [data]);

  // Render last 28 days (4 weeks x 7)
  const days = 28;
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    const v = map.get(iso) || 0;
    cells.push({ iso, v });
  }

  const getColor = (v) => {
    if (v === 0) return activeTheme.background.inactive || "#111827";
    if (v < 3) return activeTheme.background.success || "#86efac";
    if (v < 7) return activeTheme.background.warn || "#facc15";
    return activeTheme.background.danger || "#fb7185";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Study Heatmap</h3>
        <div className="text-xs opacity-60">last 4 weeks</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => (
          <div
            key={c.iso}
            className="w-7 h-7 rounded-sm"
            title={`${c.iso}: ${c.v} reviews`}
            style={{ background: getColor(c.v) }}
          />
        ))}
      </div>
      <div className="text-xs opacity-60">Darker = more activity</div>
    </div>
  );
};

/* Achievements row */
const AchievementsRow = ({ achievements = [], onClaim, activeTheme }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Achievements</h3>
        <div className="text-xs opacity-60">Unlock badges to earn themes</div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`min-w-[120px] p-3 rounded-xl flex-shrink-0 ${activeTheme.background.widget}`}
          >
            <div className="flex items-center justify-center mb-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  a.unlocked ? "ring-2 ring-offset-2" : "opacity-30"
                }`}
              >
                <img src={a.icon} alt={a.title} className="w-8 h-8" />
              </div>
            </div>
            <div className="text-sm font-semibold">{a.title}</div>
            <div className="text-xs opacity-70 mb-2">{a.hint}</div>
            <div className="flex items-center gap-2">
              {a.unlocked ? (
                <button
                  className={`text-sm px-3 py-1 rounded-full ${activeTheme.button.secondaryBg}`}
                >
                  Claim
                </button>
              ) : (
                <div className="text-xs opacity-60">Locked</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------- Main Dashboard ----------------- */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTheme = useSelector(selectActiveTheme);

  const decks = useSelector(selectAllDecks);
  const status = useSelector(selectDecksStatus);
  const error = useSelector(selectDecksError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchDecks());
  }, [dispatch, status]);

  const cards_due_today = decks.reduce((t, d) => t + (d.due || 0), 0);
  const mastered_cards = decks.reduce((t, d) => t + (d.mastered || 0), 0);
  const currentStreak = useSelector(selectGlobalStreak);

  // Mocked / derived values until backend provides XP & achievement data
  const totalXP = useMemo(
    () =>
      Math.max(0, mastered_cards * 5 + currentStreak * 10 + cards_due_today),
    [mastered_cards, currentStreak, cards_due_today]
  );

  // Mock heatmap data for last 28 days
  const heatmapData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      arr.push({ date: iso, value: Math.floor(Math.random() * 8) });
    }
    return arr;
  }, []);

  // Mock achievements
  const achievements = [
    {
      id: "a1",
      title: "First Day",
      hint: "Study for 1 day",
      unlocked: currentStreak >= 1,
      icon: "/icons/badge1.svg",
    },
    {
      id: "a2",
      title: "Week Streak",
      hint: "7 day streak",
      unlocked: currentStreak >= 7,
      icon: "/icons/badge2.svg",
    },
    {
      id: "a3",
      title: "Master 100",
      hint: "Master 100 cards",
      unlocked: mastered_cards >= 100,
      icon: "/icons/badge3.svg",
    },
    {
      id: "a4",
      title: "Consistent 30",
      hint: "30 day streak",
      unlocked: currentStreak >= 30,
      icon: "/icons/badge4.svg",
    },
  ];

  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${activeTheme.background.app}`}
      >
        <p className="text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p>Error loading dashboard: {error}</p>
          <button onClick={() => dispatch(fetchDecks())}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${activeTheme.background.app} ${activeTheme.text.primary} w-full py-10 px-6 font-inter`}
    >
      <div className="max-w-screen-xl mx-auto space-y-8">
        {/* Hero — simplified: logo + tagline + optional small CTA */}
        <div
          className={`${activeTheme.background.secondary} rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-6`}
        >
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">R E V U</h1>
            <p className={`mt-2 ${activeTheme.text.muted}`}>
              Smart spaced repetition — build lasting knowledge, one card at a
              time.
            </p>
          </div>

          <div className="w-full md:w-72">
            <XPBar totalXP={totalXP} activeTheme={activeTheme} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={faFire}
            label="Current Streak"
            value={`${currentStreak} days`}
            activeTheme={activeTheme}
          />
          <StatCard
            icon={faClock}
            label="Cards Due"
            value={cards_due_today}
            activeTheme={activeTheme}
          />
          <StatCard
            icon={faBullseye}
            label="Mastered"
            value={mastered_cards}
            activeTheme={activeTheme}
          />
          <div
            className={`${activeTheme.background.secondary} rounded-2xl p-4 shadow-sm flex items-center gap-4`}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm opacity-75">Decks</div>
              <div className="text-2xl font-bold">{decks.length}</div>
            </div>
          </div>
        </div>

        {/* Main grid: Left (decks + achievements) | Right (heatmap + optional actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <button
                onClick={() => navigate("/decks")}
                className={`text-sm ${activeTheme.text.link}`}
              >
                Browse decks <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

            {decks.length === 0 ? (
              <div
                className={`${activeTheme.background.secondary} text-center py-16 rounded-xl shadow-md`}
              >
                <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-3" />
                <p className="font-semibold mb-3">No decks yet</p>
                <button
                  onClick={() => navigate("/decks")}
                  className={`px-6 py-2 rounded-full font-semibold ${activeTheme.button.primaryBg}`}
                >
                  Create Deck
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decks.slice(0, 6).map((deck) => (
                  <DeckCompact
                    key={deck.id}
                    deck={deck}
                    activeTheme={activeTheme}
                  />
                ))}
              </div>
            )}

            <AchievementsRow
              achievements={achievements}
              activeTheme={activeTheme}
            />
          </div>

          <div
            className={`${activeTheme.background.secondary} p-6 rounded-2xl shadow-lg`}
          >
            <Heatmap data={heatmapData} activeTheme={activeTheme} />

            <div className="mt-6 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Skins & Themes</h4>
                <div className="text-xs opacity-70">
                  Unlock free themes with achievements or buy premium skins.
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded-full ${activeTheme.button.outline}`}
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
