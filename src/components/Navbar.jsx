import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice";
import { selectCurrentView } from "../features/navigationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGear,
  faBook,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { TbCardsFilled } from "react-icons/tb";
import RevuLogo from "../assets/Revu_logo.png";

const Navbar = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const currentView = useSelector(selectCurrentView);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faHouse} />,
      path: "/",
    },
    {
      id: "decks",
      label: "Decks",
      icon: <TbCardsFilled />,
      path: "/decks",
    },
    {
      id: "study",
      label: "Study",
      icon: <FontAwesomeIcon icon={faBook} />,
      path: "/study",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      path: "/settings",
    },
  ];

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = currentView === item.id;

    // Base styles for the button-like appearance
    const baseButtonClasses = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                               ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                               ${
                                 activeTheme.buttonRing || "focus:ring-ring"
                               } disabled:pointer-events-none disabled:opacity-50`;
    // Added a fallback for buttonRing if it's undefined in theme

    // Size variations
    const sizeClasses = isMobile
      ? "h-10 px-4 py-2 text-base"
      : "h-9 rounded-md px-3";

    // Variant variations (active and ghost)
    const variantClasses = isActive
      ? `${activeTheme.buttonHoverFrom || "from-blue-600"} ${
          activeTheme.buttonHoverTo || "to-purple-600"
        } text-primary-foreground` // Active state uses theme gradient or default
      : `hover:bg-accent hover:text-accent-foreground`; // Inactive (ghost) button hover

    return (
      <Link
        to={item.path}
        onClick={() => {
          // This onClick is for side effects, like closing mobile menu
          if (isMobile) setIsMenuOpen(false);
        }}
        // Apply dynamic classes to the Link component itself
        className={`${baseButtonClasses} ${sizeClasses} ${variantClasses}
                   flex items-center gap-2 ${
                     isMobile ? "w-full justify-start" : ""
                   }
                   ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                   transition-all duration-200 hover:scale-105`}
        style={{ color: isActive ? "inherit" : activeTheme.textColor }}
      >
        {/* Correct way to render the icon and add class */}
        {React.cloneElement(item.icon, {
          className: `${item.icon.props.className || ""} w-4 h-4`,
          // You might also want to dynamically set icon color here based on isActive or theme
          // style: { color: isActive ? 'currentcolor' : activeTheme.textColor }
        })}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`hidden md:flex items-center justify-between p-4 border-b ${
          activeTheme.bgColor || "bg-gray-100"
        } backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50`}
      >
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 ${
                activeTheme.gradientFrom || "from-gray-400"
              } ${
                activeTheme.gradientTo || "to-gray-600"
              } rounded-lg flex items-center justify-center`}
            >
              {/* Logo with dynamic gradient */}
              <img src={RevuLogo} alt="Logo" className="w-6 h-6" />
            </div>
            <h1
              className={`text-xl font-bold ${
                activeTheme.gradientFrom || "from-gray-400"
              } ${
                activeTheme.gradientTo || "to-gray-600"
              } bg-clip-text text-transparent`}
            >
              Revu
            </h1>
          </Link>
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button> */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
