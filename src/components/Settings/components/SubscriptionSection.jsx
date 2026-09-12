import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import {
  getRemainingImports,
  hasUnlimitedImports,
  normalizeSubscription,
} from "../../../utils/plans";
import { SettingCard } from "../../General/ui/SettingCard";
import PlansModal from "../../Paywall/PlansModal";

export function SubscriptionSection({ profile, activeTheme, isMobile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const subscription = normalizeSubscription(profile);
  const remainingImports = getRemainingImports(profile);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user just returned from successful Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("checkout") === "success" && profile?.id) {
      dispatch(fetchUserProfile(profile.id));
    }
  }, [dispatch, profile?.id]);

  return (
    <>
      <SettingCard
        icon={faCrown}
        title="Plan"
        activeTheme={activeTheme}
        onSave={() => setIsModalOpen(true)}
        saveState="idle"
        saveLabel="View plans"
        isMobile={isMobile}
        isSettings={true}
      >
        <div className="space-y-4 text-left">
          <div>
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${activeTheme.text.muted}`}
            >
              Current plan
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span
                className={`text-lg font-extrabold ${activeTheme.text.primary}`}
              >
                {subscription.plan.name}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  activeTheme.text.activeButton
                } ${
                  subscription.status === "active"
                    ? activeTheme.background.accent2
                    : activeTheme.background.danger
                }`}
              >
                {subscription.status}
              </span>
            </div>
          </div>

          <div
            className={`rounded-lg border ${activeTheme.border.card} ${activeTheme.background.canvas} p-3`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FontAwesomeIcon
                  icon={faGaugeHigh}
                  className={`${activeTheme.text.muted} shrink-0`}
                />
                <span
                  className={`text-sm font-semibold ${activeTheme.text.primary}`}
                >
                  Monthly imports
                </span>
              </div>
              <span className={`text-sm font-bold ${activeTheme.text.primary}`}>
                {hasUnlimitedImports(subscription.plan)
                  ? "Unlimited"
                  : `${remainingImports} left`}
              </span>
            </div>
            {!hasUnlimitedImports(subscription.plan) && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-500/20">
                <div
                  className={`h-full rounded-full ${activeTheme.background.accent1}`}
                  style={{
                    width: `${Math.min(
                      100,
                      (subscription.importedCardsThisMonth /
                        subscription.plan.importLimit) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </SettingCard>

      <PlansModal
        isOpenOverride={isModalOpen}
        onCloseOverride={() => setIsModalOpen(false)}
        activeTheme={activeTheme}
      />
    </>
  );
}
