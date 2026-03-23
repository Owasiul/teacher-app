import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";


/* ── Helpers ── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-amber-400",
  "bg-orange-400",
  "bg-rose-400",
  "bg-teal-400",
  "bg-sky-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-pink-400",
];

function avatarColor(name = "") {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const EMOJIS = ["💛", "🙏", "🌟", "📚", "🔬", "💫", "❤️", "🎓"];

/* ── Auth helper — reads localStorage set during login ── */
function useCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const Messages = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("💛");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!user) {
      toast("Please register first to join the conversation 👋", {
        icon: "🔐",
      });
      navigate("/register");
    }
  }, [user, navigate]);

  /* ── Fetch messages ── */
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get("/api/messages");
        setMessages(res.data.data);
      } catch {
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  /* ── Auto-scroll to bottom on new messages ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send message ── */
  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const optimistic = {
      _id: `temp-${Date.now()}`,
      name: user.name,
      role: "student",
      message: text.trim(),
      emoji,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setShowEmoji(false);
    try {
      const res = await axios.post("/api/messages", {
        name: user.name,
        role: "student",
        message: optimistic.message,
        emoji,
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === optimistic._id ? res.data.data : m)),
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      toast.error("Failed to send. Try again.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const visible =
    filter === "all" ? messages : messages.filter((m) => m.role === filter);

  if (!user) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-66px)] bg-[#fdf6e9]">
      {/* ── Top bar ── */}
      <div className="shrink-0 border-b border-amber-200/70 bg-[#fffaf2] px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Online indicator */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-base">
              🎓
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-stone-800 leading-tight">
              Messages of Gratitude
            </p>
            <p className="text-xs text-emerald-500 font-medium">
              {messages.length} message{messages.length !== 1 ? "s" : ""} shared
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="hidden sm:flex items-center gap-1 bg-stone-100 rounded-full p-1">
          {[
            { key: "all", label: "All", icon: "🌟" },
            { key: "student", label: "Students", icon: "🎒" },
            { key: "teacher", label: "Teachers", icon: "🍎" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === key
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse shrink-0" />
                <div className="flex flex-col gap-1.5 max-w-xs">
                  <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
                  <div className="h-14 w-56 bg-stone-200 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center pt-20"
          >
            <div className="text-5xl mb-3">💬</div>
            <p className="font-serif text-lg text-stone-500 font-medium">
              No messages yet
            </p>
            <p className="text-stone-400 text-sm mt-1">
              Be the first to share your appreciation!
            </p>
          </motion.div>
        )}

        {/* Message bubbles */}
        <AnimatePresence initial={false}>
          {!loading &&
            visible.map((msg, idx) => {
              const isOwn = msg.name === user?.name;
              const color = avatarColor(msg.name);
              const initials = getInitials(msg.name);
              const prevMsg = visible[idx - 1];
              const showHeader = !prevMsg || prevMsg.name !== msg.name;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"} ${
                    !showHeader ? (isOwn ? "mr-10" : "ml-10") : ""
                  }`}
                >
                  {/* Avatar */}
                  {showHeader && (
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${color} shadow-sm`}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`flex flex-col max-w-[72%] sm:max-w-sm ${isOwn ? "items-end" : "items-start"}`}
                  >
                    {/* Name + time */}
                    {showHeader && (
                      <div
                        className={`flex items-center gap-1.5 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-xs font-semibold text-stone-600">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-stone-300">•</span>
                        <span className="text-[10px] text-stone-400">
                          {timeAgo(msg.createdAt)}
                        </span>
                        <span className="text-xs">{msg.emoji}</span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isOwn
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-tr-sm"
                          : "bg-white border border-stone-100 text-stone-700 rounded-tl-sm"
                      } ${msg.pending ? "opacity-60" : ""}`}
                    >
                      <p className="font-serif italic">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                      {/* Sending indicator */}
                      {msg.pending && (
                        <span className="absolute -bottom-4 right-0 text-[10px] text-stone-400">
                          sending…
                        </span>
                      )}
                    </div>

                    {/* Role badge */}
                    {showHeader && (
                      <span
                        className={`mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          msg.role === "teacher"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {msg.role === "teacher" ? "🍎 Teacher" : "🎒 Student"}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ── Bottom input bar ── */}
      <div className="shrink-0 border-t border-amber-200/70 bg-[#fffaf2] px-4 py-3">
        {/* Emoji picker popover */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="flex gap-2 mb-2.5 bg-white border border-amber-200 rounded-2xl px-3 py-2 shadow-lg w-fit"
            >
              {EMOJIS.map((em) => (
                <motion.button
                  key={em}
                  type="button"
                  onClick={() => {
                    setEmoji(em);
                    setShowEmoji(false);
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-xl transition-all ${
                    emoji === em
                      ? "scale-125 drop-shadow-md"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {em}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2">
          {/* Emoji toggle button */}
          <motion.button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg border transition-all ${
              showEmoji
                ? "bg-amber-100 border-amber-300"
                : "bg-white border-stone-200 hover:border-amber-300"
            }`}
          >
            {emoji}
          </motion.button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              maxLength={500}
              placeholder="Share your thoughts about our teacher…"
              className="w-full resize-none bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-200 max-h-32 leading-relaxed"
              style={{ scrollbarWidth: "none" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
            {/* Char count */}
            {text.length > 400 && (
              <span className="absolute right-3 bottom-2 text-[10px] text-stone-300">
                {500 - text.length}
              </span>
            )}
          </div>

          {/* Send button */}
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={sending || !text.trim()}
            whileHover={text.trim() ? { scale: 1.05 } : {}}
            whileTap={text.trim() ? { scale: 0.95 } : {}}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shadow-amber-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: text.trim()
                ? "linear-gradient(135deg, #d97706, #b45309)"
                : "#d1d5db",
            }}
          >
            {sending ? (
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
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Hint */}
        <p className="text-[10px] text-stone-300 mt-1.5 pl-1">
          Press{" "}
          <kbd className="bg-stone-100 px-1 rounded text-[9px]">Enter</kbd> to
          send ·{" "}
          <kbd className="bg-stone-100 px-1 rounded text-[9px]">
            Shift+Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
};
export default Messages;
