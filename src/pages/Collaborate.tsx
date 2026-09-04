// src/pages/CollaboratePage.tsx
import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Collaborate.css"
import "../styles/Layout.css"

// ── Icons ──
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const SendIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const LinkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
const DocIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const CrownIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="11" height="11"><path d="M2 19l2-9 5 5 3-9 3 9 5-5 2 9H2z" /></svg>
const EmojiIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
const AttachIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>

type RoomTab = "chat" | "materials" | "members"

interface Member { id: number; name: string; initials: string; role: "owner" | "member"; online: boolean; color: string; score?: number }
interface Message { id: number; memberId: number; text: string; time: string; isMine: boolean }
interface SharedFile { id: number; name: string; type: "PDF" | "DOCX" | "PPT"; uploadedBy: string; uploadedAgo: string; size: string }
interface Room { id: number; name: string; subject: string; color: string; members: Member[]; messages: Message[]; files: SharedFile[]; isPrivate: boolean; unread: number; lastActivity: string }

const FILE_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
    PDF: { bg: "rgba(248,113,113,0.14)", color: "#ef4444" },
    DOCX: { bg: "rgba(96,165,250,0.14)", color: "#3b82f6" },
    PPT: { bg: "rgba(251,146,60,0.14)", color: "#f97316" },
}

const INITIAL_ROOMS: Room[] = [
    {
        id: 1, name: "Chem Squad 🧪", subject: "Chemistry", color: "#7c5cfc", isPrivate: false, unread: 3, lastActivity: "2m ago",
        members: [
            { id: 1, name: "Alex Johnson", initials: "AJ", role: "owner", online: true, color: "#7c5cfc", score: 88 },
            { id: 2, name: "Maya Patel", initials: "MP", role: "member", online: true, color: "#f59e0b", score: 92 },
            { id: 3, name: "Sam Rivera", initials: "SR", role: "member", online: false, color: "#f87171", score: 76 },
            { id: 4, name: "Jordan Lee", initials: "JL", role: "member", online: true, color: "#34d399", score: 84 },
        ],
        messages: [
            { id: 1, memberId: 2, text: "Hey everyone! Did you all review Chapter 4 on reaction mechanisms?", time: "10:12", isMine: false },
            { id: 2, memberId: 1, text: "Yes! The SN2 vs SN1 part was tricky. I used Smart Study to generate a summary.", time: "10:14", isMine: true },
            { id: 3, memberId: 4, text: "Same here. The quiz really helped me understand the stereochemistry section 🎉", time: "10:15", isMine: false },
            { id: 4, memberId: 2, text: "I can share the summary I generated! It explains it really well.", time: "10:19", isMine: false },
            { id: 5, memberId: 1, text: "Great idea Maya. I've also uploaded the lecture slides to our shared materials.", time: "10:21", isMine: true },
        ],
        files: [
            { id: 1, name: "Organic Chemistry Ch.4 — Reaction Mechanisms.pdf", type: "PDF", uploadedBy: "Alex", uploadedAgo: "2h ago", size: "3.2 MB" },
            { id: 2, name: "SN1 vs SN2 Study Guide.docx", type: "DOCX", uploadedBy: "Maya", uploadedAgo: "3h ago", size: "0.9 MB" },
        ],
    },
    {
        id: 2, name: "History Nerds 📚", subject: "History", color: "#f59e0b", isPrivate: true, unread: 0, lastActivity: "1h ago",
        members: [
            { id: 1, name: "Alex Johnson", initials: "AJ", role: "member", online: true, color: "#7c5cfc", score: 90 },
            { id: 5, name: "Chris Wong", initials: "CW", role: "owner", online: true, color: "#f59e0b", score: 94 },
            { id: 6, name: "Priya Sharma", initials: "PS", role: "member", online: false, color: "#60a5fa", score: 88 },
        ],
        messages: [
            { id: 1, memberId: 5, text: "Don't forget our WWI group quiz is on Friday!", time: "09:00", isMine: false },
            { id: 2, memberId: 1, text: "I shared the AI summary I generated. Really clean breakdown of the July Crisis.", time: "09:10", isMine: true },
        ],
        files: [
            { id: 1, name: "WWI Lecture Notes.docx", type: "DOCX", uploadedBy: "Alex", uploadedAgo: "Yesterday", size: "1.1 MB" },
        ],
    },
    {
        id: 3, name: "Maths Collective", subject: "Mathematics", color: "#00d2a5", isPrivate: false, unread: 7, lastActivity: "Just now",
        members: [
            { id: 1, name: "Alex Johnson", initials: "AJ", role: "member", online: true, color: "#7c5cfc", score: 74 },
            { id: 7, name: "Tom Fischer", initials: "TF", role: "owner", online: true, color: "#00d2a5", score: 96 },
            { id: 8, name: "Lena Brooks", initials: "LB", role: "member", online: true, color: "#c084fc", score: 82 },
        ],
        messages: [
            { id: 1, memberId: 7, text: "Who got the chain rule question wrong on the last practice? No judgment 😅", time: "11:00", isMine: false },
            { id: 2, memberId: 1, text: "The mnemonic that helped me: 'outside in, multiply'.", time: "11:03", isMine: true },
        ],
        files: [
            { id: 1, name: "Calculus Integration Practice Set 3.pdf", type: "PDF", uploadedBy: "Tom", uploadedAgo: "Just now", size: "1.8 MB" },
        ],
    },
]

function NewRoomModal ({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, subject: string, isPrivate: boolean) => void }) {
    const [name, setName] = useState("")
    const [subject, setSubject] = useState("")
    const [isPrivate, setPrivate] = useState(false)
    return (
        <div className="co-modal-overlay" onClick={onClose}>
            <div className="co-modal" onClick={e => e.stopPropagation()}>
                <div className="co-modal-header">
                    <h3 className="co-modal-title">Create study room</h3>
                    <button className="co-modal-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="co-modal-body">
                    <div className="co-form-field"><label>Room name</label>
                        <input className="co-form-input" placeholder="e.g. Chem Squad 🧪" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="co-form-field"><label>Subject</label>
                        <input className="co-form-input" placeholder="e.g. Chemistry" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>
                    <div className="co-form-check">
                        <div className={`co-toggle ${isPrivate ? "on" : "off"}`} onClick={() => setPrivate(v => !v)}>
                            <div className="co-toggle-knob" />
                        </div>
                        <div><span className="co-check-label">Private room</span><span className="co-check-sub">Only invited members can join</span></div>
                    </div>
                </div>
                <div className="co-modal-footer">
                    <button className="co-modal-cancel" onClick={onClose}>Cancel</button>
                    <button className="co-modal-create" disabled={!name.trim()} onClick={() => { if (name.trim()) { onCreate(name, subject, isPrivate); onClose() } }}>Create room</button>
                </div>
            </div>
        </div>
    )
}

function InviteModal ({ room, onClose }: { room: Room; onClose: () => void }) {
    const [copied, setCopied] = useState(false)
    const link = `https://smartstudy.app/rooms/${room.id}`
    const copy = () => { navigator.clipboard.writeText(link).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    return (
        <div className="co-modal-overlay" onClick={onClose}>
            <div className="co-modal" onClick={e => e.stopPropagation()}>
                <div className="co-modal-header"><h3 className="co-modal-title">Invite to {room.name}</h3><button className="co-modal-close" onClick={onClose}><CloseIcon /></button></div>
                <div className="co-modal-body">
                    <div className="co-form-field"><label>Invite by email</label>
                        <div className="co-invite-row"><input className="co-form-input" placeholder="classmate@university.edu" /><button className="co-invite-send">Send</button></div>
                    </div>
                    <div className="co-form-field"><label>Or share invite link</label>
                        <div className="co-link-row"><span className="co-link-text">{link}</span>
                            <button className="co-link-copy" onClick={copy}>{copied ? <><CheckIcon /> Copied!</> : <><LinkIcon /> Copy</>}</button>
                        </div>
                    </div>
                </div>
                <div className="co-modal-footer"><button className="co-modal-cancel" onClick={onClose}>Close</button></div>
            </div>
        </div>
    )
}

function RoomPanel ({ room, onBack }: { room: Room; onBack: () => void }) {
    const [tab, setTab] = useState<RoomTab>("chat")
    const [msgText, setMsgText] = useState("")
    const [messages, setMessages] = useState(room.messages)
    const [showInvite, setInvite] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

    const getMember = (id: number) => room.members.find(m => m.id === id)
    const online = room.members.filter(m => m.online)

    const send = () => {
        if (!msgText.trim()) return
        setMessages(prev => [...prev, { id: prev.length + 1, memberId: 1, text: msgText.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isMine: true }])
        setMsgText("")
    }

    return (
        <>
            {showInvite && <InviteModal room={room} onClose={() => setInvite(false)} />}
            <div className="co-room-panel">
                <div className="co-room-header">
                    <div className="co-room-header-left">
                        <button className="co-back-btn" onClick={onBack}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6" /></svg></button>
                        <div className="co-room-color-dot" style={{ background: room.color }} />
                        <div>
                            <h2 className="co-room-name">{room.name}</h2>
                            <p className="co-room-meta">
                                <span className="co-online-count">{online.length} online</span>
                                <span className="co-meta-sep">·</span><span>{room.members.length} members</span>
                                <span className="co-meta-sep">·</span>
                                <span>{room.isPrivate ? <><LockIcon /> Private</> : <><GlobeIcon /> Public</>}</span>
                            </p>
                        </div>
                    </div>
                    <div className="co-room-header-actions">
                        <div className="co-member-stack">
                            {online.slice(0, 4).map(m => (
                                <div key={m.id} className="co-stack-avatar" style={{ background: m.color + "22", color: m.color }} title={m.name}>{m.initials}</div>
                            ))}
                        </div>
                        <button className="co-invite-btn" onClick={() => setInvite(true)}><PlusIcon /> Invite</button>
                    </div>
                </div>

                <div className="co-room-tabs">
                    {(["chat", "materials", "members"] as RoomTab[]).map(t => (
                        <button key={t} className={`co-room-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}
                            style={tab === t ? { color: room.color, borderColor: room.color } : {}}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                            {t === "materials" && <span className="co-tab-count">{room.files.length}</span>}
                            {t === "members" && <span className="co-tab-count">{room.members.length}</span>}
                        </button>
                    ))}
                </div>

                {tab === "chat" && (
                    <div className="co-chat-area">
                        <div className="co-messages">
                            {messages.map((msg, i) => {
                                const m = getMember(msg.memberId)
                                if (!m) return null
                                const showAv = !msg.isMine && (i === 0 || messages[i - 1].memberId !== msg.memberId)
                                return (
                                    <div key={msg.id} className={`co-msg-row ${msg.isMine ? "mine" : "theirs"}`}>
                                        {!msg.isMine && (
                                            <div className="co-msg-avatar-slot">
                                                {showAv ? <div className="co-msg-avatar" style={{ background: m.color + "22", color: m.color }}>{m.initials}</div>
                                                    : <div className="co-msg-avatar-placeholder" />}
                                            </div>
                                        )}
                                        <div className="co-msg-bubble-col">
                                            {showAv && !msg.isMine && <span className="co-msg-sender" style={{ color: m.color }}>{m.name}</span>}
                                            <div className="co-msg-bubble" style={msg.isMine ? { background: room.color } : {}}>{msg.text}</div>
                                            <span className="co-msg-time">{msg.time}</span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={endRef} />
                        </div>
                        <div className="co-chat-input-row">
                            <button className="co-chat-action-btn"><AttachIcon /></button>
                            <button className="co-chat-action-btn"><EmojiIcon /></button>
                            <input className="co-chat-input" placeholder="Type a message…" value={msgText}
                                onChange={e => setMsgText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())} />
                            <button className="co-send-btn" style={{ background: room.color, boxShadow: `0 3px 12px ${room.color}44` }} onClick={send} disabled={!msgText.trim()}><SendIcon /></button>
                        </div>
                    </div>
                )}

                {tab === "materials" && (
                    <div className="co-tab-content">
                        <div className="co-tab-header"><p className="co-tab-desc">{room.files.length} shared files</p>
                            <button className="co-share-btn" style={{ background: room.color }}><DocIcon /> Share file</button>
                        </div>
                        <div className="co-file-list">
                            {room.files.map(f => {
                                const ts = FILE_TYPE_STYLE[f.type]
                                return (
                                    <div className="co-file-row" key={f.id}>
                                        <div className="co-file-icon" style={{ background: ts.bg, color: ts.color }}><DocIcon /></div>
                                        <div className="co-file-info">
                                            <span className="co-file-name">{f.name}</span>
                                            <span className="co-file-meta">
                                                <span className="co-file-type-badge" style={{ background: ts.bg, color: ts.color }}>{f.type}</span>
                                                <span>{f.uploadedBy}</span><span className="co-sep">·</span>
                                                <span>{f.size}</span><span className="co-sep">·</span><span>{f.uploadedAgo}</span>
                                            </span>
                                        </div>
                                        <button className="co-file-action">Open</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {tab === "members" && (
                    <div className="co-tab-content">
                        <div className="co-tab-header">
                            <p className="co-tab-desc">{room.members.length} members · {online.length} online</p>
                            <button className="co-share-btn" style={{ background: room.color }} onClick={() => setInvite(true)}><PlusIcon /> Invite</button>
                        </div>
                        <div className="co-member-list">
                            {[...room.members].sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0)).map(m => (
                                <div className="co-member-row" key={m.id}>
                                    <div className="co-avatar-wrap" style={{ width: 38, height: 38 }}>
                                        <div className="co-avatar" style={{ width: 38, height: 38, background: m.color + "22", color: m.color, fontSize: 12, fontWeight: 800, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.initials}</div>
                                        <span className={`co-online-dot ${m.online ? "on" : "off"}`} />
                                    </div>
                                    <div className="co-member-info">
                                        <div className="co-member-name-row">
                                            <span className="co-member-name">{m.name}</span>
                                            {m.role === "owner" && <span className="co-owner-badge"><CrownIcon /> Owner</span>}
                                        </div>
                                        <span className={`co-member-status ${m.online ? "on" : "off"}`}>{m.online ? "● Online" : "○ Offline"}</span>
                                    </div>
                                    {m.score != null && (
                                        <div className="co-member-score">
                                            <span className="co-member-score-val" style={{ color: room.color }}>{m.score}%</span>
                                            <span className="co-member-score-lbl">avg</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

function RoomCard ({ room, idx, onClick }: { room: Room; idx: number; onClick: () => void }) {
    const online = room.members.filter(m => m.online)
    return (
        <div className="co-room-card" style={{ animationDelay: `${idx * 0.07}s` }} onClick={onClick}>
            <div className="co-rc-accent" style={{ background: room.color }} />
            <div className="co-rc-body">
                <div className="co-rc-top">
                    <span className="co-rc-subject" style={{ color: room.color }}>{room.subject}</span>
                    <div className="co-rc-badges">
                        {room.isPrivate ? <span className="co-rc-badge private"><LockIcon /> Private</span> : <span className="co-rc-badge public"><GlobeIcon /> Public</span>}
                        {room.unread > 0 && <span className="co-unread-dot">{room.unread}</span>}
                    </div>
                </div>
                <h3 className="co-rc-name">{room.name}</h3>
                <div className="co-rc-members">
                    {room.members.slice(0, 5).map(m => (
                        <div key={m.id} className="co-rc-avatar" style={{ background: m.color + "22", color: m.color }} title={m.name}>
                            {m.initials}
                            {m.online && <span className="co-rc-online" />}
                        </div>
                    ))}
                </div>
                <div className="co-rc-footer">
                    <span className="co-rc-meta">{online.length} online · {room.files.length} files</span>
                    <span className="co-rc-time">{room.lastActivity}</span>
                </div>
            </div>
        </div>
    )
}

export default function CollaboratePage () {
    const { unreadCount } = useApp()
    const [rooms, setRooms] = useState(INITIAL_ROOMS)
    const [activeRoom, setActiveRoom] = useState<Room | null>(null)
    const [showNewRoom, setShowNewRoom] = useState(false)
    const [search, setSearch] = useState("")

    const COLORS = ["#7c5cfc", "#00d2a5", "#f59e0b", "#f87171", "#60a5fa", "#34d399"]

    const handleCreate = (name: string, subject: string, isPrivate: boolean) => {
        const r: Room = {
            id: rooms.length + 1, name, subject: subject || "General",
            color: COLORS[rooms.length % COLORS.length],
            isPrivate, unread: 0, lastActivity: "Just now",
            members: [{ id: 1, name: "Alex Johnson", initials: "AJ", role: "owner", online: true, color: "#7c5cfc" }],
            messages: [], files: [],
        }
        setRooms(prev => [...prev, r])
        setActiveRoom(r)
    }

    const filtered = rooms.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.subject.toLowerCase().includes(search.toLowerCase())
    )
    const totalOnline = [...new Set(rooms.flatMap(r => r.members.filter(m => m.online).map(m => m.id)))].length

    return (
        <PageLayout title="Collaborate" topbarActions={
            <button className="co-new-room-btn" onClick={() => setShowNewRoom(true)}><PlusIcon /> New Room</button>
        }>
            {showNewRoom && <NewRoomModal onClose={() => setShowNewRoom(false)} onCreate={handleCreate} />}

            {activeRoom ? (
                <RoomPanel room={activeRoom} onBack={() => setActiveRoom(null)} />
            ) : (
                <div className="co-content">
                    <div className="co-heading">
                        <h1 className="co-page-title">Collaborate</h1>
                        <p className="co-page-sub">{rooms.length} study rooms · {totalOnline} classmates online</p>
                    </div>

                    <div className="co-stats-row">
                        {[
                            { val: rooms.length, lbl: "Study rooms" },
                            { val: totalOnline, lbl: "Online now" },
                            { val: rooms.reduce((a, r) => a + r.files.length, 0), lbl: "Shared files" },
                            { val: rooms.reduce((a, r) => a + r.unread, 0), lbl: "Unread messages" },
                        ].map((s, i) => (
                            <div className="co-stat-pill" key={i}>
                                <span className="co-stat-val">{s.val}</span>
                                <span className="co-stat-lbl">{s.lbl}</span>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--input-bg,rgba(255,255,255,0.88))", border: "1px solid var(--input-border,rgba(180,160,240,0.42))", borderRadius: 20, padding: "7px 14px", maxWidth: 340, color: "var(--text-muted)" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input style={{ background: "none", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "var(--text-primary)", width: "100%" }} placeholder="Search rooms…" value={search} onChange={e => setSearch(e.target.value)} />
                            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)" }}><CloseIcon /></button>}
                        </div>
                    </div>

                    {filtered.length === 0 && (
                        <div className="co-empty">
                            <div className="co-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                            <h3>No rooms found</h3><p>Try a different search or create a new room</p>
                            <button className="co-empty-create" onClick={() => setShowNewRoom(true)}>Create a room</button>
                        </div>
                    )}

                    {filtered.length > 0 && (
                        <div className="co-rooms-grid">
                            {filtered.map((r, i) => <RoomCard key={r.id} room={r} idx={i} onClick={() => setActiveRoom(r)} />)}
                            <div className="co-create-tile" onClick={() => setShowNewRoom(true)}>
                                <div className="co-create-icon"><PlusIcon /></div>
                                <span className="co-create-label">Create new room</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    )
}