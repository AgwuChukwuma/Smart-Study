// src/pages/AISummariesPage.tsx
import { useState } from "react"
import { useApp } from "../context/AppContext"
import { PageLayout } from "./Layout"
import FlashcardDeck from "./FlashCardDeck"
import MaterialChat from "./MaterialChat"
import "../styles/AiSummaries.css"
import "../styles/Layout.css"

const SparkleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="16" height="16"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" /><path d="M19 3l.9 2.6L22.5 6.5l-2.6.9L19 10l-.9-2.6L15.5 6.5l2.6-.9L19 3Z" opacity="0.6" /></svg>
const CopyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
const TagIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
const RefreshIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
const QuizIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
const FlashcardIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="6" width="16" height="12" rx="2" /><path d="M6 2h16v12" /></svg>
const RightIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="9 18 15 12 9 6" /></svg>

const FILE_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
    PDF: { bg: "rgba(248,113,113,0.14)", color: "#ef4444" },
    DOCX: { bg: "rgba(96,165,250,0.14)", color: "#3b82f6" },
    PPT: { bg: "rgba(251,146,60,0.14)", color: "#f97316" },
}

function TypingDots () {
    return <span className="ai-typing-dots"><span /><span /><span /></span>
}

function SummaryDetail ({
    summary, onClose, onDelete, onGenerateQuiz,
    flashcardSet, onGenerateFlashcards, flashcardsLoading,
}: {
    summary: ReturnType<typeof useApp>["summaries"][0]
    onClose: () => void
    onDelete: (id: number) => void
    onGenerateQuiz: () => void
    flashcardSet: ReturnType<typeof useApp>["flashcardSets"][0] | undefined
    onGenerateFlashcards: () => void
    flashcardsLoading: boolean
}) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        const text = `${summary.title}\n\n${summary.overview}\n\nKey Points:\n${summary.keyPoints.map((kp, i) => `${i + 1}. ${kp.text}`).join("\n")}`
        navigator.clipboard.writeText(text).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    const ts = FILE_TYPE_STYLE[summary.fileType] || FILE_TYPE_STYLE.PDF

    return (
        <div className="ai-detail-panel">
            <div className="ai-detail-header">
                <div className="ai-detail-header-left">
                    <div className="ai-detail-subject-dot" style={{ background: summary.color }} />
                    <div>
                        <h2 className="ai-detail-title">{summary.title}</h2>
                        <div className="ai-detail-meta">
                            <span className="ai-detail-file-badge" style={{ background: ts.bg, color: ts.color }}>{summary.fileType}</span>
                            <span>{summary.sourceFile}</span>
                            <span className="ai-sep">·</span>
                            <ClockIcon /><span>{summary.readTime}</span>
                            <span className="ai-sep">·</span>
                            <span>{summary.wordCount} words</span>
                        </div>
                    </div>
                </div>
                <div className="ai-detail-header-actions">
                    <button className="ai-icon-action" onClick={copy} title="Copy">{copied ? <CheckIcon /> : <CopyIcon />}</button>
                    <button className="ai-icon-action" title="Download"><DownloadIcon /></button>
                    <button className="ai-icon-action danger" onClick={() => onDelete(summary.id)} title="Delete"><TrashIcon /></button>
                    <button className="ai-icon-action" onClick={onClose}><CloseIcon /></button>
                </div>
            </div>
            <div className="ai-detail-body">
                <div className="ai-generated-label">
                    <SparkleIcon /><span>AI-generated summary</span>
                    <span className="ai-gen-time">{summary.generatedAgo}</span>
                </div>
                <section className="ai-section">
                    <h3 className="ai-section-title">Overview</h3>
                    <p className="ai-overview-text">{summary.overview}</p>
                </section>
                <section className="ai-section">
                    <h3 className="ai-section-title">Key points</h3>
                    <div className="ai-key-points">
                        {summary.keyPoints.map((kp, i) => (
                            <div key={kp.id} className="ai-key-point" style={{ animationDelay: `${i * 0.07}s` }}>
                                <div className="ai-kp-num" style={{ background: summary.color + "18", color: summary.color }}>{i + 1}</div>
                                <p className="ai-kp-text">{kp.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="ai-section">
                    <h3 className="ai-section-title">Topics covered</h3>
                    <div className="ai-tags-row">
                        {summary.tags.map(tag => (
                            <span key={tag} className="ai-tag" style={{ borderColor: summary.color + "44", color: summary.color, background: summary.color + "10" }}>
                                <TagIcon /> {tag}
                            </span>
                        ))}
                    </div>
                </section>

                <div className="ai-quiz-cta">
                    <div className="ai-quiz-cta-left"><QuizIcon />
                        <div>
                            <p className="ai-quiz-cta-title">Ready to test yourself?</p>
                            <p className="ai-quiz-cta-sub">Generate a quiz from this summary</p>
                        </div>
                    </div>
                    <button className="ai-quiz-cta-btn" onClick={onGenerateQuiz}>Generate quiz</button>
                </div>

                {flashcardSet ? (
                    <section className="ai-section">
                        <h3 className="ai-section-title">Flashcards</h3>
                        <FlashcardDeck cards={flashcardSet.cards} color={summary.color} />
                    </section>
                ) : (
                    <div className="ai-quiz-cta">
                        <div className="ai-quiz-cta-left"><FlashcardIcon />
                            <div>
                                <p className="ai-quiz-cta-title">Want to drill with flashcards?</p>
                                <p className="ai-quiz-cta-sub">Generate a flashcard deck from this summary</p>
                            </div>
                        </div>
                        <button className="ai-quiz-cta-btn" onClick={onGenerateFlashcards} disabled={flashcardsLoading}>
                            {flashcardsLoading ? "Generating…" : "Generate flashcards"}
                        </button>
                    </div>
                )}

                {summary.materialId && (
                    <MaterialChat materialId={summary.materialId} color={summary.color} />
                )}
            </div>
        </div>
    )
}

function SummaryCard ({ s, idx, isActive, onClick }: {
    s: ReturnType<typeof useApp>["summaries"][0]
    idx: number; isActive: boolean; onClick: () => void
}) {
    const ts = FILE_TYPE_STYLE[s.fileType] || FILE_TYPE_STYLE.PDF
    return (
        <div className={`ai-card ${isActive ? "active" : ""}`} style={{ animationDelay: `${idx * 0.06}s` }} onClick={onClick}>
            <div className="ai-card-top">
                <div className="ai-card-accent" style={{ background: s.color }} />
                <div className="ai-card-subject-row">
                    <span className="ai-card-subject" style={{ color: s.color }}>{s.subject}</span>
                    <span className="ai-file-badge" style={{ background: ts.bg, color: ts.color }}>{s.fileType}</span>
                </div>
            </div>
            <h3 className="ai-card-title">{s.title}</h3>
            <p className="ai-card-preview">{s.overview.slice(0, 110)}…</p>
            <div className="ai-card-footer">
                <div className="ai-card-meta">
                    <span><ClockIcon /> {s.readTime}</span>
                    <span className="ai-sep">·</span>
                    <span>{s.generatedAgo}</span>
                </div>
                <span className="ai-card-arrow"><RightIcon /></span>
            </div>
        </div>
    )
}

export default function AISummariesPage () {
    const {
        summaries, deleteSummary, materials, generateSummary, generateQuiz, navigate,
        flashcardSets, generateFlashcards,
    } = useApp()
    const [activeId, setActiveId] = useState<number | null>(summaries[0]?.id ?? null)
    const [search, setSearch] = useState("")
    const [generating, setGenerating] = useState(false)
    const [flashcardsLoading, setFlashcardsLoading] = useState(false)

    const activeSummary = summaries.find(s => s.id === activeId) ?? null
    const activeFlashcardSet = activeSummary?.materialId
        ? flashcardSets.find(f => f.materialId === activeSummary.materialId)
        : undefined

    const handleDelete = (id: number) => {
        deleteSummary(id)
        setActiveId(summaries.find(s => s.id !== id)?.id ?? null)
    }

    const handleGenerate = async () => {
        const matWithoutSummary = materials.find(m => !m.hasSummary)
        if (!matWithoutSummary && materials.length === 0) return
        setGenerating(true)
        const mat = matWithoutSummary || materials[0]
        const s = await generateSummary(mat.id)
        if (s) setActiveId(s.id)
        setGenerating(false)
    }

    const handleGenerateQuiz = async () => {
        if (!activeSummary?.materialId) return
        const q = await generateQuiz(activeSummary.materialId)
        if (q) navigate("quizzes")
    }

    const handleGenerateFlashcards = async () => {
        if (!activeSummary?.materialId) return
        setFlashcardsLoading(true)
        await generateFlashcards(activeSummary.materialId)
        setFlashcardsLoading(false)
    }

    const filtered = summaries.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.subject.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <PageLayout
            topbarActions={
                <button className="ai-generate-btn" onClick={handleGenerate} disabled={generating}>
                    {generating ? <><TypingDots /> Generating…</> : <><SparkleIcon /> New Summary</>}
                </button>
            }
        >
            <div className="ai-panes">
                {/* Left list */}
                <div className="ai-list-pane">
                    <div className="ai-list-header">
                        <div>
                            <h1 className="ai-page-title">AI Summaries</h1>
                            <p className="ai-page-sub">{summaries.length} summaries generated</p>
                        </div>
                        <button className="ai-refresh-btn" onClick={handleGenerate} title="Generate new"><RefreshIcon /></button>
                    </div>
                    <div className="ai-stats-strip">
                        <div className="ai-stat-item"><span className="ai-stat-val">{summaries.length}</span><span className="ai-stat-lbl">Total</span></div>
                        <div className="ai-stat-sep" />
                        <div className="ai-stat-item"><span className="ai-stat-val">{summaries.reduce((a, s) => a + s.wordCount, 0).toLocaleString()}</span><span className="ai-stat-lbl">Words</span></div>
                        <div className="ai-stat-sep" />
                        <div className="ai-stat-item"><span className="ai-stat-val">{Array.from(new Set(summaries.map(s => s.subject))).length}</span><span className="ai-stat-lbl">Subjects</span></div>
                    </div>

                    {/* Search */}
                    <div style={{ padding: "10px 12px 0" }}>
                        <div className="ai-search-wrap" style={{ maxWidth: "100%" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input type="text" placeholder="Search summaries, topics…" value={search} onChange={e => setSearch(e.target.value)} />
                            {search && <button className="ai-search-clear" onClick={() => setSearch("")}><CloseIcon /></button>}
                        </div>
                    </div>

                    <div className="ai-cards-list">
                        {generating && (
                            <div className="ai-card generating">
                                <div className="ai-card-top"><div className="ai-card-accent skel" /><div className="ai-card-subject-row"><span className="skel-line" style={{ width: 72 }} /><span className="skel-badge" /></div></div>
                                <div className="skel-line wide" style={{ marginBottom: 6 }} /><div className="skel-line" style={{ width: "80%" }} />
                            </div>
                        )}
                        {filtered.length === 0 && !generating && (
                            <div className="ai-empty"><SparkleIcon /><p>No summaries found</p>
                                <button className="ai-empty-clear" onClick={() => setSearch("")}>Clear search</button>
                            </div>
                        )}
                        {filtered.map((s, i) => (
                            <SummaryCard key={s.id} s={s} idx={i} isActive={activeId === s.id} onClick={() => setActiveId(s.id)} />
                        ))}
                    </div>
                </div>

                {/* Right detail */}
                <div className="ai-detail-pane">
                    {activeSummary ? (
                        <SummaryDetail
                            summary={activeSummary}
                            onClose={() => setActiveId(null)}
                            onDelete={handleDelete}
                            onGenerateQuiz={handleGenerateQuiz}
                            flashcardSet={activeFlashcardSet}
                            onGenerateFlashcards={handleGenerateFlashcards}
                            flashcardsLoading={flashcardsLoading}
                        />
                    ) : (
                        <div className="ai-detail-empty">
                            <div className="ai-detail-empty-icon"><SparkleIcon /></div>
                            <h3>Select a summary to read</h3>
                            <p>Click any summary on the left to view its full content, key points, and topics.</p>
                            <button className="ai-generate-btn" onClick={handleGenerate} disabled={generating}>
                                {generating ? <><TypingDots /> Generating…</> : <><SparkleIcon /> Generate new summary</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}