import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";

import RevuLogo from "../assets/Revu_logo.png";
import navigationItems from "../../data/navigationItems";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavItem from "../NavItem";

const Navbar = () => {
  const activeTheme = useSelector(selectActiveTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`hidden md:flex items-center justify-between p-4 border-b
           ${activeTheme.background.navbar} backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full
            ${activeTheme.border.bottom} shadow-md`}
        style={{
          boxShadow: `0 4px 6px ${activeTheme.shadow}`,
        }}
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
