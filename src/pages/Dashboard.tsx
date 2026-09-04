// src/pages/DashboardPage.tsx  (connected version)
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Dashboard.css"

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
)
const SummaryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)
const QuizIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)
const TrendUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
)
const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEKLY_ACTIVITY = [40, 65, 50, 80, 70, 90, 60]
const maxBar = Math.max(...WEEKLY_ACTIVITY)

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
    PDF: { bg: "rgba(248,113,113,0.14)", color: "#ef4444" },
    DOCX: { bg: "rgba(96,165,250,0.14)", color: "#3b82f6" },
    PPT: { bg: "rgba(251,146,60,0.14)", color: "#f97316" },
    TXT: { bg: "rgba(156,163,175,0.14)", color: "#6b7280" },
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "rgba(251,146,60,0.14)", color: "#f97316", label: "Pending" },
    completed: { bg: "rgba(29,158,117,0.14)", color: "#1D9E75", label: "Completed" },
    "in-progress": { bg: "rgba(124,92,252,0.14)", color: "#7c5cfc", label: "In Progress" },
}

export default function DashboardPage () {
    const { user, materials, summaries, quizzes, navigate } = useApp()

    const completedQuizzes = quizzes.filter(q => q.status === "completed")
    const avgScore = completedQuizzes.length
        ? Math.round(completedQuizzes.reduce((a, q) => a + (q.bestScore ?? 0), 0) / completedQuizzes.length)
        : 0

    const subjectProgress = [
        { subject: "Chemistry", pct: 72, color: "#7c5cfc" },
        { subject: "Mathematics", pct: 58, color: "#00d2a5" },
        { subject: "History", pct: 85, color: "#f59e0b" },
        { subject: "Economics", pct: 44, color: "#f87171" },
    ]

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    const dueToday = quizzes.filter(q => q.due === "Today" && q.status !== "completed").length
    const newSummaries = summaries.length

    return (
        <PageLayout
            topbarActions={
                <button
                    className="dash-upload-btn"
                    onClick={() => navigate("materials")}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                    <PlusIcon /> Upload
                </button>
            }
        >
            <div className="dash-content">
                {/* Greeting */}
                <div className="dash-greeting">
                    <div>
                        <h1 className="dash-greeting-title">{greeting}, {user.name.split(" ")[0]} 👋</h1>
                        <p className="dash-greeting-sub">
                            {dueToday > 0 ? `You have ${dueToday} quiz${dueToday > 1 ? "zes" : ""} due today` : "No quizzes due today"}
                            {newSummaries > 0 ? ` and ${newSummaries} AI summaries ready.` : "."}
                        </p>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="dash-stats-grid">
                    {[
                        { label: "Materials uploaded", value: materials.length.toString(), icon: <UploadIcon />, trend: "+3 this week", up: true },
                        { label: "AI summaries", value: summaries.length.toString(), icon: <SummaryIcon />, trend: "+2 this week", up: true },
                        { label: "Quizzes taken", value: quizzes.filter(q => q.attempts > 0).length.toString(), icon: <QuizIcon />, trend: "+2 this week", up: true },
                        { label: "Avg. quiz score", value: avgScore > 0 ? `${avgScore}%` : "—", icon: <span>⭐</span>, trend: "Overall average", up: true },
                    ].map((stat, i) => (
                        <div className="dash-stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                            <div className="dash-stat-top">
                                <span className="dash-stat-label">{stat.label}</span>
                                <div className="dash-stat-icon">{stat.icon}</div>
                            </div>
                            <div className="dash-stat-value">{stat.value}</div>
                            <div className="dash-stat-trend up">
                                <TrendUpIcon /> {stat.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mid row */}
                <div className="dash-mid-grid">
                    <div className="dash-card dash-chart-card">
                        <div className="dash-card-header">
                            <h2 className="dash-card-title">Weekly Activity</h2>
                            <span className="dash-card-badge">This week</span>
                        </div>
                        <div className="dash-bar-chart">
                            {WEEKLY_ACTIVITY.map((val, i) => (
                                <div className="dash-bar-col" key={i}>
                                    <div className={`dash-bar ${i === 5 ? "dash-bar-accent" : ""}`} style={{ height: `${(val / maxBar) * 100}%` }} />
                                    <span className="dash-bar-label">{WEEK_DAYS[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dash-card dash-progress-card">
                        <div className="dash-card-header">
                            <h2 className="dash-card-title">Subject Progress</h2>
                            <span className="dash-card-badge">4 subjects</span>
                        </div>
                        <div className="dash-subject-list">
                            {subjectProgress.map((s, i) => (
                                <div className="dash-subject-row" key={i}>
                                    <div className="dash-subject-info">
                                        <span className="dash-subject-name">{s.subject}</span>
                                        <span className="dash-subject-pct">{s.pct}%</span>
                                    </div>
                                    <div className="dash-progress-track">
                                        <div className="dash-progress-fill" style={{ width: `${s.pct}%`, background: s.color, animationDelay: `${0.2 + i * 0.1}s` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="dash-bottom-grid">
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h2 className="dash-card-title">Recent Materials</h2>
                            <button className="dash-link-btn" onClick={() => navigate("materials")}>View all</button>
                        </div>
                        <div className="dash-material-list">
                            {materials.slice(0, 4).map((m, i) => {
                                const ts = TYPE_COLORS[m.type] || TYPE_COLORS.PDF
                                return (
                                    <div className="dash-material-row" key={m.id} style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                                        <div className={`dash-file-badge`} style={{ background: ts.bg, color: ts.color }}>{m.type}</div>
                                        <div className="dash-material-info">
                                            <span className="dash-material-name">{m.name}</span>
                                            <span className="dash-material-meta">{m.subject} · {m.pages}p · {m.uploadedAgo}</span>
                                        </div>
                                        <button className="dash-action-btn" onClick={() => navigate("summaries")}>Summarize</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h2 className="dash-card-title">Quizzes</h2>
                            <button className="dash-link-btn" onClick={() => navigate("quizzes")}>View all</button>
                        </div>
                        <div className="dash-quiz-list">
                            {quizzes.slice(0, 4).map((q, i) => {
                                const ss = STATUS_STYLE[q.status]
                                return (
                                    <div className="dash-quiz-row" key={q.id} style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                                        <div className="dash-quiz-info">
                                            <span className="dash-quiz-title">{q.title}</span>
                                            <div className="dash-quiz-meta">
                                                <span><ClockIcon /> {q.due}</span>
                                                <span>{q.questions.length} questions</span>
                                            </div>
                                        </div>
                                        <div className="dash-quiz-right">
                                            {q.bestScore !== null && <span className="dash-quiz-score">{q.bestScore}%</span>}
                                            <span className="dash-status-badge" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </PageLayout>
    )
}