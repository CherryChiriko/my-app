import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { AvatarSection } from "./components/AvatarSection";
import { StudyLimitsSection } from "./components/StudyLimitsSection";
import { ThemeSection } from "./components/ThemeSection";
import { StudyFlowSection } from "./components/StudyFlowSection";
import { DisplaySection } from "./components/DisplaySection";
import { AccountSection } from "./components/AccountSection";
import { SubscriptionSection } from "./components/SubscriptionSection";
import { isDemoModeEnabled } from "../../utils/demoMode";

import { SubscriptionExpiryView } from "./views/SubscriptionExpiryView";
import { useUpgradeToPro } from "../../hooks/useUpgradeToPro";

import { useSelector } from "react-redux";
import { selectExpiryStatus } from "../../slices/userSlice";

export function SettingsPage({
  profile,
  settings,
  activeTheme,
  allThemes,
  currentThemeName,
  dispatch,
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isDemo = isDemoModeEnabled();
  const { startCheckout, openBillingPortal } = useUpgradeToPro();
  const expiry = useSelector(selectExpiryStatus);

  const handleManageBilling = () => {
    if (expiry.state === "expired") {
      startCheckout("pro", "monthly"); // or open the plans modal instead
    } else {
      openBillingPortal();
    }
  };

  return (
    <>
      {/* ── Row 3: Avatar · Account · Theme ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {!isDemo && (
          <>
            <AccountSection
              profile={profile}
              activeTheme={activeTheme}
              dispatch={dispatch}
              isMobile={isMobile}
            />

            <SubscriptionSection
              profile={profile}
              activeTheme={activeTheme}
              dispatch={dispatch}
              isMobile={isMobile}
            />
            <AvatarSection
              profile={profile}
              settings={settings}
              activeTheme={activeTheme}
              dispatch={dispatch}
              isMobile={isMobile}
            />
          </>
        )}

        <ThemeSection
          activeTheme={activeTheme}
          allThemes={allThemes}
          currentThemeName={currentThemeName}
          dispatch={dispatch}
          isMobile={isMobile}
        />
      </div>

      {/* ── Row 4: Heatmap · Study flow · Display ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudyLimitsSection
          profile={profile}
          settings={settings}
          activeTheme={activeTheme}
          dispatch={dispatch}
          isMobile={isMobile}
        />
        <StudyFlowSection
          settings={settings}
          activeTheme={activeTheme}
          dispatch={dispatch}
          isMobile={isMobile}
        />
        <DisplaySection
          profile={profile}
          settings={settings}
          activeTheme={activeTheme}
          dispatch={dispatch}
          isMobile={isMobile}
        />
      </div>

      <SubscriptionExpiryView onManageBilling={handleManageBilling} />
    </>
  );
}

export function SettingsAccountPage({ profile, activeTheme, dispatch }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <button
          onClick={handleBack}
          aria-label="Go back"
          className={`
                        mt-0.5 px-3 shrink-0 flex items-center justify-center
                        ${activeTheme.text.muted}
                      `}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs px-2" /> Back
        </button>
      </div>
    </div>
  );
}
