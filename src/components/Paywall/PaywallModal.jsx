// src/components/PaywallModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function PaywallModal({
  isOpen,
  onClose,
  title,
  description,
  badgeText,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onClose();
  };

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ✕
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 mb-4">
          ✨ {badgeText || "PRO FEATURE"}
        </div>

        {/* Header */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title || "Unlock Unlimited Character Practice"}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          {description ||
            "Free plans include 1 Character Practice session per day with up to 5 characters per batch. Upgrade to Pro for unlimited daily sessions and custom batch sizes!"}
        </p>

        {/* Benefits List */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Unlimited daily Character Practice sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Custom batch sizes (up to 30+ characters per batch)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Full mastery tracking & analytics</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              navigate("/settings/billing");
            }}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
          >
            Upgrade to Pro
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2.5 px-4 bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium text-xs transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
