import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { plans } from "../../data/plans";
import { ModalTemplate } from "../General/ui/ModalTemplate";
import { useUpgradeToPro } from "../../hooks/useUpgradeToPro";

export default function PlansModal({
  activeTheme,
  isOpenOverride,
  onCloseOverride,
}) {
  const profile = useSelector((state) => state.user?.profile);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { startCheckout, openBillingPortal, status } = useUpgradeToPro();

  // Control visibility via passed prop (default to false if omitted)
  const isOpen = isOpenOverride ?? false;

  // Handle plan normalization / current subscription status
  const currentPlanId = profile?.subscription?.plan_id || "free";

  const handleClose = () => {
    onCloseOverride?.();
  };

  const handleSelectPlan = (planId) => {
    // 1. Managing Free / Downgrades -> Billing Portal
    if (planId === "free") {
      if (currentPlanId !== "free") openBillingPortal();
      return;
    }

    // 2. Already Subscribed & selecting a non-lifetime plan -> Billing Portal (to update subscription)
    if (currentPlanId !== "free" && planId !== "lifetime") {
      openBillingPortal();
    } else {
      // 3. New Checkout (from free, or buying lifetime)
      startCheckout(planId, billingCycle);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={handleClose}
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
            const isCurrent = currentPlanId === plan.id;
            const price =
              billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

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
                      ? activeTheme.button.disabled
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
  );
}
