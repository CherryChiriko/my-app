// src/components/PaywallModal.jsx
import React from "react";
import { createPortal } from "react-dom";

export default function PaywallModal({
  isOpen,
  onClose,
  onUpgrade,
  title,
  description,
  badgeText,
  activeTheme,
}) {
  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onClose();
  };

  const handleUpgradeClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    console.log("Handle Upgrade Clicked");
    onUpgrade();
  };

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${activeTheme.background.card} ${activeTheme.border.secondary} border rounded-2xl p-6 max-w-md w-full shadow-2xl relative`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className={`absolute top-4 right-4 ${activeTheme.text.muted} ${activeTheme.link.hoverText} transition-colors`}
        >
          ✕
        </button>

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${activeTheme.text.warning} bg-amber-500/10 mb-4`}
        >
          ✨ {badgeText || "PRO FEATURE"}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold ${activeTheme.text.primary} mb-2`}>
          {title || "Unlock Unlimited Character Practice"}
        </h3>

        {/* Description */}
        <p
          className={`${activeTheme.text.secondary} text-sm leading-relaxed mb-6`}
        >
          {description ||
            "Free plans include 1 Character Practice session per day with up to 5 characters per batch. Upgrade to Pro for unlimited daily sessions and custom batch sizes!"}
        </p>

        {/* Feature List Box */}
        <div
          className={`${
            activeTheme.background.secondary || activeTheme.background.light
          } border ${
            activeTheme.border.muted
          } rounded-xl p-4 mb-6 space-y-2.5 text-xs ${
            activeTheme.text.secondary
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`${activeTheme.text.ok} font-bold`}>✓</span>
            <span>Unlimited daily Character Practice sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${activeTheme.text.ok} font-bold`}>✓</span>
            <span>Custom batch sizes (up to 30+ characters per batch)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${activeTheme.text.ok} font-bold`}>✓</span>
            <span>Full mastery tracking & analytics</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleUpgradeClick}
            className={`w-full py-3 px-4 ${activeTheme.button.primary} ${activeTheme.text.activeButton} font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm`}
          >
            Upgrade to Pro
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`w-full py-2.5 px-4 bg-transparent ${activeTheme.text.muted} ${activeTheme.link.hoverText} font-medium text-xs transition-colors`}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
