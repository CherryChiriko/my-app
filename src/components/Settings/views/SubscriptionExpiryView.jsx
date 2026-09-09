import { useSelector } from "react-redux";
import { selectExpiryStatus } from "../../../slices/userSlice";
import { selectActiveTheme } from "../../../slices/themeSlice";

export function SubscriptionExpiryView({ onManageBilling }) {
  const activeTheme = useSelector(selectActiveTheme);
  const expiry = useSelector(selectExpiryStatus);

  if (expiry.state === "none" || expiry.state === "active") return null;

  const copy = {
    expired: {
      text: "Your Pro subscription has expired. You're back on the Free plan.",
      cta: "Resubscribe",
      tone: activeTheme.background.danger,
    },
    past_due: {
      text: "We couldn't process your last payment. Update your billing to keep Pro.",
      cta: "Update payment",
      tone: activeTheme.background.danger,
    },
    canceling: {
      text: `Your subscription is canceled and ends in ${expiry.daysLeft} day${
        expiry.daysLeft === 1 ? "" : "s"
      }.`,
      cta: "Resubscribe",
      tone: activeTheme.background.warning ?? activeTheme.background.danger,
    },
    renewing_soon: {
      text: `Renews in ${expiry.daysLeft} day${
        expiry.daysLeft === 1 ? "" : "s"
      }.`,
      cta: "Manage billing",
      tone: activeTheme.background.accent2,
    },
  }[expiry.state];

  if (!copy) return null;

  return (
    <div
      className={`rounded-lg px-4 py-3 flex items-center justify-between gap-3 ${copy.tone}`}
    >
      <p className={`text-sm font-semibold ${activeTheme.text.activeButton}`}>
        {copy.text}
      </p>
      <button
        onClick={onManageBilling}
        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold ${activeTheme.button.secondary}`}
      >
        {copy.cta}
      </button>
    </div>
  );
}
