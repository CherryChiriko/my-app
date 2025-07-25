import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice";
import { selectCurrentView, setCurrentView } from "../features/navigationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGear,
  faBook,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { TbCardsFilled } from "react-icons/tb";
import RevuLogo from "../assets/Revu_logo.png"; // Original logo with solid background

const Navbar = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const currentView = useSelector(selectCurrentView);
  const dispatch = useDispatch();

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

    // Size variations
    const sizeClasses = isMobile
      ? "h-10 px-4 py-2 text-base"
      : "h-9 rounded-md px-3";

    // Variant variations (active and ghost)
    const variantClasses = isActive
      ? `bg-gradient-to-r ${activeTheme.gradientFrom} ${activeTheme.gradientTo} ${activeTheme.activeButtonTextColor}` // Active state uses theme gradient
      : `hover:bg-gray-700 hover:${activeTheme.textColor}`; // Inactive (ghost) button hover, using theme text color

    return (
      <Link
        to={item.path}
        onClick={() => {
          if (isMobile) setIsMenuOpen(false);
          dispatch(setCurrentView(item.id)); // Dispatch action to change currentView
        }}
        className={`${baseButtonClasses} ${sizeClasses} ${variantClasses}
                   flex items-center gap-2 ${
                     isMobile ? "w-full justify-start" : ""
                   }
                   ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                   transition-all duration-200 hover:scale-105 no-underline ${
                     isActive ? "" : activeTheme.textColor
                   }`} // Added no-underline
      >
        {React.cloneElement(item.icon, {
          className: `${item.icon.props.className || ""} w-4 h-4`,
        })}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`hidden md:flex items-center justify-between p-4 border-b ${activeTheme.bgColor} backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full`}
      >
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => {
            dispatch(setCurrentView("dashboard"));
          }}
        >
          {/* Logo container with gradient background and scaled image */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden`} // Base size, overflow hidden
            style={{
              backgroundImage: `linear-gradient(to right, ${activeTheme.gradientFrom.replace(
                "from-",
                ""
              )}, ${activeTheme.gradientTo.replace("to-", "")})`, // Gradient
              transform: "scale(1.5)", // Visually enlarge the logo
              transformOrigin: "center center",
              zIndex: 1,
            }}
          >
            <img
              src={RevuLogo}
              alt="Revu Logo"
              className="w-full h-full object-contain"
            />{" "}
            {/* Display the image */}
          </div>
        </Link>

        {/* Navigation Items - Moved directly under nav and given ml-auto */}
        <div className="flex items-center space-x-2 ml-auto">
          {" "}
          {/* ml-auto pushes these items to the right */}
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        {/* Settings button placeholder - Remains on the right */}
        <div className="flex items-center space-x-2">
          {/* Settings button placeholder */}
        </div>
      </nav>

      {/* Mobile Navigation (Hamburger menu) */}
      <div
        className={`md:hidden flex items-center justify-between p-4 border-b ${activeTheme.bgColor} backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full`}
      >
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => {
            dispatch(setCurrentView("dashboard"));
          }}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden`}
            style={{
              backgroundImage: `linear-gradient(to right, ${activeTheme.gradientFrom.replace(
                "from-",
                ""
              )}, ${activeTheme.gradientTo.replace("to-", "")})`,
              transform: "scale(1.5)",
              transformOrigin: "center center",
              zIndex: 1,
            }}
          >
            <img
              src={RevuLogo}
              alt="Revu Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        <button
          className={`${activeTheme.textColor} hover:text-white transition-colors duration-200`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={`md:hidden flex flex-col p-4 space-y-2 ${activeTheme.bgColor} ${activeTheme.textColor} border-b`}
        >
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} isMobile={true} />
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
