import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectActiveTheme } from "../../slices/themeSlice";

import { useLocation } from "react-router-dom";

const NavItem = ({ item, isMobile = false }) => {
  const activeTheme = useSelector(selectActiveTheme);
  const location = useLocation();
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
      //   onClick={() => isMobile && setIsMenuOpen(false)}
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

export default NavItem;
