import type { CapacitorConfig } from "@capacitor/cli";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: CapacitorConfig = {
  appId: "com.chiriko747.revu",
  appName: "Revu",
  webDir: "build", // or 'dist' if using Vite
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
