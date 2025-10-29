const themes = [
  {
    id: "dark",
    name: "Dark Theme",
    isDark: true,
    accent: "text-indigo-400",
    muted: "text-gray-500",

    background: {
      app: "bg-gray-900",
      secondary: "bg-gray-800",
      navbar: "bg-gray-800",
      canvas: "bg-gray-900",
    },

    text: {
      primary: "text-gray-50",
      secondary: "text-gray-300",
      muted: "text-gray-500",
      activeButton: "text-white",
    },

    // New: Link/Navigation Item styling
    link: {
      hoverBg: "hover:bg-gray-700", // Background on hover
      hoverText: "hover:text-white", // Text color on hover
    },

    // New: Focus ring
    ring: {
      focus: "ring-indigo-500", // Focus ring color
    },

    // Components (Buttons, Borders, Gradients)
    button: {
      primary: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
      secondary: "bg-gray-700 hover:bg-gray-600 active:bg-gray-700",
      disabled: "bg-gray-700 text-gray-500 cursor-not-allowed",
    },
    border: {
      card: "border border-gray-700",
      accent: "border-indigo-500",
      bottom: "border-gray-700",
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
    accent: "text-indigo-600",
    muted: "text-gray-400",

    background: {
      app: "bg-gray-50",
      secondary: "bg-white",
      navbar: "bg-white/80",
      canvas: "bg-white",
    },

    text: {
      primary: "text-gray-900",
      secondary: "text-gray-700",
      muted: "text-gray-500",
      activeButton: "text-white",
    },

    // New: Link/Navigation Item styling
    link: {
      hoverBg: "hover:bg-gray-200", // Background on hover
      hoverText: "hover:text-gray-900", // Text color on hover
    },

    // New: Focus ring
    ring: {
      focus: "ring-indigo-600", // Focus ring color
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
      bottom: "border-gray-200",
    },
    gradients: {
      from: "from-indigo-400",
      to: "to-blue-500",
    },
  },
];

export default themes;
