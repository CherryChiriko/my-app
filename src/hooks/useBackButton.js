import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener("backButton", ({ canGoBack }) => {
      // If we are on the root/dashboard page, minimize or exit the app
      if (location.pathname === "/" || location.pathname === "/login") {
        App.minimizeApp();
      } else {
        // Otherwise, navigate back in browser history
        navigate(-1);
      }
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, [navigate, location.pathname]);
}
