// src/assets/themes.js

/**
 * Tailwind-safe theme generator using class name maps.
 * Includes gradients, text, card, alert, input, and button styles.
 */

const colorShades = {
  gray: {
    bgDark: "bg-gray-900",
    bgLight: "bg-gray-100",
    navbarDark: "bg-gray-800",
    navbarLight: "bg-gray-100",
    cardDark: "bg-gray-800",
    cardLight: "bg-gray-200",
    textPrimaryDark: "text-white",
    textPrimaryLight: "text-gray-800",
    textMutedDark: "text-gray-500",
    textMutedLight: "text-gray-700",
    borderDark: "border-gray-700",
    borderLight: "border-gray-300",
    shadowDark: "rgba(0, 0, 0, 0.4)",
    shadowLight: "rgba(0,0,0,0.1)",
    iconDark: "text-gray-400",
    iconLight: "text-gray-600",
  },
  pink: {
    bgDark: "bg-pink-900",
    bgLight: "bg-pink-100",
    navbarDark: "bg-pink-800",
    navbarLight: "bg-pink-100",
    cardDark: "bg-pink-800",
    cardLight: "bg-pink-200",
    textPrimaryDark: "text-white",
    textPrimaryLight: "text-pink-800",
    textMutedDark: "text-pink-500",
    textMutedLight: "text-pink-700",
    borderDark: "border-pink-700",
    borderLight: "border-pink-300",
    shadowDark: "rgba(255,255,255,0.06)",
    shadowLight: "rgba(0,0,0,0.1)",
    iconDark: "text-pink-400",
    iconLight: "text-pink-600",
  },
  // Add more primaryColor maps here: teal, purple, etc.
};

const gradientClassMap = {
  purple: {
    light: "from-purple-400",
    dark: "from-purple-600",
    hoverLight: "hover:from-purple-500",
    hoverDark: "hover:from-purple-700",
  },
  cyan: {
    light: "to-cyan-400",
    dark: "to-cyan-500",
    hoverLight: "hover:to-cyan-500",
    hoverDark: "hover:to-cyan-600",
  },
  pink: {
    light: "from-pink-400",
    dark: "from-pink-600",
    hoverLight: "hover:from-pink-500",
    hoverDark: "hover:from-pink-700",
  },
  blue: {
    light: "to-blue-400",
    dark: "to-blue-500",
    hoverLight: "hover:to-blue-500",
    hoverDark: "hover:to-blue-600",
  },
  // Add more as needed
};

const makeGradient = (fromColor, toColor, isDark) => ({
  from: gradientClassMap[fromColor][isDark ? "dark" : "light"],
  to: gradientClassMap[toColor][isDark ? "dark" : "light"],
  buttonHoverFrom: gradientClassMap[fromColor][isDark ? "hoverDark" : "hoverLight"],
  buttonHoverTo: gradientClassMap[toColor][isDark ? "hoverDark" : "hoverLight"],
});

const makeStatus = (color, isDark) => ({
  bg: `bg-${color}-500`,
  text: `text-${color}-${isDark ? "400" : "700"}`,
  ringFocus: `focus:ring-${color}-${isDark ? "400" : "300"}`,
  ringInput: `focus:ring-${color}-${isDark ? "500" : "400"}`,
});

const defineTheme = ({
  name,
  isDark,
  primaryColor,
  accentColor1,
  accentColor2,
  successColor,
  warningColor,
  dangerColor,
  infoColor,
}) => {
  const base = colorShades[primaryColor];
  const gradients = makeGradient(accentColor1, accentColor2, isDark);
  const success = makeStatus(successColor, isDark);
  const warning = makeStatus(warningColor, isDark);
  const danger = makeStatus(dangerColor, isDark);
  const info = makeStatus(infoColor, isDark);

  return {
    name,
    isDark,
    background: {
      app: isDark ? base.bgDark : base.bgLight,
      navbar: isDark ? base.navbarDark : base.navbarLight,
      importPage: `bg-gradient-to-br ${isDark ? base.bgDark : base.bgLight} ${isDark ? base.navbarDark : "to-" + primaryColor + "-200"}`,
    },
    gradients,
    text: {
      primary: isDark ? base.textPrimaryDark : base.textPrimaryLight,
      secondary: isDark ? base.textMutedDark : `text-${primaryColor}-600`,
      muted: isDark ? base.textMutedDark : base.textMutedLight,
      activeButton: "text-white",
      foreground: isDark ? `text-${primaryColor}-100` : `text-${primaryColor}-900`,
    },
    ring: {
      focus: info.ringFocus,
      input: info.ringInput,
    },
    border: {
      bottom: isDark ? base.borderDark : base.borderLight,
      dashed: isDark ? `border-${primaryColor}-600` : `border-${primaryColor}-400`,
    },
    shadow: isDark ? base.shadowDark : base.shadowLight,
    card: {
      bg: isDark ? base.cardDark : base.cardLight,
      text: isDark ? base.textPrimaryDark : `text-${primaryColor}-900`,
      description: isDark ? base.textMutedDark : base.textMutedLight,
      tagBg: `bg-${accentColor1}-${isDark ? "700" : "500"}`,
      tagText: "text-white",
      progressBarBg: isDark ? `bg-${accentColor1}-700` : `bg-${accentColor1}-300`,
      mastered: success.bg,
      learning: warning.bg,
      due: danger.bg,
      statusMasteredText: success.text,
      statusLearningText: warning.text,
      statusDueText: danger.text,
      footerText: isDark ? base.textMutedDark : base.textMutedLight,
    },
    input: {
      bg: isDark ? base.cardDark : base.bgLight,
      text: isDark ? base.textPrimaryDark : base.textPrimaryLight,
      placeholder: `placeholder-${primaryColor}-${isDark ? "400" : "500"}`,
    },
    button: {
      secondaryBg: isDark ? `bg-${primaryColor}-700` : `bg-${primaryColor}-300`,
      secondaryHover: isDark ? `hover:bg-${primaryColor}-600` : `hover:bg-${primaryColor}-400`,
      primaryBg: success.bg,
      primaryHover: `hover:bg-${successColor}-${isDark ? "700" : "600"}`,
      studyBg: info.bg,
      studyHover: `hover:bg-${infoColor}-${isDark ? "700" : "600"}`,
      outline: isDark
        ? `border-${primaryColor}-600 text-${primaryColor}-300 hover:bg-${primaryColor}-700`
        : `border-${primaryColor}-400 text-${primaryColor}-800 hover:bg-${primaryColor}-200`,
      default: `${info.bg} hover:bg-${infoColor}-${isDark ? "600" : "700"} text-white`,
      destructive: `${danger.bg} hover:bg-${dangerColor}-${isDark ? "600" : "700"} text-white`,
    },
    icon: {
      default: isDark ? base.iconDark : base.iconLight,
      hover: isDark ? "hover:text-white" : `hover:text-${primaryColor}-800`,
      stepActive: `text-${infoColor}-${isDark ? "500" : "600"}`,
      stepInactive: `text-${primaryColor}-${isDark ? "300" : "400"}`,
    },
    progress: {
      fill: info.bg,
      track: isDark ? `bg-${primaryColor}-700` : `bg-${primaryColor}-300`,
    },
    alert: {
      infoBg: isDark ? `bg-${infoColor}-900/20` : `bg-${infoColor}-100`,
      infoText: isDark ? `text-${infoColor}-200` : `text-${infoColor}-800`,
      warningBg: isDark ? `bg-${warningColor}-900/20` : `bg-${warningColor}-100`,
      warningText: isDark ? `text-${warningColor}-200` : `text-${warningColor}-800`,
    },
  };
};

// Theme list
const themes = {
  classicDefault: defineTheme({
    name: "Classic Default",
    isDark: true,
    primaryColor: "gray",
    accentColor1: "purple",
    accentColor2: "cyan",
    successColor: "green",
    warningColor: "orange",
    dangerColor: "red",
    infoColor: "blue",
  }),
  blushPastel: defineTheme({
    name: "Blush Pastel",
    isDark: false,
    primaryColor: "pink",
    accentColor1: "pink",
    accentColor2: "blue",
    successColor: "green",
    warningColor: "orange",
    dangerColor: "red",
    infoColor: "blue",
  }),
  // Add more here
};

export default themes;
