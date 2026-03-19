import { useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "Messages", path: "/messages", icon: "💬" },
  { label: "Photos", path: "/photos", icon: "📸" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full bg-[#fffaf2]/80 backdrop-blur-md border-b border-amber-200/60"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* ── Brand ── */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2 select-none"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="text-amber-500 text-lg leading-none"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
            <span className="font-serif text-xl font-semibold text-stone-900 tracking-tight">
              Dear Teacher
            </span>
          </motion.div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <Link key={path} to={path} className="relative px-4 py-1.5 group">
                <span
                  className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-amber-600"
                      : "text-stone-500 group-hover:text-stone-900"
                  }`}
                >
                  {label}
                </span>

                {/* Active pill */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-amber-100 rounded-full border border-amber-200"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                {/* Hover underline for inactive */}
                {!isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Register button + mobile hamburger ── */}
        <div className="flex items-center gap-3">
          {/* Register */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Link
              to="/register"
              className="relative inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #d97706, #b45309)",
              }}
            >
              {/* Shimmer effect */}
              <motion.span className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative">✨ Register</span>
            </Link>
          </motion.div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-0.5 w-5 bg-stone-700 rounded-full origin-center"
                animate={
                  menuOpen
                    ? i === 0
                      ? { rotate: 45, y: 8 }
                      : i === 1
                        ? { opacity: 0 }
                        : { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#fffaf2] border-t border-amber-100"
          >
            <motion.div
              className="flex flex-col px-5 py-4 gap-1"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            >
              {NAV_ITEMS.map(({ label, path, icon }) => {
                const isActive = pathname === path;
                return (
                  <motion.div
                    key={path}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "text-stone-600 hover:bg-amber-50 hover:text-stone-900"
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      {label}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Register in mobile */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
                className="mt-2 pt-2 border-t border-amber-100"
              >
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #d97706, #b45309)",
                  }}
                >
                  ✨ Register
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
