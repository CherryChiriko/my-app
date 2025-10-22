const themes = [
  {
    id: "dark",
    name: "Dark Theme",
    isDark: true,
    accent: "text-indigo-400", // Used for main focus/links
    muted: "text-gray-500", // Used for secondary text/icons

    // Backgrounds
    background: {
      app: "bg-gray-900", // Overall application background
      secondary: "bg-gray-800", // Secondary background
    },

    // Text
    text: {
      primary: "text-gray-50", // Main text color
      secondary: "text-gray-300", // Subheadings/less important text
      muted: "text-gray-500", // Muted text color
      activeButton: "text-white", // Text color on primary buttons
    },

    // Components (Buttons, Borders, Gradients)
    button: {
      primary: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
      secondary: "bg-gray-700 hover:bg-gray-600 active:bg-gray-700",
      disabled: "bg-gray-700 text-gray-500 cursor-not-allowed",
    },
    border: {
      card: "border border-gray-700",
      dashed: "border-dashed border-gray-700",
      accent: "border-indigo-500",
    },
    gradients: {
      from: "from-indigo-500",
      to: "to-purple-500",
    },
  },
  {
    id: "light",
    name: "Light Theme",
    isDark: false,
    accent: "text-indigo-600", // Used for main focus/links
    muted: "text-gray-400", // Used for secondary text/icons

    // Backgrounds
    background: {
      app: "bg-gray-50", // Overall application background
      secondary: "bg-white", // Secondary background
    },

    // Text
    text: {
      primary: "text-gray-900", // Main text color
      secondary: "text-gray-700", // Subheadings/less important text
      muted: "text-gray-500", // Muted text color
      activeButton: "text-white", // Text color on primary buttons
    },

    // Components (Buttons, Borders, Gradients)
    button: {
      primary: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700",
      secondary:
        "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800",
      disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
    },
    border: {
      card: "border border-gray-200",
      dashed: "border-dashed border-gray-300",
      accent: "border-indigo-500",
    },
    gradients: {
      from: "from-indigo-400",
      to: "to-blue-500",
    },
  },
];

export default themes;
