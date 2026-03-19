import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0  },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11 } },
};

export default function Login() {
  const navigate = useNavigate();
  const [showId, setShowId] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    try {
      // TODO: replace with your API call e.g. await loginUser(data)
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Welcome back! 🎓");
      navigate("/");
    } catch {
      toast.error("Invalid name or ID. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdf6e9] overflow-hidden">

      {/* ── Left panel — decorative ── */}
      <motion.div
        className="hidden lg:flex flex-col justify-between relative w-[42%] bg-stone-900 px-14 py-16 overflow-hidden"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-orange-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Floating physics symbols */}
        {["∑", "∫", "Δ", "λ", "Ω", "π", "∞", "✦"].map((sym, i) => (
          <motion.span
            key={i}
            className="absolute font-serif text-white/5 select-none pointer-events-none"
            style={{
              fontSize: `${2 + (i % 3)}rem`,
              top:  `${8 + i * 11}%`,
              left: i % 2 === 0 ? `${5 + i * 4}%` : `${55 - i * 4}%`,
            }}
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          >
            {sym}
          </motion.span>
        ))}

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2.5 mb-16">
            <motion.span
              className="text-amber-400 text-xl"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
            <span className="font-serif text-white text-xl font-semibold tracking-tight">
              Dear Teacher
            </span>
          </div>
        </motion.div>

        {/* Quote block */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="w-10 h-0.5 bg-amber-400 mb-6" />
          <blockquote className="font-serif text-3xl font-semibold text-white leading-snug mb-6">
            "A good teacher can{" "}
            <em className="text-amber-400 not-italic" style={{ fontStyle: "italic" }}>
              inspire hope
            </em>
            , ignite the imagination."
          </blockquote>
          <p className="text-stone-400 text-sm tracking-widest uppercase font-medium">
            — Brad Henry
          </p>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          className="text-stone-500 text-xs leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Sign in to join our tribute and share your heartfelt appreciation.
        </motion.p>
      </motion.div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative">

        {/* Background texture dots */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #92400e 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Soft orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-200/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="relative w-full max-w-sm"
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <motion.div
            className="mb-9"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Mobile brand */}
            <motion.div
              variants={fadeUp}
              className="flex lg:hidden items-center gap-2 mb-8"
            >
              <span className="text-amber-500 text-base">✦</span>
              <span className="font-serif text-stone-900 text-lg font-semibold">Dear Teacher</span>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[3px] text-amber-500 mb-2"
            >
              Welcome Back
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl font-bold text-stone-900 leading-tight"
            >
              Sign in to<br />your account
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-stone-400 text-sm mt-3 leading-relaxed"
            >
              Enter your name and student ID to continue.
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5"
          >
            {/* Name field */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-widest text-stone-400"
              >
                Full Name
              </label>
              <div className="relative group">
                {/* Left accent bar */}
                <motion.span
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-amber-400 origin-top"
                  initial={{ scaleY: 0 }}
                  whileFocus={{ scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none">
                  👤
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Aryan Rahman"
                  autoComplete="name"
                  {...register("name", {
                    required: "Please enter your full name.",
                    minLength: { value: 2, message: "Name must be at least 2 characters." },
                  })}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm text-stone-800 bg-white placeholder-stone-300 focus:outline-none transition-all duration-200
                    ${errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
                    }`}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: "auto" }}
                    exit={{   opacity: 0, y: -4,  height: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Student ID field */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <label
                htmlFor="studentId"
                className="text-xs font-semibold uppercase tracking-widest text-stone-400"
              >
                Student ID
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none">
                  🪪
                </span>
                <input
                  id="studentId"
                  type={showId ? "text" : "password"}
                  placeholder="e.g. 2024-PHY-042"
                  autoComplete="current-password"
                  {...register("studentId", {
                    required: "Student ID is required.",
                    minLength: { value: 3, message: "ID must be at least 3 characters." },
                  })}
                  className={`w-full pl-10 pr-12 py-3.5 rounded-xl border text-sm text-stone-800 bg-white placeholder-stone-300 focus:outline-none transition-all duration-200
                    ${errors.studentId
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
                    }`}
                />
                {/* Show / hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowId((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors text-xs font-medium"
                  tabIndex={-1}
                >
                  {showId ? "Hide" : "Show"}
                </button>
              </div>
              <AnimatePresence>
                {errors.studentId && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: "auto" }}
                    exit={{   opacity: 0, y: -4,  height: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.studentId.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} className="pt-1">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isSubmitting  ? { scale: 0.98 }         : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden shadow-lg shadow-amber-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #d97706 0%, #92400e 100%)" }}
              >
                {/* Shimmer */}
                {!isSubmitting && (
                  <motion.span
                    className="absolute inset-0 bg-white/10 -skew-x-12 -translate-x-full"
                    whileHover={{ translateX: "250%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>Sign In ✦</>
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 py-1"
            >
              <span className="flex-1 h-px bg-stone-200" />
              <span className="text-stone-300 text-xs">or</span>
              <span className="flex-1 h-px bg-stone-200" />
            </motion.div>

            {/* Register link */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-stone-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-600 font-semibold hover:text-amber-700 transition-colors underline underline-offset-2"
                >
                  Register here
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}