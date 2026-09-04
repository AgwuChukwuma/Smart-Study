// src/components/Layout.tsx
// Shared Sidebar + Topbar + PageLayout used by all authenticated pages
import "../styles/Layout.css"

import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"

// ── Icons ──────────────────────────────────────
export const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
)
export const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
)
export const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
)
export const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)
const UploadNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
)
const SummaryNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const QuizNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)
const ChartNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const UsersNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)
const SettingsNavIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)
const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
)
const FireIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
)
const LogOutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
)
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

// ── Nav items ──────────────────────────────────
const NAV_ITEMS = [
    { key: "dashboard", label: "Overview", icon: <HomeIcon /> },
    { key: "materials", label: "My Materials", icon: <UploadNavIcon /> },
    { key: "summaries", label: "AI Summaries", icon: <SummaryNavIcon /> },
    { key: "quizzes", label: "Quizzes", icon: <QuizNavIcon /> },
    { key: "progress", label: "Progress", icon: <ChartNavIcon /> },
    { key: "collaborate", label: "Collaborate", icon: <UsersNavIcon /> },
    { key: "settings", label: "Settings", icon: <SettingsNavIcon /> },
]

// ── Notification dropdown ──────────────────────
function NotificationDropdown ({ onClose }: { onClose: () => void }) {
    const { notifications, markNotifRead, markAllNotifsRead, navigate } = useApp()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose()
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [onClose])

    const typeIcon: Record<string, string> = { quiz: "📝", summary: "✨", upload: "📁", collab: "💬", streak: "🔥" }

    return (
        <div className="notif-dropdown" ref={ref}>
            <div className="notif-header">
                <span className="notif-title">Notifications</span>
                <button className="notif-mark-all" onClick={markAllNotifsRead}>Mark all read</button>
            </div>
            <div className="notif-list">
                {notifications.slice(0, 8).map(n => (
                    <div
                        key={n.id}
                        className={`notif-item ${n.read ? "" : "unread"}`}
                        onClick={() => { markNotifRead(n.id); if (n.link) { navigate(n.link); onClose() } }}
                    >
                        <span className="notif-icon">{typeIcon[n.type]}</span>
                        <div className="notif-body">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-msg">{n.message}</span>
                            <span className="notif-item-time">{n.time}</span>
                        </div>
                        {!n.read && <span className="notif-unread-dot" />}
                    </div>
                ))}
                {notifications.length === 0 && <div className="notif-empty">No notifications</div>}
            </div>
        </div>
    )
}

// ── Sidebar ────────────────────────────────────
export function Sidebar () {
    const { currentPage, navigate, user, theme, logout, sidebarOpen, setSidebarOpen } = useApp()

    return (
        <aside className={`shared-sidebar ${sidebarOpen ? "open" : "collapsed"} ${theme}`}>
            <div className="shared-sidebar-top">
                <button className="shared-logo" onClick={() => navigate("dashboard")}>
                    <div className="shared-logo-icon"><BookIcon /></div>
                    {sidebarOpen && <span>Smart Study</span>}
                </button>
                <button className="shared-collapse-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        {sidebarOpen ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                    </svg>
                </button>
            </div>

            <nav className="shared-nav">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.key}
                        className={`shared-nav-item ${currentPage === item.key ? "active" : ""}`}
                        onClick={() => navigate(item.key)}
                        title={!sidebarOpen ? item.label : undefined}
                    >
                        <span className="shared-nav-icon">{item.icon}</span>
                        {sidebarOpen && <span className="shared-nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="shared-sidebar-bottom">
                {sidebarOpen && (
                    <div className="shared-streak">
                        <div className="shared-streak-icon"><FireIcon /></div>
                        <div>
                            <div className="shared-streak-num">7 day streak</div>
                            <div className="shared-streak-sub">Keep it up!</div>
                        </div>
                    </div>
                )}
                <div className="shared-avatar-row">
                    <div
                        className="shared-avatar"
                        style={{ background: user.avatarColor + "22", color: user.avatarColor }}
                        onClick={() => navigate("settings")}
                        title="Settings"
                    >
                        {user.initials}
                    </div>
                    {sidebarOpen && (
                        <div className="shared-avatar-info" onClick={() => navigate("settings")} style={{ cursor: "pointer" }}>
                            <span className="shared-avatar-name">{user.name}</span>
                            <span className="shared-avatar-email">{user.email}</span>
                        </div>
                    )}
                </div>
                <button className="shared-logout-btn" onClick={logout} title="Sign out">
                    <LogOutIcon />
                    {sidebarOpen && <span>Sign out</span>}
                </button>
            </div>
        </aside>
    )
}

// ── Topbar ─────────────────────────────────────
export function Topbar ({ title, actions }: { title?: string; actions?: React.ReactNode }) {
    const { theme, toggleTheme, unreadCount, navigate } = useApp()
    const [search, setSearch] = useState("")
    const [showNotifs, setShowNotifs] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    const PAGE_SEARCH_MAP: Record<string, string> = {
        "materials": "materials", "summaries": "summaries",
        "quizzes": "quizzes", "collaborate": "collaborate",
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Navigate to relevant page based on search
        if (search.trim()) setSearch("")
    }

    return (
        <header className={`shared-topbar ${theme}`}>
            <div className="shared-topbar-left">
                {showSearch ? (
                    <form className="shared-search-wrap" onSubmit={handleSearch} style={{ opacity: 1 }}>
                        <SearchIcon />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search materials, summaries, quizzes…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && <button type="button" className="shared-search-clear" onClick={() => setSearch("")}><CloseIcon /></button>}
                        <button type="button" className="shared-search-clear" onClick={() => setShowSearch(false)}><CloseIcon /></button>
                    </form>
                ) : (
                    <button className="shared-search-trigger" onClick={() => setShowSearch(true)}>
                        <SearchIcon />
                        <span>Search…</span>
                    </button>
                )}
                {title && !showSearch && <h1 className="shared-topbar-title">{title}</h1>}
            </div>

            <div className="shared-topbar-right">
                {actions}
                <div className="shared-notif-wrap">
                    <button
                        className="shared-icon-btn"
                        onClick={() => setShowNotifs(v => !v)}
                        title="Notifications"
                    >
                        <BellIcon />
                        {unreadCount > 0 && <span className="shared-notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                    </button>
                    {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
                </div>
                <button className="shared-icon-btn" onClick={toggleTheme} title="Toggle theme">
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
                <button className="shared-icon-btn" onClick={() => navigate("settings")} title="Settings">
                    <SettingsNavIcon />
                </button>
            </div>
        </header>
    )
}

// ── Page layout wrapper ────────────────────────
export function PageLayout ({ children, title, topbarActions }: {
    children: React.ReactNode
    title?: string
    topbarActions?: React.ReactNode
}) {
    const { theme } = useApp()
    return (
        <div className={`page-layout ${theme}`}>
            <div className="page-bg-mesh" />
            <div className="page-bg-dots" />
            <Sidebar />
            <div className="page-main">
                <Topbar title={title} actions={topbarActions} />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    )
}