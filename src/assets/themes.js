const themes = {
  classicDefault: { 
    name: "Classic Default",
    bgColor: "bg-gray-100", // Light gray
    textColor: "text-gray-800", // Darker gray for text
    gradientFrom: "from-gray-400", // Neutral gray
    gradientTo: "to-gray-600",   // Darker gray
    buttonHoverFrom: "hover:from-gray-500",
    buttonHoverTo: "hover:to-gray-700",
    buttonRing: "focus:ring-gray-300",
  },
  blushPastel: {
    name: "Blush Pastel",
    bgColor: "bg-pink-50", // Very light pink
    textColor: "text-gray-700", // Soft gray for text
    gradientFrom: "from-pink-300", // Pastel pink
    gradientTo: "to-blue-300",   // Pastel blue
    buttonHoverFrom: "hover:from-pink-400",
    buttonHoverTo: "hover:to-blue-400",
    buttonRing: "focus:ring-pink-200",
  },
  mintDream: {
    name: "Mint Dream",
    bgColor: "bg-teal-50", // Very light teal/mint
    textColor: "text-gray-700",
    gradientFrom: "from-green-300", // Pastel green
    gradientTo: "to-cyan-300",   // Pastel cyan
    buttonHoverFrom: "hover:from-green-400",
    buttonHoverTo: "hover:to-cyan-400",
    buttonRing: "focus:ring-green-200",
  },
  lavenderHaze: {
    name: "Lavender Haze",
    bgColor: "bg-purple-50", // Very light purple
    textColor: "text-gray-700",
    gradientFrom: "from-purple-300", // Pastel purple
    gradientTo: "to-indigo-300",   // Pastel indigo
    buttonHoverFrom: "hover:from-purple-400",
    buttonHoverTo: "hover:to-indigo-400",
    buttonRing: "focus:ring-purple-200",
  }
};

export default themes;