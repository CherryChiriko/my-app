// src/assets/themes.js (UPDATED)
const themes = {
  classicDefault: {
    name: "Classic Default",
    bsBodyBg: "#1a1a1a", // Very dark gray, almost black (renamed from bgColor)
    bsBodyColor: "#e0e0e0", // Light gray for text (renamed from textColor)
    gradientFrom: "#6c5ce7", // Vibrant purple-blue for gradients
    gradientTo: "#00bcd4", // Bright cyan/teal for gradients
    buttonHoverFrom: "#5c4ac7", // Slightly darker purple for button hover
    buttonHoverTo: "#00a8b9", // Slightly darker cyan for button hover
    buttonRing: "#a78bfa", // Lighter purple for focus ring
    activeButtonTextColor: "#ffffff", // White text for active buttons
  },
  blushPastel: {
    name: "Blush Pastel",
    bsBodyBg: "#fff1f2", // Equivalent to bg-pink-50 (renamed from bgColor)
    bsBodyColor: "#374151", // Equivalent to text-gray-700 (renamed from textColor)
    gradientFrom: "#f9a8d4", // Equivalent to from-pink-300
    gradientTo: "#93c5fd", // Equivalent to to-blue-300
    buttonHoverFrom: "#f472b6", // Equivalent to hover:from-pink-400
    buttonHoverTo: "#60a5fa", // Equivalent to hover:to-blue-400
    buttonRing: "#fbcfe8", // Equivalent to focus:ring-pink-200
    activeButtonTextColor: "#ffffff",
  },
  mintDream: {
    name: "Mint Dream",
    bsBodyBg: "#f0fdf4", // Equivalent to bg-teal-50 (renamed from bgColor)
    bsBodyColor: "#374151", // Equivalent to text-gray-700 (renamed from textColor)
    gradientFrom: "#a7f3d0", // Equivalent to from-green-300
    gradientTo: "#67e8f9", // Equivalent to to-cyan-300
    buttonHoverFrom: "#4ade80", // Equivalent to hover:from-green-400
    buttonHoverTo: "#22d3ee", // Equivalent to hover:to-cyan-400
    buttonRing: "#a7f3d0", // Equivalent to focus:ring-green-200
    activeButtonTextColor: "#ffffff",
  },
  lavenderHaze: {
    name: "Lavender Haze",
    bsBodyBg: "#fbf0fe", // Very light purple (renamed from bgColor)
    bsBodyColor: "#374151", // (renamed from textColor)
    gradientFrom: "#d8b4fe", // Pastel purple
    gradientTo: "#a5b4fc", // Pastel indigo
    buttonHoverFrom: "#c084fc",
    buttonHoverTo: "#818cf8",
    buttonRing: "#e9d5ff",
    activeButtonTextColor: "#ffffff",
  },
};

export default themes;
