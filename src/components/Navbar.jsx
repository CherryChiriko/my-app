import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../slices/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGear,
  faBook,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { TbCardsFilled } from "react-icons/tb";
import RevuLogo from "../assets/Revu_logo.png";

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

const Navbar = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;

    const baseButtonClasses = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 ${
      activeTheme.ring.focus || "focus:ring-ring"
    } disabled:pointer-events-none disabled:opacity-50`;

    const sizeClasses = isMobile
      ? "h-10 px-4 py-2 text-base"
      : "h-9 rounded-md px-3";

    const variantClasses = isActive
      ? `bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`
      : `hover:bg-gray-700 hover:${activeTheme.text.primary}`;

    return (
      <Link
        to={item.path}
        onClick={() => isMobile && setIsMenuOpen(false)}
        className={`${baseButtonClasses} ${sizeClasses} ${variantClasses}
          flex items-center gap-2 ${isMobile ? "w-full justify-start" : ""}
          ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
          transition-all duration-200 hover:scale-105 no-underline ${
            isActive ? "" : activeTheme.text.primary
          }`}
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
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:flex items-center justify-between p-4 border-b ${activeTheme.background.navbar} backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full ${activeTheme.border.bottom}`}
      >
        <Link to="/" className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, ${activeTheme.gradients.from.replace(
                "from-",
                ""
              )}, ${activeTheme.gradients.to.replace("to-", "")})`,
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

        <div className="flex items-center space-x-2 ml-auto">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div
        className={`md:hidden flex items-center justify-between p-4 border-b ${activeTheme.background.navbar} backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full ${activeTheme.border.bottom}`}
      >
        <Link to="/" className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, ${activeTheme.gradients.from.replace(
                "from-",
                ""
              )}, ${activeTheme.gradients.to.replace("to-", "")})`,
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
          className={`${activeTheme.text.primary} hover:text-white transition-colors duration-200`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={`md:hidden flex flex-col p-4 space-y-2 ${activeTheme.background.navbar} ${activeTheme.text.primary} border-b ${activeTheme.border.bottom}`}
        >
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} isMobile />
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
