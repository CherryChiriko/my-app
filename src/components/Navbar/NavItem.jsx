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
    transition-all duration-200 no-underline
    focus-visible:outline-none focus-visible:ring-2 ${activeTheme.ring.focus}
    disabled:pointer-events-none disabled:opacity-50
  `;

  // Size variants
  const sizeClasses = isMobile
    ? "h-10 px-4 py-2 text-base w-full justify-start"
    : "h-9 px-3";

  // Active / inactive variants
  const variantClasses = isActive
    ? `bg-gradient-to-r ${activeTheme.gradients.from} ${activeTheme.gradients.to} ${activeTheme.text.activeButton}`
    : `${activeTheme.text.primary} hover:${activeTheme.text.foreground} hover:${activeTheme.button.secondaryBg}`;

  return (
    <Link
      to={item.path}
      className={`${baseButtonClasses} ${sizeClasses} ${variantClasses} flex items-center gap-2 ${
        item.disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      {React.cloneElement(item.icon, {
        className: `${item.icon.props.className || ""} w-4 h-4`,
      })}
      <span>{item.label}</span>
    </Link>
  );
};

export default NavItem;
