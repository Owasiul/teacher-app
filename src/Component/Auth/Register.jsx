import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axiosPublic from "../Axios/AxiosApi";



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
      const studentData = {
        name: data.name,
        studentId: data.roll,
      };

      const response = await axiosPublic.post("/login", studentData);

      if (response.data.success) {
        localStorage.setItem("teacher-app-user", JSON.stringify(response.data.student));
        setSuccess(true);
        toast.success("Welcome to the Physics Lab! 🎓");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdf6e9] overflow-hidden">
      
      {/* ── Left Panel: Decorative Image/Sidebar ── */}
      <motion.div
        className="hidden lg:flex flex-col justify-between relative w-[40%] bg-stone-900 px-12 py-16 overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Abstract Physics Background Logic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* You can replace this div with an <img> tag if you have a specific physics image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125" />
            <div className="absolute inset-0 bg-linear-to-b from-stone-900 via-transparent to-stone-900" />
        </div>

        {/* Floating Physics Particles */}
        {["F=ma", "E=mc²", "G", "λ", "Φ", "ħ"].map((text, i) => (
          <motion.span
            key={i}
            className="absolute font-mono text-amber-500/20 select-none text-xl"
            style={{
              top: `${15 + i * 15}%`,
              left: i % 2 === 0 ? "10%" : "70%",
            }}
            animate={{ 
                y: [0, -30, 0], 
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 10, -10, 0] 
            }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        ))}

        {/* Branding & Quote */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <span className="text-amber-400 text-2xl">⚛️</span>
            <span className="font-serif text-white text-xl font-medium tracking-tight">Physics Tribute</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-stone-400 text-xs font-bold uppercase tracking-[4px] mb-4">Discovery Starts Here</h2>
            <p className="font-serif text-4xl text-white leading-tight">
              Every great discovery <br />
              <span className="text-amber-500">starts with a </span> <br />
              great teacher.
            </p>
          </motion.div>
        </div>

        <p className="relative z-10 text-stone-500 text-xs italic">
          "Physics is experience, arranged in economical order." — Ernst Mach
        </p>
      </motion.div>

      {/* ── Right Panel: The Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Background Decorative Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card Wrapper */}
          <div className="bg-[#fffaf2] border border-amber-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 relative overflow-hidden">
            
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 to-orange-500" />

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="text-6xl mb-6">🎓</div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Registration Complete!</h3>
                  <p className="text-stone-500">Redirecting to the chalkboard...</p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <header className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Join the Class</h1>
                    <p className="text-stone-400 text-sm">Create your student profile to leave a message.</p>
                  </header>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">👤</span>
                        <input
                          type="text"
                          placeholder="e.g. Isaac Newton"
                          {...register("name", { required: "Name is required" })}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm transition-all outline-none
                            ${errors.name ? "border-red-300 ring-4 ring-red-50" : "border-stone-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/5 bg-white"}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Roll Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Student Roll / ID</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">🆔</span>
                        <input
                          type="text"
                          placeholder="e.g. 2024-PHY-01"
                          {...register("roll", { required: "Roll number is required" })}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm transition-all outline-none
                            ${errors.roll ? "border-red-300 ring-4 ring-red-50" : "border-stone-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/5 bg-white"}`}
                        />
                      </div>
                      {errors.roll && <p className="text-red-400 text-xs mt-1">{errors.roll.message}</p>}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-stone-900 text-amber-400 font-bold rounded-2xl shadow-xl shadow-stone-200 mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? "Processing..." : "Register Profile ✦"}
                    </motion.button>

                    <p className="text-center text-stone-400 text-xs mt-6">
                      Already have an account?{" "}
                      <Link to="/login" className="text-amber-600 font-bold hover:underline">Sign In</Link>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}