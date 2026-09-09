import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCrown,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { plans } from "../../../data/plans";
import {
  getRemainingImports,
  hasUnlimitedImports,
  normalizeSubscription,
} from "../../../utils/plans";
import { SettingCard } from "../../General/ui/SettingCard";
import { ModalTemplate } from "../../General/ui/ModalTemplate";
import { useUpgradeToPro } from "../../../hooks/useUpgradeToPro";

export function SubscriptionSection({ profile, activeTheme, isMobile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { startCheckout, openBillingPortal, status } = useUpgradeToPro();

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

  const handleSelectPlan = (planId) => {
    // 1. Managing Free / Downgrades -> Billing Portal
    if (planId === "free") {
      if (subscription.planId !== "free") openBillingPortal();
      return;
    }

    // 2. Already Subscribed & selecting a non-lifetime plan -> Billing Portal (to update subscription)
    if (subscription.planId !== "free" && planId !== "lifetime") {
      openBillingPortal();
    } else {
      // 3. New Checkout (from free, or buying lifetime)
      startCheckout(planId, billingCycle);
    }
  };

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
                  className={`h-full rounded-full ${activeTheme.background.accent}`}
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

      <ModalTemplate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Choose a plan"
        subtitle="Upgrade paths are synced live through Stripe."
        activeTheme={activeTheme}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-5">
          {/* Billing Toggle */}
          <div
            className={`inline-flex rounded-lg border ${activeTheme.border.card} ${activeTheme.background.canvas} p-1`}
          >
            {["monthly", "annual"].map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-md px-3 py-1.5 text-sm font-bold capitalize transition-colors ${
                  billingCycle === cycle
                    ? activeTheme.button.accent2
                    : activeTheme.text.secondary
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = subscription.planId === plan.id;
              const price =
                billingCycle === "annual"
                  ? plan.priceAnnual
                  : plan.priceMonthly;

              const periodLabel =
                plan.id === "lifetime"
                  ? "one-time"
                  : billingCycle === "annual"
                  ? "yr"
                  : "mo";

              return (
                <article
                  key={plan.id}
                  className={`rounded-lg border p-4 flex flex-col gap-4 ${
                    plan.highlighted
                      ? `border-2 ${activeTheme.border.accent}`
                      : activeTheme.border.card
                  } ${activeTheme.background.canvas}`}
                >
                  <div className="mt-2 h-16">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={`text-xl font-extrabold ${activeTheme.text.primary}`}
                      >
                        {plan.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${activeTheme.text.secondary} ${activeTheme.background.track}`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                    <p className={`text-xs ${activeTheme.text.secondary}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`text-3xl font-black ${activeTheme.text.primary}`}
                    >
                      {price}
                    </span>
                    <span className={`text-sm ${activeTheme.text.muted}`}>
                      {" "}
                      / {periodLabel}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={`mt-0.5 shrink-0 ${activeTheme.text.ok}`}
                        />
                        <span className={activeTheme.text.secondary}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={status === "redirecting" || isCurrent}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      isCurrent
                        ? activeTheme.button.muted
                        : activeTheme.button[plan.ctaVariant] ||
                          activeTheme.button.primary
                    }`}
                  >
                    {status === "redirecting"
                      ? "Redirecting..."
                      : isCurrent
                      ? "Current plan"
                      : plan.ctaText}
                  </button>
                </article>
              );
            })}
          </div>

          {status === "error" && (
            <p className={`text-sm font-bold ${activeTheme.text.danger}`}>
              Could not complete checkout session. Please try again.
            </p>
          )}
        </div>
      </ModalTemplate>
    </>
  );
}
