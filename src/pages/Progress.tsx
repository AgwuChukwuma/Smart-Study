// src/pages/ProgressPage.tsx
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Progress.css"
import "../styles/Layout.css"

const TrendUpIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
const TrendDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEKLY_ACT = [40, 65, 50, 80, 70, 90, 60]
const HEATMAP_DATA: number[][] = [[0, 2, 1, 3, 2, 0, 1], [1, 3, 2, 4, 3, 1, 2], [0, 1, 3, 2, 4, 2, 0], [2, 3, 1, 4, 3, 2, 1]]
const HEATMAP_WEEKS = ["W1", "W2", "W3", "W4"]
const HEATMAP_DAYS = ["M", "T", "W", "T", "F", "S", "S"]

const SUBJECTS = [
    { name: "Chemistry", pct: 72, color: "#7c5cfc", quizzes: 8, avg: 82, trend: +6 },
    { name: "Mathematics", pct: 58, color: "#00d2a5", quizzes: 12, avg: 74, trend: +4 },
    { name: "History", pct: 85, color: "#f59e0b", quizzes: 6, avg: 90, trend: +8 },
    { name: "Economics", pct: 44, color: "#f87171", quizzes: 5, avg: 68, trend: -3 },
    { name: "Physics", pct: 61, color: "#60a5fa", quizzes: 7, avg: 77, trend: +2 },
    { name: "Biology", pct: 79, color: "#34d399", quizzes: 9, avg: 86, trend: +5 },
]

const BADGES = [
    { id: 1, label: "First Quiz", earned: true, color: "#f59e0b", desc: "Completed your first quiz" },
    { id: 2, label: "7-Day Streak", earned: true, color: "#f87171", desc: "Studied 7 days in a row" },
    { id: 3, label: "High Scorer", earned: true, color: "#7c5cfc", desc: "Scored 90%+ on a quiz" },
    { id: 4, label: "Dedicated", earned: true, color: "#00d2a5", desc: "Uploaded 20+ study materials" },
    { id: 5, label: "Top of Class", earned: false, color: "#60a5fa", desc: "Score 95%+ on 3 consecutive quizzes" },
    { id: 6, label: "Study Master", earned: false, color: "#34d399", desc: "Complete all subjects with 80%+" },
]

function RadialRing ({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) {
    const r = size / 2 - 7, circ = 2 * Math.PI * r
    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--pg-ring-track,rgba(180,160,240,0.22))" strokeWidth="6" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${circ * pct / 100} ${circ * (1 - pct / 100)}`}
                strokeDashoffset={circ * 0.25}
                style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.34,1.56,.64,1)" }}
            />
            <text x={size / 2} y={size / 2 - 3} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="800" fill={color}>{pct}%</text>
            <text x={size / 2} y={size / 2 + 12} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--pg-text-muted,#9e8ec8)" fontWeight="600">mastery</text>
        </svg>
    )
}

function Sparkline ({ data, color }: { data: number[]; color: string }) {
    const w = 200, h = 48, min = Math.min(...data), max = Math.max(...data)
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4
        return `${x},${y}`
    }).join(" ")
    const area = `M0,${h} L${pts.split(" ").map(p => p).join(" L")} L${w},${h} Z`
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#sg-${color.replace("#", "")})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function ProgressPage () {
    const { materials, summaries, quizzes } = useApp()

    const completedQ = quizzes.filter(q => q.status === "completed")
    const avgScore = completedQ.length ? Math.round(completedQ.reduce((a, q) => a + (q.bestScore ?? 0), 0) / completedQ.length) : 87
    const bestScore = completedQ.length ? Math.max(...completedQ.map(q => q.bestScore ?? 0)) : 94
    const maxBar = Math.max(...WEEKLY_ACT)

    const recentActivity = [
        ...completedQ.slice(0, 3).map(q => ({ id: q.id, type: "quiz", label: `Completed ${q.title}`, score: q.bestScore, time: "Recently", color: q.color })),
        ...summaries.slice(0, 2).map(s => ({ id: s.id + 1000, type: "summary", label: `Generated ${s.title} summary`, score: null, time: s.generatedAgo, color: s.color })),
        ...materials.slice(0, 1).map(m => ({ id: m.id + 2000, type: "upload", label: `Uploaded ${m.name}`, score: null, time: m.uploadedAgo, color: m.color })),
    ].slice(0, 6)

    return (
        <PageLayout title="Progress">
            <div className="pg-content">
                <div className="pg-greeting">
                    <h2 className="pg-greeting-title">Your Learning Journey</h2>
                    <p className="pg-greeting-sub">Track how you're improving across all subjects and activities.</p>
                </div>

                {/* Stat cards */}
                <div className="pg-stat-cards">
                    {[
                        { label: "Quizzes taken", value: quizzes.filter(q => q.attempts > 0).length.toString(), sub: "+8 this week", up: true, color: "#7c5cfc" },
                        { label: "Avg. quiz score", value: avgScore > 0 ? `${avgScore}%` : "—", sub: "+4% vs last wk", up: true, color: "#f59e0b" },
                        { label: "Study streak", value: "7", sub: "days in a row", up: true, color: "#f87171" },
                        { label: "Materials read", value: materials.length.toString(), sub: "+3 this week", up: true, color: "#34d399" },
                        { label: "Summaries gen.", value: summaries.length.toString(), sub: "+5 this week", up: true, color: "#60a5fa" },
                        { label: "Best score", value: bestScore > 0 ? `${bestScore}%` : "—", sub: "All time high", up: null, color: "#c084fc" },
                    ].map((s, i) => (
                        <div className="pg-stat-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                            <div className="pg-sc-top">
                                <span className="pg-sc-label">{s.label}</span>
                                <div className="pg-sc-icon" style={{ background: s.color + "18", color: s.color }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                </div>
                            </div>
                            <div className="pg-sc-value" style={{ color: s.color }}>{s.value}</div>
                            <div className={`pg-sc-trend ${s.up === true ? "up" : s.up === false ? "down" : "neutral"}`}>
                                {s.up === true && <TrendUpIcon />}{s.up === false && <TrendDownIcon />}{s.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mid row: chart + heatmap */}
                <div className="pg-mid-row">
                    <div className="pg-card pg-chart-card">
                        <div className="pg-card-header">
                            <div>
                                <h3 className="pg-card-title">Score over time</h3>
                                <p className="pg-card-sub">Avg: <strong>{avgScore}%</strong> · Best: <strong>{bestScore}%</strong></p>
                            </div>
                        </div>
                        <div className="pg-chart-area">
                            <div className="pg-bar-chart">
                                {WEEKLY_ACT.map((val, i) => (
                                    <div className="pg-bar-col" key={i}>
                                        <div className={`pg-bar ${i === 5 ? "pg-bar-accent" : ""}`} style={{ height: `${(val / maxBar) * 100}%` }} />
                                        <span className="pg-bar-label">{WEEK_DAYS[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pg-card pg-heatmap-card">
                        <div className="pg-card-header">
                            <div>
                                <h3 className="pg-card-title">Study activity</h3>
                                <p className="pg-card-sub">Last 4 weeks</p>
                            </div>
                        </div>
                        <div className="pg-heatmap">
                            <div className="pg-heatmap-days">{HEATMAP_DAYS.map(d => <span key={d}>{d}</span>)}</div>
                            <div className="pg-heatmap-grid">
                                {HEATMAP_DATA.map((week, wi) => (
                                    <div className="pg-heatmap-row" key={wi}>
                                        <span className="pg-heatmap-week">{HEATMAP_WEEKS[wi]}</span>
                                        {week.map((val, di) => (
                                            <div key={di} className="pg-heatmap-cell"
                                                style={{ background: val === 0 ? "var(--pg-heatmap-empty)" : "#7c5cfc" + ["30", "60", "90", ""][Math.min(val - 1, 3)] }}
                                                title={`${val} activities`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject mastery */}
                <div className="pg-card pg-subject-card">
                    <div className="pg-card-header">
                        <h3 className="pg-card-title">Subject mastery</h3>
                        <span className="pg-card-badge">{SUBJECTS.length} subjects</span>
                    </div>
                    <div className="pg-subject-grid">
                        {SUBJECTS.map((s, i) => (
                            <div className="pg-subject-item" key={i} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                                <div className="pg-subject-top">
                                    <RadialRing pct={s.pct} color={s.color} size={84} />
                                    <div className="pg-subject-info">
                                        <h4 className="pg-subject-name">{s.name}</h4>
                                        <div className="pg-subject-meta">
                                            <span>{s.quizzes} quizzes</span><span className="pg-dot">·</span><span>Avg {s.avg}%</span>
                                        </div>
                                        <div className={`pg-subject-trend ${s.trend >= 0 ? "up" : "down"}`}>
                                            {s.trend >= 0 ? <TrendUpIcon /> : <TrendDownIcon />} {s.trend >= 0 ? "+" : ""}{s.trend}% this month
                                        </div>
                                        <div className="pg-subject-bar-track">
                                            <div className="pg-subject-bar-fill" style={{ width: `${s.pct}%`, background: s.color, animationDelay: `${0.2 + i * 0.07}s` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sparklines + activity */}
                <div className="pg-bottom-row">
                    <div className="pg-card pg-sparklines-card">
                        <div className="pg-card-header"><h3 className="pg-card-title">Score trends</h3></div>
                        <div className="pg-sparkline-list">
                            {SUBJECTS.map((s, i) => {
                                const fakeData = Array.from({ length: 8 }, (_, k) => Math.min(100, Math.max(40, s.avg - 15 + k * 3 + Math.round(Math.random() * 8))))
                                return (
                                    <div className="pg-sparkline-row" key={i}>
                                        <div className="pg-sparkline-label">
                                            <span className="pg-sparkline-dot" style={{ background: s.color }} />
                                            <span className="pg-sparkline-name">{s.name}</span>
                                        </div>
                                        <div className="pg-sparkline-chart"><Sparkline data={fakeData} color={s.color} /></div>
                                        <span className="pg-sparkline-val" style={{ color: s.color }}>{s.avg}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pg-card pg-activity-card">
                        <div className="pg-card-header">
                            <h3 className="pg-card-title">Recent activity</h3>
                        </div>
                        <div className="pg-activity-list">
                            {recentActivity.map((a, i) => (
                                <div className="pg-activity-row" key={a.id} style={{ animationDelay: `${i * 0.055}s` }}>
                                    <div className="pg-activity-dot-col">
                                        <div className="pg-activity-dot" style={{ background: a.color }} />
                                        {i < recentActivity.length - 1 && <div className="pg-activity-line" />}
                                    </div>
                                    <div className="pg-activity-info">
                                        <span className="pg-activity-label">{a.label}</span>
                                        <span className="pg-activity-time">{a.time}</span>
                                    </div>
                                    {a.score !== null && (
                                        <span className="pg-activity-score" style={{ color: a.score >= 85 ? "#1D9E75" : a.score >= 70 ? "#7c5cfc" : "#f87171" }}>
                                            {a.score}%
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="pg-card pg-badges-card">
                    <div className="pg-card-header">
                        <h3 className="pg-card-title">Achievements</h3>
                        <span className="pg-card-badge">{BADGES.filter(b => b.earned).length} / {BADGES.length} earned</span>
                    </div>
                    <div className="pg-badges-grid">
                        {BADGES.map((b, i) => (
                            <div key={b.id} className={`pg-badge-item ${b.earned ? "earned" : "locked"}`} style={{ animationDelay: `${i * 0.07}s` }}>
                                <div className="pg-badge-icon" style={b.earned ? { background: b.color + "1a", color: b.color, borderColor: b.color + "44" } : {}}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
                                    {b.earned && <span className="pg-badge-check"><CheckIcon /></span>}
                                </div>
                                <span className="pg-badge-label">{b.label}</span>
                                <span className="pg-badge-desc">{b.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}