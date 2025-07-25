import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice";
import { selectCurrentView, setCurrentView } from "../features/navigationSlice"; // Assuming this exists
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGear,
  faBook,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { TbCardsFilled } from "react-icons/tb";
import RevuLogo1 from "../assets/Revu_logo_long.png";

// Custom CSS for gradient text and other specific styles not covered by Bootstrap
const customNavbarStyles = `
  .navbar-custom-gradient-text {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  /* Custom styles to mimic Tailwind's button appearance and hover effects */
  .nav-item-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    transition: all 0.2s ease-in-out; /* transition-all duration-200 */
    outline: none; /* focus-visible:outline-none */
    box-shadow: none; /* Reset Bootstrap's default focus shadow */
    position: relative; /* For custom ring */
  }

  .nav-item-link:focus-visible {
    box-shadow: 0 0 0 0.25rem var(--bs-focus-ring-color); /* Bootstrap's default focus ring */
  }

  .nav-item-link.active-link {
    color: var(--active-button-text-color) !important; /* Ensure text color is applied */
  }

  .nav-item-link:not(.active-link):hover {
    background-color: rgba(0, 0, 0, 0.1); /* A subtle hover for inactive items */
    color: inherit; /* Inherit text color from parent or theme */
  }

  .nav-item-link.disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .nav-item-icon {
    width: 1rem; /* w-4 */
    height: 1rem; /* h-4 */
    margin-right: 0.5rem; /* gap-2 */
  }

  /* Responsive adjustments */
  @media (min-width: 768px) {
    .navbar-expand-md .navbar-nav .nav-item-link {
      height: 2.25rem; /* h-9 */
      padding: 0 0.75rem; /* px-3 */
    }
  }

  @media (max-width: 767.98px) {
    .navbar-nav .nav-item-link {
      height: 2.5rem; /* h-10 */
      padding: 0.5rem 1rem; /* px-4 py-2 */
      font-size: 1rem; /* text-base */
      width: 100%; /* w-full */
      justify-content: flex-start; /* justify-start */
    }
  }
`;

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
    console.log("Current View:", currentView, "Item ID:", item.id);
    const activeLinkStyle = isActive
      ? {
          backgroundImage: `linear-gradient(to right, ${activeTheme.gradientFrom}, ${activeTheme.gradientTo})`,
          color: activeTheme.activeButtonTextColor, // text-primary-foreground equivalent
          // Set custom property for the focus ring color
          "--bs-focus-ring-color":
            activeTheme.buttonRing || "rgba(108, 117, 125, 0.25)", // Fallback to Bootstrap's secondary color with transparency
        }
      : {
          color: activeTheme.bsBodyColor, // Inactive text color from theme (UPDATED)
          // Set custom property for the focus ring color for inactive items too
          "--bs-focus-ring-color":
            activeTheme.buttonRing || "rgba(108, 117, 125, 0.25)",
        };

    return (
      <li className="nav-item">
        <Link
          to={item.path}
          onClick={() => {
            if (isMobile) setIsMenuOpen(false);
            dispatch(setCurrentView(item.id));
          }}
          className={`nav-link nav-item-link ${isActive ? "active-link" : ""} ${
            item.disabled ? "disabled" : ""
          }`}
          style={activeLinkStyle} // Apply dynamic styles here
        >
          {React.cloneElement(item.icon, {
            className: `nav-item-icon`, // Apply custom icon class
            style: { color: isActive ? "inherit" : activeTheme.bsBodyColor }, // Icon color (UPDATED)
          })}
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  // Dynamic styles for the navbar background and text color
  const navbarStyle = {
    backgroundColor: activeTheme.bsBodyBg,
    color: activeTheme.bsBodyColor,
    borderBottom: `1px solid ${activeTheme.bsBodyColor}20`, // Light border for contrast
    backdropFilter: "blur(8px)", // Mimic backdrop-blur
    WebkitBackdropFilter: "blur(8px)", // For Safari
  };

  const logoContainerDynamicStyle = {
    width: "2rem",
    height: "2rem",
    backgroundColor: activeTheme.bsBodyBg, // Background color for the div around the logo
    backgroundImage: `linear-gradient(to right, ${
      activeTheme.gradientFrom || "#9ca3af"
    }, ${activeTheme.gradientTo || "#4b5563"})`, // Gradient to be masked
    maskImage: `url(${RevuLogo1})`,
    maskMode: "alpha", // Mask based on the alpha channel of the image
    WebkitMaskImage: `url(${RevuLogo1})`,
    WebkitMaskMode: "alpha",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    display: "flex", // Ensure flex properties from Bootstrap classes are maintained
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.5rem", // me-2
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{customNavbarStyles}</style>

      {/* Bootstrap Navbar */}
      <nav
        className="navbar navbar-expand-md sticky-top" // sticky-top for fixed position
        style={navbarStyle} // Apply dynamic background and text color
      >
        <div className="container-fluid">
          {/* Logo and App Name */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            onClick={() => {
              dispatch(setCurrentView("dashboard"));
            }}
          >
            <div
              style={logoContainerDynamicStyle} // Apply dynamic styles to the div
            ></div>
          </Link>

          {/* Toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Navigation Items */}
          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              {" "}
              {/* ms-auto pushes items to the right */}
              {navigationItems.map((item) => (
                <NavItem key={item.id} item={item} isMobile={!isMenuOpen} /> // isMobile based on menu state
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
