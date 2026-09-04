// src/pages/SettingsPage.tsx
import { useState } from "react"
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Settings.css"
import "../styles/Layout.css"

// ── Icons ──
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const BellIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const PaletteIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
const KeyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
const CameraIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12" /></svg>
const RightIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const EyeOffIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>

type SettingsTab = "profile" | "appearance" | "notifications" | "privacy" | "account"

const ACCENT_COLORS = [
    { label: "Violet", value: "#7c5cfc" },
    { label: "Teal", value: "#00d2a5" },
    { label: "Amber", value: "#f59e0b" },
    { label: "Rose", value: "#f87171" },
    { label: "Sky", value: "#60a5fa" },
    { label: "Emerald", value: "#34d399" },
    { label: "Pink", value: "#e879f9" },
    { label: "Orange", value: "#fb923c" },
]

const SETTINGS_TABS: { key: SettingsTab; label: string; icon: JSX.Element }[] = [
    { key: "profile", label: "Profile", icon: <UserIcon /> },
    { key: "appearance", label: "Appearance", icon: <PaletteIcon /> },
    { key: "notifications", label: "Notifications", icon: <BellIcon /> },
    { key: "privacy", label: "Privacy", icon: <ShieldIcon /> },
    { key: "account", label: "Account", icon: <KeyIcon /> },
]

function Toggle ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return <div className={`st-toggle ${on ? "on" : "off"}`} onClick={() => onChange(!on)}><div className="st-toggle-knob" /></div>
}
function Section ({ title, children }: { title?: string; children: React.ReactNode }) {
    return <div className="st-section">{title && <h3 className="st-section-title">{title}</h3>}<div className="st-section-body">{children}</div></div>
}
function Row ({ label, sub, children, danger }: { label: string; sub?: string; children?: React.ReactNode; danger?: boolean }) {
    return (
        <div className={`st-row ${danger ? "danger" : ""}`}>
            <div className="st-row-info"><span className="st-row-label">{label}</span>{sub && <span className="st-row-sub">{sub}</span>}</div>
            {children && <div className="st-row-control">{children}</div>}
        </div>
    )
}

export default function SettingsPage () {
    const { user, updateUser, theme, setTheme, logout } = useApp()

    const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
    const [saved, setSaved] = useState(false)

    // Profile form — pre-filled from context
    const [displayName, setDisplayName] = useState(user.name)
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [bio, setBio] = useState(user.bio)
    const [university, setUniversity] = useState(user.university)
    const [major, setMajor] = useState(user.major)
    const [year, setYear] = useState(user.year)
    const [avatarColor, setAvatarColor] = useState(user.avatarColor)

    // Appearance
    const [appTheme, setAppTheme] = useState<"light" | "dark" | "system">(theme)
    const [accentColor, setAccentColor] = useState(user.avatarColor)
    const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")
    const [compactMode, setCompactMode] = useState(false)
    const [animations, setAnimations] = useState(true)

    // Notifications
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [quizReminders, setQuizReminders] = useState(true)
    const [streakAlerts, setStreakAlerts] = useState(true)
    const [roomMessages, setRoomMessages] = useState(true)
    const [weeklyDigest, setWeeklyDigest] = useState(false)
    const [pushNotifs, setPushNotifs] = useState(true)

    // Privacy
    const [profilePublic, setProfilePublic] = useState(true)
    const [progressPublic, setProgressPublic] = useState(false)
    const [showOnline, setShowOnline] = useState(true)
    const [dataAnalytics, setDataAnalytics] = useState(true)
    const [personalised, setPersonalised] = useState(true)

    // Account
    const [showPw, setShowPw] = useState(false)
    const [currentPw, setCurrentPw] = useState("")
    const [newPw, setNewPw] = useState("")
    const [confirmPw, setConfirmPw] = useState("")
    const [twoFactor, setTwoFactor] = useState(false)

    const handleSave = () => {
        // Persist to context so sidebar/dashboard update instantly
        updateUser({
            name: displayName, username, email, bio, university, major, year,
            avatarColor,
            initials: displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const accentStyle = { "--st-user-accent": accentColor } as React.CSSProperties

    return (
        <PageLayout topbarActions={
            <button className={`st-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
                {saved ? <><CheckIcon /> Saved!</> : "Save changes"}
            </button>
        }>
            <div className="st-content" style={accentStyle}>

                {/* Left settings nav */}
                <nav className="st-settings-nav">
                    <div className="st-profile-mini">
                        <div className="st-profile-mini-avatar" style={{ background: avatarColor + "22", color: avatarColor }}>
                            {user.initials}
                            <button className="st-avatar-camera"><CameraIcon /></button>
                        </div>
                        <div className="st-profile-mini-info">
                            <span className="st-profile-mini-name">{displayName}</span>
                            <span className="st-profile-mini-email">{email}</span>
                        </div>
                    </div>

                    <div className="st-settings-nav-items">
                        {SETTINGS_TABS.map(tab => (
                            <button key={tab.key}
                                className={`st-settings-nav-item ${activeTab === tab.key ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                                style={activeTab === tab.key ? { color: accentColor, background: accentColor + "14", borderColor: accentColor + "44" } : {}}>
                                <span className="st-sn-icon">{tab.icon}</span>
                                <span>{tab.label}</span>
                                <RightIcon />
                            </button>
                        ))}
                    </div>

                    <button className="st-logout-btn" onClick={logout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign out
                    </button>
                </nav>

                {/* Right panel */}
                <div className="st-panel">

                    {/* ── PROFILE ── */}
                    {activeTab === "profile" && (
                        <div className="st-tab-content">
                            <div className="st-tab-heading"><h2>Profile</h2><p>Your personal information and public profile</p></div>
                            <Section title="Avatar">
                                <div className="st-avatar-picker">
                                    <div className="st-big-avatar" style={{ background: avatarColor + "22", color: avatarColor }}>
                                        {user.initials}
                                        <button className="st-big-avatar-camera"><CameraIcon /></button>
                                    </div>
                                    <div className="st-avatar-color-row">
                                        <span className="st-avatar-color-label">Avatar colour</span>
                                        <div className="st-color-dots">
                                            {ACCENT_COLORS.map(c => (
                                                <button key={c.value} className={`st-color-dot ${avatarColor === c.value ? "selected" : ""}`}
                                                    style={{ background: c.value }} onClick={() => setAvatarColor(c.value)} title={c.label}>
                                                    {avatarColor === c.value && <CheckIcon />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Section>
                            <Section title="Basic information">
                                <div className="st-form-grid">
                                    <div className="st-field"><label>Display name</label>
                                        <input className="st-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your full name" /></div>
                                    <div className="st-field"><label>Username</label>
                                        <div className="st-input-prefix-wrap"><span className="st-input-prefix">@</span>
                                            <input className="st-input prefixed" value={username} onChange={e => setUsername(e.target.value)} /></div></div>
                                    <div className="st-field full"><label>Email address</label>
                                        <input className="st-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                                    <div className="st-field full"><label>Bio</label>
                                        <textarea className="st-textarea" value={bio} onChange={e => setBio(e.target.value)} rows={3} /></div>
                                </div>
                            </Section>
                            <Section title="Academic info">
                                <div className="st-form-grid">
                                    <div className="st-field full"><label>University / Institution</label>
                                        <input className="st-input" value={university} onChange={e => setUniversity(e.target.value)} /></div>
                                    <div className="st-field"><label>Major / Course</label>
                                        <input className="st-input" value={major} onChange={e => setMajor(e.target.value)} /></div>
                                    <div className="st-field"><label>Year of study</label>
                                        <select className="st-select" value={year} onChange={e => setYear(e.target.value)}>
                                            {["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate", "Other"].map(y => <option key={y}>{y}</option>)}
                                        </select></div>
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* ── APPEARANCE ── */}
                    {activeTab === "appearance" && (
                        <div className="st-tab-content">
                            <div className="st-tab-heading"><h2>Appearance</h2><p>Customise how Smart Study looks and feels</p></div>
                            <Section title="Theme">
                                <div className="st-theme-cards">
                                    {(["light", "dark", "system"] as const).map(t => (
                                        <button key={t} className={`st-theme-card ${appTheme === t ? "active" : ""}`}
                                            onClick={() => { setAppTheme(t); if (t !== "system") setTheme(t) }}
                                            style={appTheme === t ? { borderColor: accentColor, boxShadow: `0 0 0 2px ${accentColor}28` } : {}}>
                                            <div className={`st-theme-preview ${t}`}>
                                                <div className="st-tp-sidebar" /><div className="st-tp-content"><div className="st-tp-line long" /><div className="st-tp-line short" /><div className="st-tp-card" /></div>
                                            </div>
                                            <span className="st-theme-label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                                            {appTheme === t && <span className="st-theme-check" style={{ background: accentColor }}><CheckIcon /></span>}
                                        </button>
                                    ))}
                                </div>
                            </Section>
                            <Section title="Accent colour">
                                <div className="st-accent-grid">
                                    {ACCENT_COLORS.map(c => (
                                        <button key={c.value} className={`st-accent-btn ${accentColor === c.value ? "selected" : ""}`}
                                            style={{ background: c.value + "18", borderColor: accentColor === c.value ? c.value : "transparent" }}
                                            onClick={() => setAccentColor(c.value)}>
                                            <div className="st-accent-swatch" style={{ background: c.value }} />
                                            <span style={{ color: accentColor === c.value ? c.value : "var(--st-text-secondary)" }}>{c.label}</span>
                                            {accentColor === c.value && <span className="st-accent-tick" style={{ color: c.value }}><CheckIcon /></span>}
                                        </button>
                                    ))}
                                </div>
                            </Section>
                            <Section title="Text size">
                                <div className="st-font-size-row">
                                    {(["small", "medium", "large"] as const).map(s => (
                                        <button key={s} className={`st-font-btn ${fontSize === s ? "active" : ""}`} onClick={() => setFontSize(s)}
                                            style={fontSize === s ? { borderColor: accentColor, color: accentColor, background: accentColor + "10" } : {}}>
                                            <span style={{ fontSize: s === "small" ? 12 : s === "medium" ? 14 : 17 }}>Aa</span>
                                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                        </button>
                                    ))}
                                </div>
                            </Section>
                            <Section title="Interface">
                                <Row label="Compact mode" sub="Reduce spacing and padding throughout the app"><Toggle on={compactMode} onChange={setCompactMode} /></Row>
                                <Row label="Animations" sub="Enable motion and transition effects"><Toggle on={animations} onChange={setAnimations} /></Row>
                            </Section>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {activeTab === "notifications" && (
                        <div className="st-tab-content">
                            <div className="st-tab-heading"><h2>Notifications</h2><p>Choose what you want to be notified about</p></div>
                            <Section title="Email notifications">
                                <Row label="Email notifications" sub="Receive updates to your inbox"><Toggle on={emailNotifs} onChange={setEmailNotifs} /></Row>
                                <Row label="Weekly digest" sub="A weekly summary of your progress"><Toggle on={weeklyDigest} onChange={setWeeklyDigest} /></Row>
                            </Section>
                            <Section title="In-app notifications">
                                <Row label="Push notifications" sub="Browser push notifications"><Toggle on={pushNotifs} onChange={setPushNotifs} /></Row>
                                <Row label="Quiz reminders" sub="Reminded when a quiz is due"><Toggle on={quizReminders} onChange={setQuizReminders} /></Row>
                                <Row label="Streak alerts" sub="Don't break your study streak"><Toggle on={streakAlerts} onChange={setStreakAlerts} /></Row>
                                <Row label="Study room messages" sub="New messages in your rooms"><Toggle on={roomMessages} onChange={setRoomMessages} /></Row>
                            </Section>
                        </div>
                    )}

                    {/* ── PRIVACY ── */}
                    {activeTab === "privacy" && (
                        <div className="st-tab-content">
                            <div className="st-tab-heading"><h2>Privacy</h2><p>Control your data and what others can see</p></div>
                            <Section title="Profile visibility">
                                <Row label="Public profile" sub="Allow others to find and view your profile"><Toggle on={profilePublic} onChange={setProfilePublic} /></Row>
                                <Row label="Share progress" sub="Let others see your quiz scores and streaks"><Toggle on={progressPublic} onChange={setProgressPublic} /></Row>
                                <Row label="Show online status" sub="Let room members see when you're online"><Toggle on={showOnline} onChange={setShowOnline} /></Row>
                            </Section>
                            <Section title="Data & personalisation">
                                <Row label="Usage analytics" sub="Help us improve with anonymous usage data"><Toggle on={dataAnalytics} onChange={setDataAnalytics} /></Row>
                                <Row label="Personalised AI" sub="AI recommendations based on your study patterns"><Toggle on={personalised} onChange={setPersonalised} /></Row>
                            </Section>
                            <Section title="Data">
                                <Row label="Download my data" sub="Export all your materials, summaries and quiz results"><button className="st-action-btn">Export</button></Row>
                                <Row label="Delete all data" sub="Permanently remove all your study data" danger><button className="st-danger-btn">Delete</button></Row>
                            </Section>
                        </div>
                    )}

                    {/* ── ACCOUNT ── */}
                    {activeTab === "account" && (
                        <div className="st-tab-content">
                            <div className="st-tab-heading"><h2>Account</h2><p>Security settings and active sessions</p></div>
                            <Section title="Change password">
                                <div className="st-pw-fields">
                                    <div className="st-field full"><label>Current password</label>
                                        <div className="st-input-eye-wrap">
                                            <input className="st-input with-eye" type={showPw ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" />
                                            <button className="st-eye-btn" onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOffIcon /> : <EyeIcon />}</button>
                                        </div></div>
                                    <div className="st-field"><label>New password</label>
                                        <input className="st-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password" /></div>
                                    <div className="st-field"><label>Confirm new password</label>
                                        <input className={`st-input ${confirmPw && newPw !== confirmPw ? "error" : confirmPw && newPw === confirmPw ? "valid" : ""}`}
                                            type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" /></div>
                                    <div className="st-field full">
                                        <button className="st-update-pw-btn" style={{ background: accentColor, boxShadow: `0 3px 14px ${accentColor}44` }}
                                            disabled={!currentPw || !newPw || newPw !== confirmPw}>Update password</button>
                                    </div>
                                </div>
                            </Section>
                            <Section title="Two-factor authentication">
                                <Row label="Two-factor authentication" sub={twoFactor ? "Your account is protected with 2FA" : "Add an extra layer of security"}>
                                    <Toggle on={twoFactor} onChange={setTwoFactor} />
                                </Row>
                            </Section>
                            <Section title="Active sessions">
                                <div className="st-sessions">
                                    {[
                                        { id: 1, device: "Chrome · macOS", location: "Manchester, UK", current: true, time: "Now" },
                                        { id: 2, device: "Safari · iPhone", location: "Manchester, UK", current: false, time: "2h ago" },
                                        { id: 3, device: "Firefox · Windows", location: "London, UK", current: false, time: "3d ago" },
                                    ].map(s => (
                                        <div className="st-session-row" key={s.id}>
                                            <div className="st-session-icon"><GlobeIcon /></div>
                                            <div className="st-session-info">
                                                <span className="st-session-device">{s.device}</span>
                                                <span className="st-session-loc">{s.location} · {s.time}</span>
                                            </div>
                                            {s.current ? <span className="st-session-current">Current</span> : <button className="st-session-revoke">Revoke</button>}
                                        </div>
                                    ))}
                                </div>
                            </Section>
                            <Section title="Danger zone">
                                <Row label="Delete account" sub="Permanently delete your account. This cannot be undone." danger>
                                    <button className="st-danger-btn" onClick={logout}><TrashIcon /> Delete account</button>
                                </Row>
                            </Section>
                        </div>
                    )}

                </div>
            </div>
        </PageLayout>
    )
}