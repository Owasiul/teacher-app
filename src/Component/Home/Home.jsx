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
    <div className="relative overflow-x-hidden bg-linear-to-bl from-amber-200 to-amber-400 min-h-screen">
      {/* ── Floating particles ── */}
      {PARTICLES.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="fixed text-amber-300 pointer-events-none z-0 text-base select-none"
          style={{
            top: `${12 + i * 13}%`,
            left: i % 2 === 0 ? `${4 + i * 2}%` : `${88 - i * 2}%`,
          }}
          animate={{
            y: [0, -22, 0],
            rotate: [0, 15, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        >
          {s}
        </motion.span>
      ))}

      {/* ── Hero ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center z-10"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="block w-10 h-px bg-amber-400" />
          <span className="text-amber-600 text-xs font-medium tracking-[2.5px] uppercase">
            A Tribute from Your Students
          </span>
          <span className="block w-10 h-px bg-amber-400" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold leading-tight text-stone-900 mb-6"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {["To", "SI", "Ahiskur", "Rahaman", "sir", "Who"].map((w, i) => (
            <motion.span
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
          <br />
          <motion.em
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block italic text-amber-600"
            style={{ fontStyle: "italic" }}
          >
            Lit Our World on Fire
          </motion.em>
        </motion.h1>

        {/* Body */}
        <motion.p
          className="text-lg text-neutral-800 font-medium leading-relaxed max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          You didn't just teaches us Physics — you showed us that curiosity is
          the most powerful force in the universe. Thank you for, every class,
          and every life lesson tucked between the equations.
        </motion.p>

        {/* Physics symbols */}
        <motion.div
          className="flex justify-center gap-8 my-10"
          aria-hidden
          variants={stagger}
          initial="hidden"
          animate="show"
          transition={{ delayChildren: 0.9 }}
        >
          {SYMBOLS.map((sym, i) => (
            <motion.span
              key={sym}
              className="font-serif text-3xl text-amber-700"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              animate={{
                y: [0, -8, 0],
                transition: {
                  y: {
                    duration: 3 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  },
                },
              }}
            >
              {sym}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.55 }}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/messages"
              className="inline-block border border-stone-900 text-stone-900 px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-stone-900 hover:text-amber-50 transition-colors duration-300"
            >
              Read All Messages →
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
