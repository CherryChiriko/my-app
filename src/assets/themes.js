// Base shades for main themes
const colorShades = {
  gray: {
    bgDark: "bg-gray-900",
    bgLight: "bg-gray-100",
    navbarDark: "bg-gray-800",
    navbarLight: "bg-gray-100",
    cardDark: "bg-gray-800",
    cardLight: "bg-gray-200",
    textDark: "text-white",
    textLight: "text-gray-800",
    textMutedDark: "text-gray-400",
    textMutedLight: "text-gray-600",
    borderDark: "border-gray-700",
    borderLight: "border-gray-300",
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
    textDark: "text-white",
    textLight: "text-pink-800",
    textMutedDark: "text-pink-300",
    textMutedLight: "text-pink-600",
    borderDark: "border-pink-700",
    borderLight: "border-pink-300",
    iconDark: "text-pink-400",
    iconLight: "text-pink-600",
  },
  blue: {
    bgDark: "bg-blue-900",
    bgLight: "bg-blue-100",
    navbarDark: "bg-blue-800",
    navbarLight: "bg-blue-100",
    cardDark: "bg-blue-800",
    cardLight: "bg-blue-200",
    textDark: "text-white",
    textLight: "text-blue-800",
    textMutedDark: "text-blue-300",
    textMutedLight: "text-blue-600",
    borderDark: "border-blue-700",
    borderLight: "border-blue-300",
    iconDark: "text-blue-400",
    iconLight: "text-blue-600",
  },
  purple: {
    bgDark: "bg-purple-900",
    bgLight: "bg-purple-100",
    navbarDark: "bg-purple-800",
    navbarLight: "bg-purple-100",
    cardDark: "bg-purple-800",
    cardLight: "bg-purple-200",
    textDark: "text-white",
    textLight: "text-purple-800",
    textMutedDark: "text-purple-300",
    textMutedLight: "text-purple-600",
    borderDark: "border-purple-700",
    borderLight: "border-purple-300",
    iconDark: "text-purple-400",
    iconLight: "text-purple-600",
  },
  cyan: {
    bgDark: "bg-cyan-900",
    bgLight: "bg-cyan-100",
    navbarDark: "bg-cyan-800",
    navbarLight: "bg-cyan-100",
    cardDark: "bg-cyan-800",
    cardLight: "bg-cyan-200",
    textDark: "text-white",
    textLight: "text-cyan-800",
    textMutedDark: "text-cyan-300",
    textMutedLight: "text-cyan-600",
    borderDark: "border-cyan-700",
    borderLight: "border-cyan-300",
    iconDark: "text-cyan-400",
    iconLight: "text-cyan-600",
  },
};

// Status colors (success, warning, danger, info)
const statusColors = {
  green: {
    bg: "bg-green-500",
    text: "text-green-700",
    ring: "focus:ring-green-400",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-700",
    ring: "focus:ring-orange-400",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-700",
    ring: "focus:ring-red-400",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-700",
    ring: "focus:ring-blue-400",
  },
};

// Gradient helpers
const makeGradient = (from, to) => ({
  from: `from-${from}-400`,
  to: `to-${to}-400`,
  hoverFrom: `hover:from-${from}-500`,
  hoverTo: `hover:to-${to}-500`,
});

// Theme factory
const defineTheme = ({
  name,
  isDark,
  primaryColor,
  accentFrom,
  accentTo,
  successColor,
  warningColor,
  dangerColor,
  infoColor,
}) => {
  const base = colorShades[primaryColor];
  const gradients = makeGradient(accentFrom, accentTo);

  return {
    name,
    isDark,
    background: {
      app: isDark ? base.bgDark : base.bgLight,
      navbar: isDark ? base.navbarDark : base.navbarLight,
    },
    card: {
      bg: isDark ? base.cardDark : base.cardLight,
      text: isDark ? base.textDark : base.textLight,
      description: isDark ? base.textMutedDark : base.textMutedLight,
    },
    text: {
      primary: isDark ? base.textDark : base.textLight,
      muted: isDark ? base.textMutedDark : base.textMutedLight,
      activeButton: "text-white",
    },
    gradients,
    status: {
      success: statusColors[successColor],
      warning: statusColors[warningColor],
      danger: statusColors[dangerColor],
      info: statusColors[infoColor],
    },
    button: {
      primary: `bg-${primaryColor}-500 hover:bg-${primaryColor}-600 text-white`,
      secondary: `bg-${accentFrom}-500 hover:bg-${accentFrom}-600 text-white`,
      destructive: `bg-${dangerColor}-500 hover:bg-${dangerColor}-600 text-white`,
    },
  };
};

// Actual theme list
const themes = {
  classicDark: defineTheme({
    name: "Classic Dark",
    isDark: true,
    primaryColor: "gray",
    accentFrom: "blue",
    accentTo: "cyan",
    successColor: "green",
    warningColor: "orange",
    dangerColor: "red",
    infoColor: "blue",
  }),
  blushPastel: defineTheme({
    name: "Blush Pastel",
    isDark: false,
    primaryColor: "pink",
    accentFrom: "purple",
    accentTo: "cyan",
    successColor: "green",
    warningColor: "orange",
    dangerColor: "red",
    infoColor: "blue",
  }),
};

export default themes;
