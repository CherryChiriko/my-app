import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";

const NavItem = ({ item, isMobile = false }) => {
  const activeTheme = useSelector(selectActiveTheme);
  const location = useLocation();
  const isActive = location.pathname === item.path;

  // Base button styling
  const baseButtonClasses = `
    inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
    transition-colors duration-200 no-underline
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-current
    ${activeTheme.ring.focus}
    disabled:pointer-events-none disabled:opacity-50
  `;

  // Size variants
  const sizeClasses = isMobile
    ? "h-10 px-4 py-2 text-base w-full justify-start"
    : "h-9 px-3";

  // Active / inactive variants
  const variantClasses = isActive
    ? // Active: Use gradient background and active button text color
      `bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton} shadow-md`
    : // Inactive: Use primary text color with link hover effects
      `${activeTheme.text.primary} ${activeTheme.link.hoverText} ${activeTheme.link.hoverBg}`;

  return (
    <Link
      to={item.path}
      className={`${baseButtonClasses} ${sizeClasses} ${variantClasses} flex items-center gap-2 ${
        item.disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-[1.02] active:scale-100" // Added a subtle scale for interaction
      } transition-transform`}
    >
      {/* Using React.cloneElement is fine, but ensure item.icon is a React element.
        A cleaner approach often uses a component or a simpler prop, but this works.
      */}
      {React.cloneElement(item.icon, {
        className: `${item.icon.props.className || ""} w-4 h-4`,
      })}
      <span>{item.label}</span>
    </Link>
  );
};

export default NavItem;
