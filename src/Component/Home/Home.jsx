import {} from "react";
import { Link } from "react-router";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
// import { createMessage } from "../api";

const SYMBOLS = ["∑", "∫", "Δ", "λ", "Ω", "π"];
const PARTICLES = ["✦", "◆", "✧", "◇", "✦", "✧", "◆"];

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  /* Parallax */
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-linear-to-bl from-amber-50 via-orange-100 to-orange-200">
      {/* ── Optional: Add a subtle texture overlay to make the gradient look "Premium" ── */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
        }}
      />

      {/* ── 1. The Floating Mesh Blobs (Optional - Keep for extra depth) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/40 blur-[100px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] rounded-full bg-orange-300/20 blur-[100px]" />
      </div>

      {/* ── Rest of your code (Particles, Hero Card, etc.) ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 py-20"
      >
        <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[48px] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(180,83,9,0.1)] text-center">
          {/* Eyebrow Label */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="h-px w-8 bg-amber-300" />
            <span className="text-amber-700 text-[11px] font-bold tracking-[4px] uppercase">
              A Living Tribute
            </span>
            <span className="h-px w-8 bg-amber-300" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="font-serif text-5xl md:text-8xl font-black leading-[1.1] text-stone-900 mb-8 tracking-tight"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <span className="block text-3xl md:text-4xl font-medium text-stone-500 mb-2">
              To Our Mentor,
            </span>
            {["SI", "Ahiskur", "Rahaman"].map((w, i) => (
              <motion.span
                key={i}
                variants={fadeUp}
                className="inline-block mr-[0.2em] bg-linear-to-b from-stone-900 to-stone-700 bg-clip-text text-transparent"
              >
                {w}
              </motion.span>
            ))}
            <br />
            <motion.span
              variants={fadeUp}
              className="relative inline-block italic text-orange-600 drop-shadow-sm"
            >
              Who Lit Our World on Fire
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 10"
                fill="none"
              >
                <motion.path
                  d="M1 9C50 1 150 1 299 9"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </motion.svg>
            </motion.span>
          </motion.h1>

          {/* Description Body */}
          <motion.p
            className="text-lg md:text-xl text-stone-600 font-medium leading-relaxed max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            You didn't just teach us the laws of Physics; you inspired us to
            question the limits of our own potential. Curiosity is the force,
            and you are the constant.
          </motion.p>

          {/* Scientific Symbols with "Orbital" Animation */}
          <motion.div
            className="flex justify-center gap-10 mb-14"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {SYMBOLS.map((sym, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm"
              >
                <span className="font-serif text-xl text-amber-700">{sym}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            {/* Primary CTA: Read the Chalkboard */}
            <Link
              to="/messages"
              className="group relative px-10 py-4 bg-amber-600 text-white rounded-full font-bold tracking-[2px] uppercase text-[11px] overflow-hidden transition-all duration-300 shadow-xl shadow-amber-600/20 hover:shadow-amber-600/40 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10">Read The Chalkboard</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform">
                →
              </span>

              {/* Hover Shimmer Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Secondary CTA: View Gallery */}
            <Link
              to="/photos"
              className="px-10 py-4 border-2 border-stone-300 text-stone-700 rounded-full font-bold tracking-[2px] uppercase text-[11px] transition-all duration-300 hover:bg-stone-800 hover:text-white hover:border-stone-800 flex items-center gap-2"
            >
              View Gallery
              <span className="text-amber-500 group-hover:text-amber-400">
                ✦
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
