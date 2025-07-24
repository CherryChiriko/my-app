import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveTheme } from "../features/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const dispatch = useDispatch();
  const activeTheme = useSelector(selectActiveTheme);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const navigationItems = [
  //   {
  //     id: "dashboard",
  //     label: "Dashboard",
  //     icon: Home,
  //     badge: null,
  //   },
  //   {
  //     id: "decks",
  //     label: "Decks",
  //     icon: BookOpen,
  //     badge: null,
  //   },
  //   {
  //     id: "study",
  //     label: "Study",
  //     icon: Brain,
  //     badge: isStudyActive ? "Active" : null,
  //     disabled: !isStudyActive,
  //   },
  // ];

  // const NavItem = ({ item, isMobile = false }) => {
  //   const Icon = item.icon;
  //   const isActive = currentView === item.id;

  //   return (
  //     <Button
  //       variant={isActive ? "default" : "ghost"}
  //       size={isMobile ? "lg" : "sm"}
  //       onClick={() => {
  //         if (!item.disabled) {
  //           onNavigate(item.id);
  //           if (isMobile) setIsMobileMenuOpen(false);
  //         }
  //       }}
  //       disabled={item.disabled}
  //       className={`flex items-center gap-2 ${
  //         isMobile ? "w-full justify-start" : ""
  //       }
  //         ${isActive ? "bg-primary text-primary-foreground" : ""}
  //         ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
  //         transition-all duration-200 hover:scale-105`}
  //     >
  //       <Icon className="w-4 h-4" />
  //       {isMobile && (
  //         <>
  //           {item.label}
  //           {item.badge && (
  //             <Badge variant="secondary" className="ml-auto">
  //               {item.badge}
  //             </Badge>
  //           )}
  //         </>
  //       )}
  //       {!isMobile && item.badge && (
  //         <Badge variant="secondary" className="text-xs">
  //           {item.badge}
  //         </Badge>
  //       )}
  //     </Button>
  //   );
  // };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              LOGO
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Revu
            </h1>
          </div>
          <FontAwesomeIcon icon={faHouse} />
          {/* <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div> */}
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
