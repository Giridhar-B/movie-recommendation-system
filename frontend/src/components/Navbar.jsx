import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold text-blue-400">
          Movie Recommender
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400 transition"
            }
          >
            Analytics
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400 transition"
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}