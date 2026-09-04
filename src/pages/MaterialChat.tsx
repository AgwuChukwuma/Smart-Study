import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"
import "../styles/MaterialChat.css"

const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
const SparkleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="15" height="15"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" /><path d="M19 3l.9 2.6L22.5 6.5l-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9L19 3Z" opacity="0.5" /></svg>
const ChatBubbleIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>

const SUGGESTIONS = [
    "Summarize the hardest part",
    "Give me a practice question",
    "Explain this more simply",
]

function ChatWindow ({ materialId, color, onClose }: { materialId: number; color: string; onClose: () => void }) {
    const { chatHistories, askQuestion, clearChat } = useApp()
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const messages = chatHistories[materialId] || []

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages, loading])

    const send = async (question: string) => {
        const q = question.trim()
        if (!q || loading) return
        setInput("")
        setLoading(true)
        await askQuestion(materialId, q)
        setLoading(false)
    }

    return (
        <div className="chat-panel" style={{ ["--accent-color" as any]: color }}>
            <div className="chat-panel-header">
                <div className="chat-panel-title">
                    <SparkleIcon />
                    Ask about this document
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {messages.length > 0 && (
                        <button className="chat-clear-btn" onClick={() => clearChat(materialId)}>
                            Clear
                        </button>
                    )}
                    <button className="chat-popup-close" onClick={onClose}><CloseIcon /></button>
                </div>
            </div>

            <div ref={scrollRef} className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-empty-state">
                        <div className="chat-empty-icon"><ChatBubbleIcon /></div>
                        <p>Ask anything about this document — explanations, examples, or practice questions, grounded in your notes.</p>
                        <div className="chat-suggestions">
                            {SUGGESTIONS.map(s => (
                                <button key={s} className="chat-suggestion-chip" onClick={() => send(s)}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(m => (
                    <div key={m.id} className={`chat-row ${m.role}`}>
                        <div className={`chat-avatar ${m.role}`} style={m.role === "user" ? { background: color } : undefined}>
                            {m.role === "user" ? "You" : "AI"}
                        </div>
                        <div className="chat-bubble">{m.content}</div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-row assistant">
                        <div className="chat-avatar assistant">AI</div>
                        <div className="chat-typing"><span /><span /><span /></div>
                    </div>
                )}
            </div>

            <div className="chat-input-bar">
                <input
                    className="chat-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) } }}
                    placeholder="Ask a question…"
                    disabled={loading}
                    autoFocus
                />
                <button
                    className="chat-send-btn"
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    style={{ background: color }}
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    )
}

export default function MaterialChat ({ materialId, color }: { materialId: number; color: string }) {
    const [open, setOpen] = useState(false)
    const { chatHistories } = useApp()
    const hasMessages = (chatHistories[materialId] || []).length > 0

    return (
        <>
            <button
                className="chat-fab"
                onClick={() => setOpen(v => !v)}
                style={{ background: color, boxShadow: `0 6px 20px ${color}66` }}
                title="Ask about this document"
            >
                {open ? <CloseIcon /> : <ChatBubbleIcon />}
                {hasMessages && !open && <span className="chat-fab-badge" />}
            </button>

            {open && (
                <>
                    <div className="chat-overlay-backdrop" onClick={() => setOpen(false)} />
                    <div className="chat-popup">
                        <ChatWindow materialId={materialId} color={color} onClose={() => setOpen(false)} />
                    </div>
                </>
            )}
        </>
    )
}