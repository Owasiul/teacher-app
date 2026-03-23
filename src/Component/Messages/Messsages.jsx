import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../AuthProvider/AuthContext";
import axiosPublic from "../Axios/AxiosApi";

/* ── Helpers ── */
function timeAgo(dateStr) {
  if (!dateStr) return "...";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
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
  "bg-amber-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
];

function avatarColor(name = "") {
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const EMOJIS = ["💛", "⚛️", "🌟", "📚", "🔬", "💫", "🍎", "🎓"];

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("⚛️");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!user && !loading) {
      toast.error("Please login to see the tribute board");
      navigate("/login");
    }
  }, [user, navigate, loading]);

  /* ── Fetch messages ── */
  const fetchMessages = async () => {
    try {
      const res = await axiosPublic.get("/messages");
      // Backend returns array of messages
      setMessages(res.data);
    } catch (err) {
      toast.error("Could not load the message board.", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Optional: Refresh every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send message ── */
  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);
    const newMessage = {
      name: user.name,
      studentId: user.studentId,
      text: text.trim(),
      emoji: emoji,
      role: "student",
    };

    try {
      const res = await axiosPublic.post("/messages", newMessage);
      if (res.data) {
        setMessages((prev) => [
          ...prev,
          { ...newMessage, _id: Date.now(), createdAt: new Date() },
        ]);
        setText("");
        setShowEmoji(false);
        if (inputRef.current) inputRef.current.style.height = "auto";
      }
    } catch (err) {
      toast.error("Failed to send your message.", err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user && loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#fdf6e9]">
        Calculating Trajectory...
      </div>
    );

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#fdf6e9] relative">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Header ── */}
      <header className="shrink-0 z-10 border-b border-amber-200/60 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-200">
            ⚛️
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-stone-800">
              Physics Tribute Board
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              {messages.length} Contributions
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-stone-400 font-medium">Logged in as</p>
          <p className="text-sm font-bold text-amber-600">{user?.name}</p>
        </div>
      </header>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 z-0 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-stone-100 rounded-2xl animate-pulse w-3/4 mx-auto"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isOwn = msg.studentId === user?.studentId;
              const prevMsg = messages[idx - 1];
              const isSameUser = prevMsg?.studentId === msg.studentId;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar (Only show if not same user as previous message) */}
                  <div
                    className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all ${isSameUser ? "opacity-0 scale-0" : "opacity-100 scale-100"} ${avatarColor(msg.name)}`}
                  >
                    {getInitials(msg.name)}
                  </div>

                  <div
                    className={`flex flex-col max-w-[80%] sm:max-w-md ${isOwn ? "items-end" : "items-start"}`}
                  >
                    {!isSameUser && (
                      <div
                        className={`flex items-center gap-2 mb-1 px-1 ${isOwn ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-xs font-bold text-stone-700">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <div
                      className={`relative px-4 py-3 rounded-2xl text-sm shadow-sm transition-all hover:shadow-md
                      ${
                        isOwn
                          ? "bg-stone-800 text-stone-50 rounded-tr-none"
                          : "bg-white border border-amber-100 text-stone-800 rounded-tl-none"
                      }
                    `}
                    >
                      <span className="absolute -top-3 -right-2 text-lg">
                        {msg.emoji}
                      </span>
                      <p className="font-serif leading-relaxed italic">
                        &ldquo;{msg.text}&rdquo;
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="shrink-0 bg-white border-t border-amber-100 p-4 sm:p-6 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Emoji Selector */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="flex gap-3 mb-4 bg-stone-50 p-3 rounded-2xl border border-stone-200 overflow-x-auto justify-center"
              >
                {EMOJIS.map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      setEmoji(em);
                      setShowEmoji(false);
                    }}
                    className={`text-2xl hover:scale-125 transition-transform ${emoji === em ? "grayscale-0" : "grayscale opacity-50"}`}
                  >
                    {em}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 bg-stone-100 p-2 rounded-3xl focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/10 transition-all border border-transparent focus-within:border-amber-200">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm hover:bg-amber-50 transition-colors"
            >
              {emoji}
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Write a message of gratitude..."
              className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 text-sm text-stone-800 placeholder-stone-400 resize-none max-h-32"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 hover:bg-amber-600 disabled:bg-stone-300 disabled:shadow-none transition-all"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "🚀"
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-stone-400 mt-3 font-medium uppercase tracking-widest">
            Physics Lab Tribute Board • 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
