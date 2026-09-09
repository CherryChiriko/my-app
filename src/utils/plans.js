import { DEFAULT_PLAN_ID, plans } from "../data/plans";

export const getPlanById = (planId) =>
  plans.find((plan) => plan.id === planId) ??
  plans.find((plan) => plan.id === DEFAULT_PLAN_ID);

export const getCurrentBillingMonth = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export function normalizeSubscription(profile) {
  if (!profile) {
    return {
      planId: "free",
      status: "active",
      plan: plans.find((p) => p.id === "free") || { name: "Free" },
      importedCardsThisMonth: 0,
    };
  }

  // 🔑 Match database field 'plan_tier'
  const rawPlanId = profile.plan_tier || profile.subscription_tier || "free";
  const planId = rawPlanId.toLowerCase();

  // Find corresponding plan config from plans data array
  const matchedPlan = plans.find((p) => p.id === planId) || plans[0];

  return {
    planId,
    status: profile.subscription_status || "active",
    plan: matchedPlan,
    importedCardsThisMonth: profile.imported_cards_this_month || 0,
    importUsageMonth: profile.import_usage_month || null,
  };
}

export const hasUnlimitedImports = (plan) => plan?.importLimit === Infinity;

export const getRemainingImports = (profile) => {
  const subscription = normalizeSubscription(profile);
  if (hasUnlimitedImports(subscription.plan)) return Infinity;
  return Math.max(
    0,
    subscription.plan.importLimit - subscription.importedCardsThisMonth,
  );
};

export const getImportLimitMessage = (profile, requestedCount) => {
  const subscription = normalizeSubscription(profile);
  if (hasUnlimitedImports(subscription.plan)) return null;

  const remaining = getRemainingImports(profile);
  if (requestedCount <= remaining) return null;

  return `Free imports are limited to ${subscription.plan.importLimit} cards per month. You have ${remaining} remaining for ${subscription.importUsageMonth}.`;
};

export function getExpiryStatus(profile) {
  if (
    !profile ||
    profile.plan_id === "free" ||
    profile.plan_id === "lifetime"
  ) {
    return { state: "none" };
  }

  const periodEnd = profile.pro_current_period_end
    ? new Date(profile.pro_current_period_end)
    : null;

  if (profile.subscription_status === "expired") {
    return { state: "expired" };
  }

  if (profile.subscription_status === "past_due") {
    return { state: "past_due", periodEnd };
  }

  if (!periodEnd) return { state: "none" };

  const daysLeft = Math.ceil((periodEnd - new Date()) / (1000 * 60 * 60 * 24));

  if (profile.pro_cancel_at_period_end) {
    return { state: "canceling", daysLeft, periodEnd };
  }
  if (daysLeft <= 7) {
    return { state: "renewing_soon", daysLeft, periodEnd };
  }
  return { state: "active", daysLeft, periodEnd };
}
