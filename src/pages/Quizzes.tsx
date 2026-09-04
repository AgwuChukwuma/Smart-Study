// src/pages/QuizzesPage.tsx
import { useState } from "react"
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Quizzes.css"
import "../styles/Layout.css"

// ── Icons ──
const SparkleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" /><path d="M19 3l.9 2.6L22.5 6.5l-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9L19 3Z" opacity="0.5" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
const ArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
const CheckCircle = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
const XCircle = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
const TrophyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" /><rect x="6" y="18" width="12" height="4" /><path d="M6 9a6 6 0 0 0 12 0" /></svg>
const RefreshIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "rgba(251,146,60,0.14)", color: "#f97316", label: "Pending" },
    completed: { bg: "rgba(29,158,117,0.14)", color: "#1D9E75", label: "Completed" },
    "in-progress": { bg: "rgba(124,92,252,0.14)", color: "#7c5cfc", label: "In Progress" },
}
const LABELS = ["A", "B", "C", "D"]

function ScoreRing ({ score, color }: { score: number; color: string }) {
    const r = 44, circ = 2 * Math.PI * r
    return (
        <svg viewBox="0 0 100 100" width="120" height="120" className="qz-score-ring">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--ring-track,rgba(180,160,240,0.22))" strokeWidth="8" />
            <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${circ * score / 100} ${circ * (1 - score / 100)}`} strokeDashoffset={circ * 0.25}
                style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.34,1.56,.64,1)" }} />
            <text x="50" y="46" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="800" fill={color}>{score}</text>
            <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="var(--qz-text-muted,#9e8ec8)" fontWeight="600">out of 100</text>
        </svg>
    )
}

function QuizTaking ({ quiz, onFinish, onExit }: {
    quiz: ReturnType<typeof useApp>["quizzes"][0]
    onFinish: (score: number, answers: Record<number, string>) => void
    onExit: () => void
}) {
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [revealed, setRevealed] = useState(false)

    const q = quiz.questions[currentQ]
    if (!q) {
        return (
            <div className="qz-taking">
                <div style={{ padding: 60, textAlign: "center" }}>
                    <p style={{ marginBottom: 16 }}>This quiz has no questions available.</p>
                    <button className="qz-exit-btn" onClick={onExit}>← Back to quizzes</button>
                </div>
            </div>
        )
    }
    const total = quiz.questions.length
    const selected = answers[q.id]
    const isCorrect = selected === q.correct
    const answered = selected !== undefined
    const isLast = currentQ === total - 1
    const progress = ((currentQ + (answered ? 1 : 0)) / total) * 100

    const handleSelect = (optId: string) => {
        if (answered) return
        setAnswers(prev => ({ ...prev, [q.id]: optId }))
        setRevealed(true)
    }

    const handleNext = () => {
        if (isLast) {
            const all = { ...answers }
            const correct = quiz.questions.filter(qu => all[qu.id] === qu.correct).length
            onFinish(Math.round((correct / total) * 100), all)
        } else {
            setRevealed(!!answers[quiz.questions[currentQ + 1]?.id])
            setCurrentQ(c => c + 1)
        }
    }

    return (
        <div className="qz-taking">
            <div className="qz-taking-header">
                <button className="qz-exit-btn" onClick={onExit}><CloseIcon /> Exit</button>
                <div className="qz-taking-meta">
                    <span className="qz-q-counter">{currentQ + 1} / {total}</span>
                    <span className="qz-subject-dot" style={{ background: quiz.color }} />
                    <span className="qz-taking-subject" style={{ color: quiz.color }}>{quiz.subject}</span>
                </div>
                <div style={{ width: 64 }} />
            </div>
            <div className="qz-progress-track">
                <div className="qz-progress-fill" style={{ width: `${progress}%`, background: quiz.color }} />
            </div>
            <div className="qz-question-area">
                <div className="qz-q-card" key={q.id}>
                    <div className="qz-q-num" style={{ color: quiz.color, background: quiz.color + "18" }}>Q{currentQ + 1}</div>
                    <h2 className="qz-q-text">{q.text}</h2>
                    <div className="qz-options">
                        {q.options.map((opt, i) => {
                            let cls = "qz-option"
                            if (answered) {
                                if (opt.id === q.correct) cls += " correct"
                                else if (opt.id === selected) cls += " wrong"
                                else cls += " dimmed"
                            }
                            return (
                                <button key={opt.id} className={cls} onClick={() => handleSelect(opt.id)}
                                    style={answered && opt.id === q.correct ? { borderColor: "#1D9E75" } : undefined}>
                                    <span className="qz-opt-label" style={
                                        answered && opt.id === q.correct ? { background: "#1D9E75", color: "#fff" }
                                            : answered && opt.id === selected ? { background: "#ef4444", color: "#fff" } : {}
                                    }>{LABELS[i]}</span>
                                    <span className="qz-opt-text">{opt.text}</span>
                                    {answered && opt.id === q.correct && <span className="qz-opt-icon correct-icon"><CheckCircle /></span>}
                                    {answered && opt.id === selected && opt.id !== q.correct && <span className="qz-opt-icon wrong-icon"><XCircle /></span>}
                                </button>
                            )
                        })}
                    </div>
                    {revealed && (
                        <div className={`qz-explanation ${isCorrect ? "correct" : "wrong"}`}>
                            <div className="qz-exp-icon">{isCorrect ? <CheckCircle /> : <XCircle />}</div>
                            <div>
                                <p className="qz-exp-verdict">{isCorrect ? "Correct!" : "Incorrect"}</p>
                                <p className="qz-exp-text">{q.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="qz-nav-row">
                    <button className="qz-nav-btn secondary" onClick={() => { if (currentQ > 0) { setCurrentQ(c => c - 1); setRevealed(!!answers[quiz.questions[currentQ - 1].id]) } }} disabled={currentQ === 0}>
                        <ArrowLeft /> Prev
                    </button>
                    <button className="qz-nav-btn primary" onClick={handleNext} disabled={!answered}
                        style={{ background: quiz.color, boxShadow: `0 4px 16px ${quiz.color}44` }}>
                        {isLast ? "Finish" : "Next"} <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

function Results ({ quiz, score, answers, onRetry, onBack }: {
    quiz: ReturnType<typeof useApp>["quizzes"][0]
    score: number; answers: Record<number, string>
    onRetry: () => void; onBack: () => void
}) {
    const correct = quiz.questions.filter(q => answers[q.id] === q.correct).length
    const grade = score >= 90 ? "Excellent!" : score >= 75 ? "Great job!" : score >= 60 ? "Good effort!" : "Keep practising!"
    const [showReview, setShowReview] = useState(false)

    return (
        <div className="qz-results">
            <div className="qz-results-card">
                <div className="qz-results-header">
                    <div className="qz-trophy"><TrophyIcon /></div>
                    <h2 className="qz-results-grade">{grade}</h2>
                    <p className="qz-results-sub">You completed <strong>{quiz.title}</strong></p>
                </div>
                <div className="qz-results-ring-row">
                    <ScoreRing score={score} color={quiz.color} />
                    <div className="qz-results-stats">
                        <div className="qz-rs-item"><span className="qz-rs-val correct-val">{correct}</span><span className="qz-rs-lbl">Correct</span></div>
                        <div className="qz-rs-item"><span className="qz-rs-val wrong-val">{quiz.questions.length - correct}</span><span className="qz-rs-lbl">Wrong</span></div>
                        <div className="qz-rs-item"><span className="qz-rs-val">{quiz.questions.length}</span><span className="qz-rs-lbl">Total</span></div>
                    </div>
                </div>
                <div className="qz-results-actions">
                    <button className="qz-btn-primary" style={{ background: quiz.color, boxShadow: `0 4px 16px ${quiz.color}44` }} onClick={onRetry}><RefreshIcon /> Retry Quiz</button>
                    <button className="qz-btn-outline" onClick={() => setShowReview(v => !v)}>{showReview ? "Hide review" : "Review answers"}</button>
                    <button className="qz-btn-ghost" onClick={onBack}>← Back to quizzes</button>
                </div>
                {showReview && (
                    <div className="qz-review">
                        <h3 className="qz-review-title">Answer Review</h3>
                        {quiz.questions.map((q, i) => {
                            const ok = answers[q.id] === q.correct
                            const userOpt = q.options.find(o => o.id === answers[q.id])
                            const corrOpt = q.options.find(o => o.id === q.correct)
                            return (
                                <div key={q.id} className={`qz-review-item ${ok ? "ok" : "err"}`}>
                                    <div className="qz-review-num">{i + 1}</div>
                                    <div className="qz-review-body">
                                        <p className="qz-review-q">{q.text}</p>
                                        {!ok && <p className="qz-review-wrong">Your answer: {userOpt?.text ?? "—"}</p>}
                                        <p className="qz-review-correct">Correct: {corrOpt?.text}</p>
                                        <p className="qz-review-exp">{q.explanation}</p>
                                    </div>
                                    <div className={`qz-review-icon ${ok ? "ok" : "err"}`}>{ok ? <CheckCircle /> : <XCircle />}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

function QuizCard ({ quiz, idx, onStart }: {
    quiz: ReturnType<typeof useApp>["quizzes"][0]; idx: number; onStart: () => void
}) {
    const ss = STATUS_STYLE[quiz.status]
    return (
        <div className="qz-card" style={{ animationDelay: `${idx * 0.065}s` }}>
            <div className="qz-card-accent" style={{ background: quiz.color }} />
            <div className="qz-card-body">
                <div className="qz-card-top">
                    <span className="qz-card-subject" style={{ color: quiz.color }}>{quiz.subject}</span>
                    <span className="qz-status-badge" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                </div>
                <h3 className="qz-card-title">{quiz.title}</h3>
                <p className="qz-card-source">{quiz.sourceFile}</p>
                <div className="qz-card-meta">
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> {quiz.questions.length} questions</span>
                    <span className="qz-sep">·</span>
                    <span><ClockIcon /> {quiz.due}</span>
                    {quiz.attempts > 0 && <><span className="qz-sep">·</span><span>{quiz.attempts} attempt{quiz.attempts > 1 ? "s" : ""}</span></>}
                </div>
                {quiz.bestScore !== null && (
                    <div className="qz-card-score-row">
                        <div className="qz-card-score-bar-track"><div className="qz-card-score-bar-fill" style={{ width: `${quiz.bestScore}%`, background: quiz.color }} /></div>
                        <span className="qz-card-score-pct" style={{ color: quiz.color }}>{quiz.bestScore}%</span>
                    </div>
                )}
            </div>
            <div className="qz-card-footer">
                <button className="qz-start-btn" style={{ background: quiz.color, boxShadow: `0 3px 12px ${quiz.color}44` }} onClick={onStart}>
                    {quiz.status === "completed" ? "Retake" : quiz.status === "in-progress" ? "Continue" : "Start Quiz"} <ArrowRight />
                </button>
            </div>
        </div>
    )
}

export default function QuizzesPage () {
    const { quizzes, completeQuiz, updateQuiz } = useApp()
    const [view, setView] = useState<"browse" | "taking" | "results">("browse")
    const [activeQuiz, setActiveQuiz] = useState<ReturnType<typeof useApp>["quizzes"][0] | null>(null)
    const [finalScore, setFinalScore] = useState(0)
    const [lastAnswers, setLastAnswers] = useState<Record<number, string>>({})
    const [search, setSearch] = useState("")
    const [filterStatus, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")

    const filtered = quizzes.filter(q => {
        const s = search.toLowerCase()
        return (q.title.toLowerCase().includes(s) || q.subject.toLowerCase().includes(s)) &&
            (filterStatus === "all" || q.status === filterStatus)
    })

    const completedQuizzes = quizzes.filter(q => q.status === "completed")
    const avgScore = completedQuizzes.length
        ? Math.round(completedQuizzes.reduce((a, q) => a + (q.bestScore ?? 0), 0) / completedQuizzes.length) : 0

    const handleStart = (quiz: typeof activeQuiz) => {
        setActiveQuiz(quiz)
        setLastAnswers({})
        updateQuiz(quiz!.id, { status: "in-progress" })
        setView("taking")
    }

    const handleFinish = (score: number, answers: Record<number, string>) => {
        if (!activeQuiz) return
        setFinalScore(score)
        setLastAnswers(answers)
        completeQuiz(activeQuiz.id, score)
        setView("results")
    }

    if (view === "taking" && activeQuiz) {
        return (
            <div className={`qz-app`} style={{ minHeight: "100vh" }}>
                <div className="qz-bg-mesh" /><div className="qz-bg-dots" />
                <QuizTaking quiz={activeQuiz} onFinish={handleFinish} onExit={() => setView("browse")} />
            </div>
        )
    }
    if (view === "results" && activeQuiz) {
        return (
            <div className={`qz-app`} style={{ minHeight: "100vh" }}>
                <div className="qz-bg-mesh" />
                <Results quiz={activeQuiz} score={finalScore} answers={lastAnswers} onRetry={() => { setLastAnswers({}); setView("taking") }} onBack={() => setView("browse")} />
            </div>
        )
    }

    return (
        <PageLayout title="Quizzes" topbarActions={
            <button className="qz-gen-btn"><SparkleIcon /> Generate Quiz</button>
        }>
            <div className="qz-content">
                <div className="qz-heading">
                    <h1 className="qz-page-title">Quizzes</h1>
                    <p className="qz-page-sub">{quizzes.length} quizzes · test your knowledge</p>
                </div>

                <div className="qz-stats-row">
                    {[
                        { val: quizzes.length, lbl: "Total quizzes" },
                        { val: completedQuizzes.length, lbl: "Completed" },
                        { val: quizzes.filter(q => q.status === "pending").length, lbl: "Pending" },
                        { val: avgScore > 0 ? `${avgScore}%` : "—", lbl: "Avg. score" },
                    ].map((s, i) => (
                        <div className="qz-stat-pill" key={i}>
                            <span className="qz-stat-val">{s.val}</span>
                            <span className="qz-stat-lbl">{s.lbl}</span>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div style={{ marginBottom: 4 }}>
                    <div className="qz-search-wrap" style={{ maxWidth: 360, display: "flex", alignItems: "center", gap: 8, background: "var(--input-bg,rgba(255,255,255,0.88))", border: "1px solid var(--input-border,rgba(180,160,240,0.42))", borderRadius: 20, padding: "7px 14px", color: "var(--text-muted)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input style={{ background: "none", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "var(--text-primary)", width: "100%" }} placeholder="Search quizzes…" value={search} onChange={e => setSearch(e.target.value)} />
                        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)" }}><CloseIcon /></button>}
                    </div>
                </div>

                <div className="qz-toolbar">
                    <div className="qz-filter-tabs">
                        {(["all", "pending", "in-progress", "completed"] as const).map(f => (
                            <button key={f} className={`qz-filter-tab ${filterStatus === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                                {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                                <span className="qz-tab-count">{f === "all" ? quizzes.length : quizzes.filter(q => q.status === f).length}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 && (
                    <div className="qz-empty">
                        <div className="qz-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg></div>
                        <h3>No quizzes found</h3>
                        <p>Try adjusting your search or filter</p>
                        <button className="qz-empty-reset" onClick={() => { setSearch(""); setFilter("all") }}>Clear filters</button>
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="qz-grid">
                        {filtered.map((q, i) => (
                            <QuizCard key={q.id} quiz={q} idx={i} onStart={() => handleStart(q)} />
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}