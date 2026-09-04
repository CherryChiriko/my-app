import React, { useState } from "react";
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
import { updateSubscriptionPlan } from "../../../slices/userSlice";
import { SettingCard } from "../../General/ui/SettingCard";
import { ModalTemplate } from "../../General/ui/ModalTemplate";

export function SubscriptionSection({ profile, activeTheme, dispatch, isMobile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [saveState, setSaveState] = useState("idle");
  const subscription = normalizeSubscription(profile);
  const remainingImports = getRemainingImports(profile);

  const handleSelectPlan = async (planId) => {
    setSaveState("saving");
    try {
      await dispatch(updateSubscriptionPlan(planId)).unwrap();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (err) {
      console.error("Plan update failed:", err);
      setSaveState("error");
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
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-lg font-extrabold ${activeTheme.text.primary}`}>
                {subscription.plan.name}
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-500">
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
                <span className={`text-sm font-semibold ${activeTheme.text.primary}`}>
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
                  className="h-full rounded-full bg-emerald-500"
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
        subtitle="Upgrade paths are ready for billing integration."
        activeTheme={activeTheme}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-5">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = subscription.planId === plan.id;
              const price =
                billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

              return (
                <article
                  key={plan.id}
                  className={`rounded-lg border p-4 flex flex-col gap-4 ${
                    plan.highlighted
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : activeTheme.border.card
                  } ${activeTheme.background.canvas}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`text-xl font-extrabold ${activeTheme.text.primary}`}>
                        {plan.name}
                      </h3>
                      <span className="rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                        {plan.badge}
                      </span>
                    </div>
                    <p className={`text-sm ${activeTheme.text.secondary}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div>
                    <span className={`text-3xl font-black ${activeTheme.text.primary}`}>
                      {price}
                    </span>
                    <span className={`text-sm ${activeTheme.text.muted}`}>
                      {" "}
                      / {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="mt-1 text-emerald-500 shrink-0"
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
                    disabled={saveState === "saving" || isCurrent}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      plan.ctaVariant === "primary"
                        ? activeTheme.button.accent2
                        : activeTheme.button.secondary
                    }`}
                  >
                    {isCurrent ? "Current plan" : plan.ctaText}
                  </button>
                </article>
              );
            })}
          </div>

          {saveState === "error" && (
            <p className="text-sm font-semibold text-red-500">
              Could not update your plan. Please try again.
            </p>
          )}
        </div>
      </ModalTemplate>
    </>
  );
}
