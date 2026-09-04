import { DEFAULT_PLAN_ID, plans } from "../data/plans";

export const getPlanById = (planId) =>
  plans.find((plan) => plan.id === planId) ??
  plans.find((plan) => plan.id === DEFAULT_PLAN_ID);

export const getCurrentBillingMonth = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const normalizeSubscription = (profile) => {
  const plan = getPlanById(profile?.plan_id);
  const currentMonth = getCurrentBillingMonth();
  const usageMonth =
    profile?.import_usage_month && profile.import_usage_month === currentMonth
      ? profile.import_usage_month
      : currentMonth;

  return {
    plan,
    planId: plan.id,
    status: profile?.subscription_status ?? "active",
    importUsageMonth: usageMonth,
    importedCardsThisMonth:
      profile?.import_usage_month === currentMonth
        ? Number(profile?.imported_cards_this_month ?? 0)
        : 0,
  };
};

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
