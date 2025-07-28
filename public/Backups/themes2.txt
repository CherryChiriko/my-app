// src/assets/themes.js (REVERTED TO TAILWIND CLASS NAMES)
const themes = {
  classicDefault: {
    name: "Classic Default",
    bgColor: "bg-gray-900", // Dark background for navbar and app
    textColor: "text-gray-100", // Light text
    gradientFrom: "from-purple-600", // Vibrant purple for gradients
    gradientTo: "to-cyan-500", // Bright cyan for gradients
    buttonHoverFrom: "hover:from-purple-700",
    buttonHoverTo: "hover:to-cyan-600",
    buttonRing: "focus:ring-purple-400",
    activeButtonTextColor: "text-white", // White text for active buttons
  },
  blushPastel: {
    name: "Blush Pastel",
    bgColor: "bg-pink-50", // Very light pink
    textColor: "text-gray-700", // Soft gray for text
    gradientFrom: "from-pink-300", // Pastel pink
    gradientTo: "to-blue-300", // Pastel blue
    buttonHoverFrom: "hover:from-pink-400",
    buttonHoverTo: "hover:to-blue-400",
    buttonRing: "focus:ring-pink-200",
    activeButtonTextColor: "text-white",
  },
  mintDream: {
    name: "Mint Dream",
    bgColor: "bg-teal-50", // Very light teal/mint
    textColor: "text-gray-700",
    gradientFrom: "from-green-300", // Pastel green
    gradientTo: "to-cyan-300", // Pastel cyan
    buttonHoverFrom: "hover:from-green-400",
    buttonHoverTo: "hover:to-cyan-400",
    buttonRing: "focus:ring-green-200",
    activeButtonTextColor: "text-white",
  },
  lavenderHaze: {
    name: "Lavender Haze",
    bgColor: "bg-purple-50", // Very light purple
    textColor: "text-gray-700",
    gradientFrom: "from-purple-300", // Pastel purple
    gradientTo: "to-indigo-300", // Pastel indigo
    buttonHoverFrom: "hover:from-purple-400",
    buttonHoverTo: "hover:to-indigo-400",
    buttonRing: "focus:ring-purple-200",
    activeButtonTextColor: "text-white",
  },
};

export default themes;
