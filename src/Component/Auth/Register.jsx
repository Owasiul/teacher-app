import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Register() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    try {
      // TODO: replace with your API call e.g. await registerStudent(data);
      await new Promise((r) => setTimeout(r, 1200)); // simulated delay
      setSuccess(true);
      toast.success("Registered successfully! 🎓");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e9] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ── Background decorative elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-orange-200/25 blur-3xl" />

        {/* Floating symbols */}
        {["✦", "◆", "∑", "∫", "✧", "Δ"].map((sym, i) => (
          <motion.span
            key={i}
            className="absolute text-amber-300/30 font-serif select-none text-2xl"
            style={{
              top: `${10 + i * 15}%`,
              left: i % 2 === 0 ? `${3 + i * 3}%` : `${85 - i * 3}%`,
            }}
            animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            {sym}
          </motion.span>
        ))}
      </div>

      {/* ── Card ── */}
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full rounded-t-2xl bg-linear-to-r from-amber-400 via-orange-400 to-amber-500" />

        <div className="bg-[#fffaf2] border border-amber-200/80 border-t-0 rounded-b-2xl shadow-[0_20px_60px_rgba(26,18,8,0.12)] px-8 py-10">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-2xl mb-4"
            >
              🎓
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-3xl font-bold text-stone-900 mb-1"
            >
              Join the Tribute
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-stone-400 text-sm leading-relaxed"
            >
              Register to leave your appreciation for our beloved teacher.
            </motion.p>
          </motion.div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <p className="font-serif text-xl text-stone-800 font-semibold mb-1">
                  You're registered!
                </p>
                <p className="text-stone-400 text-sm">Redirecting you home…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {!success && (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300 text-base">
                    👤
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Aryan Rahman"
                    maxLength={60}
                    {...register("name", {
                      required: "Your name is required.",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters.",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-stone-800 bg-[#fdf6e9] placeholder-stone-300 focus:outline-none transition duration-200
                      ${
                        errors.name
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-400 text-xs mt-0.5"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Roll */}
              <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Roll Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300 text-base">
                    🔢
                  </span>
                  <input
                    type="number"
                    placeholder="8546.."
                    maxLength={30}
                    {...register("roll", {
                      required: "Roll number is required.",
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-stone-800 bg-[#fdf6e9] placeholder-stone-300 focus:outline-none transition duration-200
                      ${
                        errors.roll
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.roll && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-400 text-xs mt-0.5"
                    >
                      {errors.roll.message}
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
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                  style={{
                    background: "linear-gradient(135deg, #d97706, #b45309)",
                  }}
                >
                  {isSubmitting ? (
                    <motion.span
                      className="flex items-center justify-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Registering…
                    </motion.span>
                  ) : (
                    "Register ✦"
                  )}
                </motion.button>
              </motion.div>

              {/* Footer link */}
              <motion.p
                variants={fadeUp}
                className="text-center text-xs text-stone-400 pt-1"
              >
                Already Have An Account?{" "}
                <Link
                  to="/login"
                  className="text-amber-600 font-medium hover:text-amber-700 transition-colors underline underline-offset-2"
                >
                  Login
                </Link>
              </motion.p>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
