import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBullseye,
  faTrophy,
  faClock,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import StatCard from "../General/StatCard";
import RevuLogo from "../../assets/revu_logo_long.png";

const DashboardHero = ({
  activeTheme,
  streaks,
  cards_due_today,
  mastered_cards,
  today,
}) => {
  const navigate = useNavigate();
  // const accents = [
  //   // activeTheme.accent.accent1,
  //   activeTheme.accent.accent2,
  //   activeTheme.accent.accent3,
  //   activeTheme.accent.accent4,
  // ];
  const statCards = [
    {
      icon: <FontAwesomeIcon icon={faFire} className="w-5 h-5" />,
      title: "Current Streak",
      value: streaks.current_streak || 0,
      description: "days in a row",
    },
    {
      icon: <FontAwesomeIcon icon={faBullseye} className="w-5 h-5" />,
      title: "Cards Due",
      value: cards_due_today || 0,
      description: "ready to review",
    },
    {
      icon: <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />,
      title: "Mastered",
      value: mastered_cards || 0,
      description: "cards learned",
    },
    {
      icon: <FontAwesomeIcon icon={faClock} className="w-5 h-5" />,
      title: "Study Time",
      value: today.study_time || 0,
      description: "minutes today",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 py-16">
      {/* Logo & Tagline */}
      <div className="text-center mb-12">
        <img src={RevuLogo} alt="Revu Logo" className="w-32 mx-auto mb-4" />
        <p className={`text-xl ${activeTheme.text.muted} max-w-2xl mx-auto`}>
          Study flashcards with intelligent spaced repetition to master any
          subject.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12 ">
        {statCards.map((card, i) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            description={card.description}
            className={`${activeTheme.background.secondary}`}
          />
        ))}
      </div>

      {/* Main CTA */}
      <div className="text-center">
        {(cards_due_today || 0) > 0 ? (
          <button
            onClick={() => navigate("/study")}
            className={`inline-flex items-center justify-center text-xl px-16 py-6 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300
              bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}
              ${activeTheme.gradients.buttonHoverFrom} ${activeTheme.gradients.buttonHoverTo}
              font-semibold tracking-wide`}
          >
            <FontAwesomeIcon icon={faBook} className="w-7 h-7 mr-3" />
            Start Studying ({cards_due_today} due)
          </button>
        ) : (
          <div
            className={`space-y-4 p-8 rounded-xl border border-dashed ${activeTheme.background.secondary} shadow-lg`}
          >
            <div
              className={`text-3xl font-semibold ${activeTheme.text.primary}`}
            >
              🎉 All caught up!
            </div>
            <p className={`${activeTheme.text.muted} text-lg`}>
              No cards are due for review right now. Keep up the great work!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardHero;
