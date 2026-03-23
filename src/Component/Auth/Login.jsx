import { useState } from "react";
import { Link, useNavigate } from "react-router"; // Standard for web apps
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axiosPublic from "../Axios/AxiosApi";


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
      // Data format matches backend: { name, studentId }
      const response = await axiosPublic.post("/login", data);
      
      if (response.data.success) {
        // Save user to local storage
        localStorage.setItem("teacher-app-user", JSON.stringify(response.data.student));
        
        toast.success(`Welcome back, ${response.data.student.name}! 🎓`);
        navigate("/"); // Navigate to home or message board
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
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
        {["∑", "∫", "Δ", "λ", "Ω", "π", "⚛️", "✦"].map((sym, i) => (
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
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              ⚛️
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
          Every student is a particle, and your guidance is the force that defines our trajectory.
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
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Full Name
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="e.g. Aryan Rahman"
                  {...register("name", {
                    required: "Please enter your full name.",
                  })}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm text-stone-800 bg-white placeholder-stone-300 focus:outline-none transition-all duration-200
                    ${errors.name ? "border-red-300 ring-red-100" : "border-stone-200 focus:border-amber-400 focus:ring-amber-400/15"}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </motion.div>

            {/* Student ID field */}
            <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Student ID
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm">
                  🆔
                </span>
                <input
                  type={showId ? "text" : "password"}
                  placeholder="e.g. PHY-2024"
                  {...register("studentId", {
                    required: "Student ID is required.",
                  })}
                  className={`w-full pl-10 pr-12 py-3.5 rounded-xl border text-sm text-stone-800 bg-white placeholder-stone-300 focus:outline-none transition-all duration-200
                    ${errors.studentId ? "border-red-300 ring-red-100" : "border-stone-200 focus:border-amber-400 focus:ring-amber-400/15"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowId((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 text-xs font-medium"
                >
                  {showId ? "Hide" : "Show"}
                </button>
              </div>
              {errors.studentId && <p className="text-red-400 text-xs">{errors.studentId.message}</p>}
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} className="pt-1">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg bg-linear-to-r from-amber-600 to-amber-800 disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In ✦"}
              </motion.button>
            </motion.div>

            {/* Register link */}
            <motion.div variants={fadeUp} className="text-center pt-2">
              <p className="text-stone-400 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-amber-600 font-semibold hover:text-amber-700 underline">
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