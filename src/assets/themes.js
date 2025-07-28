// src/assets/themes.js (Further UPDATED with ImportPage colors)
const themes = {
  classicDefault: {
    name: "Classic Default",
    // General App Colors
    background: {
      app: "bg-gray-900", // Main app background (darker than card)
      navbar: "bg-gray-800", // Navbar background
      importPage: "bg-gradient-to-br from-gray-900 to-gray-800", // Gradient for ImportPage background
    },
    text: {
      primary: "text-white", // Main app text color
      secondary: "text-gray-400", // Description text, icons
      muted: "text-gray-500", // Card footer text, muted text in import
      activeButton: "text-white", // Text color for active/gradient buttons
      foreground: "text-gray-100", // General foreground text
    },
    gradients: {
      from: "from-purple-600",
      to: "to-cyan-500",
      buttonHoverFrom: "hover:from-purple-700",
      buttonHoverTo: "hover:to-cyan-600",
    },
    ring: {
      focus: "focus:ring-purple-400", // General focus ring
      input: "focus:ring-purple-500", // Input focus ring
    },
    border: {
      bottom: "border-gray-700", // Navbar bottom border
      dashed: "border-gray-600", // Dashed border for file upload
    },
    shadow: "rgba(255, 255, 255, 0.06)",

    // Component Specific Colors (DeckManager)
    card: {
      bg: "bg-gray-800",
      text: "text-white",
      description: "text-gray-400",
      tagBg: "bg-purple-700",
      tagText: "text-white",
      progressBarBg: "bg-gray-700",
      mastered: "bg-green-500",
      learning: "bg-orange-500",
      due: "bg-red-500",
      statusMasteredText: "text-green-400",
      statusLearningText: "text-orange-400",
      statusDueText: "text-red-400",
      footerText: "text-gray-500",
    },
    input: {
      bg: "bg-gray-800",
      text: "text-white",
      placeholder: "placeholder-gray-400",
    },
    button: {
      secondaryBg: "bg-gray-700",
      secondaryHover: "hover:bg-gray-600",
      primaryBg: "bg-green-600",
      primaryHover: "hover:bg-green-700",
      studyBg: "bg-blue-600",
      studyHover: "hover:bg-blue-700",
      // ImportPage specific buttons
      outline: "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
      default: "bg-blue-500 hover:bg-blue-600 text-white", // For step circles and next buttons
      destructive: "bg-red-500 hover:bg-red-600 text-white", // For error toasts
    },
    icon: {
      default: "text-gray-400",
      hover: "hover:text-white",
      stepActive: "text-blue-500", // For active step icon
      stepInactive: "text-gray-300", // For inactive step arrow
    },
    progress: {
      fill: "bg-blue-500", // Progress bar fill color
      track: "bg-gray-200", // Progress bar track color
    },
    alert: {
      infoBg: "bg-blue-50 dark:bg-blue-900/20",
      infoText: "text-blue-700 dark:text-blue-200",
      warningBg: "bg-yellow-50 dark:bg-yellow-900/20",
      warningText: "text-yellow-700 dark:text-yellow-200",
    },
  },
  blushPastel: {
    name: "Blush Pastel",
    background: {
      app: "bg-pink-50",
      navbar: "bg-pink-50",
      importPage: "bg-gradient-to-br from-pink-50 to-purple-100",
    },
    text: {
      primary: "text-gray-700",
      secondary: "text-gray-500",
      muted: "text-gray-600",
      activeButton: "text-white",
      foreground: "text-gray-800",
    },
    gradients: {
      from: "from-pink-300",
      to: "to-blue-300",
      buttonHoverFrom: "hover:from-pink-400",
      buttonHoverTo: "hover:to-blue-400",
    },
    ring: {
      focus: "focus:ring-pink-200",
      input: "focus:ring-pink-300",
    },
    border: {
      bottom: "border-pink-200",
      dashed: "border-pink-300",
    },
    shadow: "rgba(255, 255, 255, 0.06)",
    card: {
      bg: "bg-pink-100",
      text: "text-gray-800",
      description: "text-gray-500",
      tagBg: "bg-pink-400",
      tagText: "text-white",
      progressBarBg: "bg-pink-200",
      mastered: "bg-green-500",
      learning: "bg-orange-500",
      due: "bg-red-500",
      statusMasteredText: "text-green-600",
      statusLearningText: "text-orange-600",
      statusDueText: "text-red-600",
      footerText: "text-gray-600",
    },
    input: {
      bg: "bg-pink-100",
      text: "text-gray-800",
      placeholder: "placeholder-gray-400",
    },
    button: {
      secondaryBg: "bg-pink-200",
      secondaryHover: "hover:bg-pink-300",
      primaryBg: "bg-blue-400",
      primaryHover: "hover:bg-blue-500",
      studyBg: "bg-purple-400",
      studyHover: "hover:bg-purple-500",
      outline: "border-gray-300 text-gray-700 hover:bg-gray-100",
      default: "bg-blue-400 hover:bg-blue-500 text-white",
      destructive: "bg-red-500 hover:bg-red-600 text-white",
    },
    icon: {
      default: "text-gray-500",
      hover: "hover:text-gray-700",
      stepActive: "text-blue-500",
      stepInactive: "text-gray-300",
    },
    progress: {
      fill: "bg-blue-400",
      track: "bg-pink-200",
    },
    alert: {
      infoBg: "bg-blue-50",
      infoText: "text-blue-700",
      warningBg: "bg-yellow-50",
      warningText: "text-yellow-700",
    },
  },
  mintDream: {
    name: "Mint Dream",
    background: {
      app: "bg-teal-50",
      navbar: "bg-teal-50",
      importPage: "bg-gradient-to-br from-teal-50 to-emerald-100",
    },
    text: {
      primary: "text-gray-700",
      secondary: "text-gray-500",
      muted: "text-gray-600",
      activeButton: "text-white",
      foreground: "text-gray-800",
    },
    gradients: {
      from: "from-green-300",
      to: "to-cyan-300",
      buttonHoverFrom: "hover:from-green-400",
      buttonHoverTo: "hover:to-cyan-400",
    },
    ring: {
      focus: "focus:ring-green-200",
      input: "focus:ring-green-300",
    },
    border: {
      bottom: "border-teal-200",
      dashed: "border-teal-300",
    },
    shadow: "rgba(255, 255, 255, 0.06)",
    card: {
      bg: "bg-teal-100",
      text: "text-gray-800",
      description: "text-gray-500",
      tagBg: "bg-green-400",
      tagText: "text-white",
      progressBarBg: "bg-teal-200",
      mastered: "bg-green-500",
      learning: "bg-orange-500",
      due: "bg-red-500",
      statusMasteredText: "text-green-600",
      statusLearningText: "text-orange-600",
      statusDueText: "text-red-600",
      footerText: "text-gray-600",
    },
    input: {
      bg: "bg-teal-100",
      text: "text-gray-800",
      placeholder: "placeholder-gray-400",
    },
    button: {
      secondaryBg: "bg-teal-200",
      secondaryHover: "hover:bg-teal-300",
      primaryBg: "bg-cyan-400",
      primaryHover: "hover:bg-cyan-500",
      studyBg: "bg-emerald-400",
      studyHover: "hover:bg-emerald-500",
      outline: "border-gray-300 text-gray-700 hover:bg-gray-100",
      default: "bg-emerald-500 hover:bg-emerald-600 text-white",
      destructive: "bg-red-500 hover:bg-red-600 text-white",
    },
    icon: {
      default: "text-gray-500",
      hover: "hover:text-gray-700",
      stepActive: "text-emerald-500",
      stepInactive: "text-gray-300",
    },
    progress: {
      fill: "bg-emerald-500",
      track: "bg-teal-200",
    },
    alert: {
      infoBg: "bg-blue-50",
      infoText: "text-blue-700",
      warningBg: "bg-yellow-50",
      warningText: "text-yellow-700",
    },
  },
  lavenderHaze: {
    name: "Lavender Haze",
    background: {
      app: "bg-purple-50",
      navbar: "bg-purple-50",
      importPage: "bg-gradient-to-br from-purple-50 to-indigo-100",
    },
    text: {
      primary: "text-gray-700",
      secondary: "text-gray-500",
      muted: "text-gray-600",
      activeButton: "text-white",
      foreground: "text-gray-800",
    },
    gradients: {
      from: "from-purple-300",
      to: "to-indigo-300",
      buttonHoverFrom: "hover:from-purple-400",
      buttonHoverTo: "hover:to-indigo-400",
    },
    ring: {
      focus: "focus:ring-purple-200",
      input: "focus:ring-purple-300",
    },
    border: {
      bottom: "border-purple-200",
      dashed: "border-purple-300",
    },
    shadow: "rgba(255, 255, 255, 0.06)",
    card: {
      bg: "bg-purple-100",
      text: "text-gray-800",
      description: "text-gray-500",
      tagBg: "bg-purple-400",
      tagText: "text-white",
      progressBarBg: "bg-purple-200",
      mastered: "bg-green-500",
      learning: "bg-orange-500",
      due: "bg-red-500",
      statusMasteredText: "text-green-600",
      statusLearningText: "text-orange-600",
      statusDueText: "text-red-600",
      footerText: "text-gray-600",
    },
    input: {
      bg: "bg-purple-100",
      text: "text-gray-800",
      placeholder: "placeholder-gray-400",
    },
    button: {
      secondaryBg: "bg-purple-200",
      secondaryHover: "hover:bg-purple-300",
      primaryBg: "bg-indigo-400",
      primaryHover: "hover:bg-indigo-500",
      studyBg: "bg-blue-400",
      studyHover: "hover:bg-blue-500",
      outline: "border-gray-300 text-gray-700 hover:bg-gray-100",
      default: "bg-indigo-500 hover:bg-indigo-600 text-white",
      destructive: "bg-red-500 hover:bg-red-600 text-white",
    },
    icon: {
      default: "text-gray-500",
      hover: "hover:text-gray-700",
      stepActive: "text-indigo-500",
      stepInactive: "text-gray-300",
    },
    progress: {
      fill: "bg-indigo-500",
      track: "bg-purple-200",
    },
    alert: {
      infoBg: "bg-blue-50",
      infoText: "text-blue-700",
      warningBg: "bg-yellow-50",
      warningText: "text-yellow-700",
    },
  },
};

export default themes;
