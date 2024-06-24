import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../UserContext";

let NavBar = () => {
  // get context
  let userContext = useContext(UserContext);

  // state for dropdown menu visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  let onLogoutClick = (event) => {
    event.preventDefault();

    userContext.setUser({
      isLoggedIn: false,
      currentUserId: null,
      currentUserName: null,
    });

    window.location.hash = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a className="text-white text-xl font-bold" href="/#">
            eCommerce
          </a>
          {userContext.user.isLoggedIn && (
            <>
              <NavLink
                className="text-white hover:text-gray-300"
                to="/dashboard"
                // activeclassName="font-bold"
              >
                <i className="fa fa-dashboard"></i> Dashboard
              </NavLink>
              <NavLink
                className="text-white hover:text-gray-300"
                to="/store"
                // activeClassName="font-bold"
              >
                <i className="fa fa-shopping-bag"></i> Store
              </NavLink>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {!userContext.user.isLoggedIn && (
            <>
              <NavLink
                className="text-white hover:text-gray-300"
                to="/login"
                // activeClassName="font-bold"
                // exact={true}
              >
                Login
              </NavLink>
              <NavLink
                className="text-white hover:text-gray-300"
                to="/register"
                // activeClassName="font-bold"
              >
                Register
              </NavLink>
            </>
          )}
          {userContext.user.isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="text-white flex items-center space-x-2"
                id="navbarDropdown"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownVisible}
              >
                <i className="fa fa-user-circle"></i>
                <span>{userContext.user.currentUserName}</span>
              </button>
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="/#"
                    onClick={onLogoutClick}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
