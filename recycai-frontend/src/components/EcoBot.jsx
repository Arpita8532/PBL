import { useState, useRef, useEffect } from "react";

const BACKEND = "http://localhost:5000";

export default function EcoBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm EcoBot 🌱 Ask me anything about recycling, your pickups, or Green Credits.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    setError(null);

    const userMsg = { role: "user", content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    // Placeholder assistant message to stream tokens into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder
          .decode(value)
          .split("\n")
          .filter((l) => l.startsWith("data:"));

        for (const line of lines) {
          try {
            const payload = JSON.parse(line.slice(5));
            if (payload.error) {
              setError(payload.error);
              break;
            }
            if (payload.token) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + payload.token,
                };
                return updated;
              });
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Is Ollama running?");
      // Remove the empty assistant placeholder on error
      setMessages((prev) =>
        prev[prev.length - 1].content === "" ? prev.slice(0, -1) : prev
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm EcoBot 🌱 Ask me anything about recycling, your pickups, or Green Credits.",
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <style>{`
        @keyframes ecoPulse {
          0%   { box-shadow: 0 0 0 0 rgba(245,158,11,0.75), 0 6px 28px rgba(245,158,11,0.5); }
          70%  { box-shadow: 0 0 0 16px rgba(245,158,11,0),  0 6px 28px rgba(245,158,11,0.25); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0),  0 6px 28px rgba(245,158,11,0.5); }
        }
        .ecobot-idle { animation: ecoPulse 2.2s ease-in-out infinite; }
      `}</style>
      <button
        id="ecobot-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        title={open ? "Close EcoBot" : "Chat with EcoBot"}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl z-50 text-white font-bold transition-transform duration-200 hover:scale-110 active:scale-95 ${
          open ? "" : "ecobot-idle"
        }`}
        style={open
          ? { background: "#ef4444", boxShadow: "0 4px 20px rgba(239,68,68,0.55)" }
          : { background: "linear-gradient(135deg,#f59e0b,#ea580c)" }
        }
      >
        {open ? "✕" : "♻️"}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div
          id="ecobot-window"
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col z-50 overflow-hidden"
          style={{ height: "460px" }}
        >
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <div>
                <p className="font-bold text-sm leading-none">EcoBot</p>
                <p className="text-green-200 text-xs mt-0.5">Recycling Assistant</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              className="text-green-200 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-green-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs mr-1.5 mt-1 shrink-0">
                    🌱
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm border border-green-100 rounded-bl-sm"
                  }`}
                >
                  {m.content || (
                    <span className="flex gap-1 items-center text-gray-400">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Error banner */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-green-100 flex items-end gap-2 p-2 bg-white shrink-0">
            <textarea
              ref={inputRef}
              id="ecobot-input"
              rows={1}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 resize-none leading-relaxed"
              placeholder="Ask about recycling…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{ maxHeight: "80px", background: "#ffffff", color: "#1f2937" }}
            />
            <button
              id="ecobot-send-btn"
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
