import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              Vidly
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Movies
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Customers
            </NavLink>
            <NavLink
              to="/rentals"
              className={({ isActive }) =>
                `text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Rentals
            </NavLink>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/80 text-sm">
                  Hello, {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50" : "hover:bg-blue-50"
                    }`
                  }>
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 active:scale-95 cursor-pointer"
              aria-expanded={isOpen}
              aria-label="Toggle menu">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/movies"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block text-white px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Movies
            </NavLink>
            <NavLink
              to="/customers"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block text-white px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Customers
            </NavLink>
            <NavLink
              to="/rentals"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block text-white px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }>
              Rentals
            </NavLink>
          </div>

          {/* Mobile Auth Section */}
          <div className="border-t border-white/10 px-2 pt-2 pb-3">
            {user ? (
              <>
                <div className="px-3 py-2 text-white/80 text-sm">
                  Signed in as{" "}
                  <span className="font-semibold text-white">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="block w-full text-left text-white px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-colors cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block text-white px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`
                  }>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="block text-blue-600 bg-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-50 transition-colors mt-2">
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
