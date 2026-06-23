import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/movies", label: "Movies", icon: "fa-film" },
    { to: "/customers", label: "Customers", icon: "fa-users" },
    { to: "/rentals", label: "Rentals", icon: "fa-ticket" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa fa-play text-white text-sm"></i>
            </motion.div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Vidly
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <i className={`fa ${link.icon} mr-2 text-xs`}></i>
                {link.label}
              </NavLink>
            ))}

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {user ? (
              <>
                <NavLink to="/profile" className={linkClass}>
                  <i className="fa fa-user mr-2 text-xs"></i>
                  Profile
                </NavLink>
                <NavLink to="/logout" className={linkClass}>
                  <i className="fa fa-sign-out mr-2 text-xs"></i>
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  <i className="fa fa-sign-in mr-2 text-xs"></i>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm">
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <motion.i
              animate={{ rotate: isOpen ? 90 : 0 }}
              className={`fa ${isOpen ? "fa-times" : "fa-bars"} text-xl`}></motion.i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={mobileLinkClass}
                  onClick={() => setIsOpen(false)}>
                  <i className={`fa ${link.icon} mr-3 w-5 text-center`}></i>
                  {link.label}
                </NavLink>
              ))}

              <div className="border-t border-gray-100 my-2"></div>

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    className={mobileLinkClass}
                    onClick={() => setIsOpen(false)}>
                    <i className="fa fa-user mr-3 w-5 text-center"></i>
                    Profile
                  </NavLink>
                  <NavLink
                    to="/logout"
                    className={mobileLinkClass}
                    onClick={() => setIsOpen(false)}>
                    <i className="fa fa-sign-out mr-3 w-5 text-center"></i>
                    Logout
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={mobileLinkClass}
                    onClick={() => setIsOpen(false)}>
                    <i className="fa fa-sign-in mr-3 w-5 text-center"></i>
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block px-4 py-3 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsOpen(false)}>
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
