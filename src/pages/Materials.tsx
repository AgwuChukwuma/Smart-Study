// src/pages/MaterialsPage.tsx
import { useState, useRef } from "react"
import { useApp } from "../context/AppContext"
import { PageLayout } from "../pages/Layout"
import "../styles/Materials.css"
import "../styles/Layout.css"

// ── Icons ──
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const GridIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
const ListIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
const FilterIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
const MoreIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
const DocIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
const SummaryIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></svg>
const QuizIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12" /></svg>
const SpinnerIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" className="mat-spin">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="42" strokeDashoffset="14" strokeLinecap="round" opacity="0.9" />
    </svg>
)

const SUBJECTS = ["All", "Chemistry", "History", "Mathematics", "Economics", "Physics", "Biology", "Politics"]
const FILE_TYPES = ["All types", "PDF", "DOCX", "PPT", "TXT"]
const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
    PDF: { bg: "rgba(248,113,113,0.14)", color: "#ef4444" },
    DOCX: { bg: "rgba(96,165,250,0.14)", color: "#3b82f6" },
    PPT: { bg: "rgba(251,146,60,0.14)", color: "#f97316" },
    TXT: { bg: "rgba(156,163,175,0.14)", color: "#6b7280" },
}
const SUBJECT_COLORS: Record<string, string> = {
    Chemistry: "#7c5cfc", History: "#f59e0b", Mathematics: "#00d2a5",
    Economics: "#f87171", Physics: "#60a5fa", Biology: "#34d399", Politics: "#c084fc",
}

function UploadZone ({ onUpload }: { onUpload: (files: FileList | null) => void }) {
    const [dragging, setDragging] = useState(false)
    const ref = useRef<HTMLInputElement>(null)
    return (
        <div
            className={`mat-upload-zone ${dragging ? "dragging" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); onUpload(e.dataTransfer.files) }}
            onClick={() => ref.current?.click()}
        >
            <input ref={ref} type="file" multiple accept=".pdf,.docx,.ppt,.pptx,.txt" style={{ display: "none" }} onChange={e => onUpload(e.target.files)} />
            <div className="mat-upload-icon-wrap"><UploadIcon /></div>
            <p className="mat-upload-title">Drop files here or <span className="mat-upload-link">browse</span></p>
            <p className="mat-upload-sub">Supports PDF, DOCX, PPT, TXT · Max 50 MB per file</p>
        </div>
    )
}

function MaterialCard ({ m, idx, onDelete, onSummarise, onQuiz, loadingAction }: {
    m: ReturnType<typeof useApp>["materials"][0]; idx: number
    onDelete: () => void; onSummarise: () => void; onQuiz: () => void
    loadingAction: "summary" | "quiz" | null
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const ts = TYPE_STYLE[m.type]
    const busy = loadingAction !== null
    return (
        <div className="mat-card" style={{ animationDelay: `${idx * 0.055}s` }}>
            <div className="mat-card-top">
                <div className="mat-card-doc-icon" style={{ background: m.color + "18" }}><span style={{ color: m.color }}><DocIcon /></span></div>
                <div style={{ position: "relative" }}>
                    <button className="mat-more-btn" onClick={() => setMenuOpen(v => !v)} onBlur={() => setTimeout(() => setMenuOpen(false), 160)} disabled={busy}><MoreIcon /></button>
                    {menuOpen && (
                        <div className="mat-dropdown">
                            <button className="mat-dropdown-item" onClick={() => { setMenuOpen(false); onSummarise() }}><SummaryIcon /><span>Summarize</span></button>
                            <button className="mat-dropdown-item" onClick={() => { setMenuOpen(false); onQuiz() }}><QuizIcon /><span>Generate quiz</span></button>
                            <button className="mat-dropdown-item"><DownloadIcon /><span>Download</span></button>
                            <div className="mat-dropdown-sep" />
                            <button className="mat-dropdown-item danger" onClick={() => { setMenuOpen(false); onDelete() }}><TrashIcon /><span>Delete</span></button>
                        </div>
                    )}
                </div>
            </div>
            <span className="mat-type-badge" style={{ background: ts.bg, color: ts.color }}>{m.type}</span>
            <h3 className="mat-card-name">{m.name}</h3>
            <p className="mat-card-subject" style={{ color: m.color }}>{m.subject}</p>
            <div className="mat-card-meta">
                <span>{m.pages}p</span><span className="mat-dot">·</span>
                <span>{m.size}</span><span className="mat-dot">·</span>
                <span>{m.uploadedAgo}</span>
            </div>
            {(m.hasSummary || m.hasQuiz) && (
                <div className="mat-card-chips">
                    {m.hasSummary && <span className="mat-chip summary-chip"><CheckIcon /> Summary</span>}
                    {m.hasQuiz && <span className="mat-chip quiz-chip"><CheckIcon /> Quiz</span>}
                </div>
            )}
            <div className="mat-card-footer">
                <button className="mat-btn-primary" onClick={onSummarise} disabled={busy}>
                    {loadingAction === "summary" ? <><SpinnerIcon /> Summarizing…</> : <><SummaryIcon /> Summarize</>}
                </button>
                <button className="mat-btn-secondary" onClick={onQuiz} disabled={busy}>
                    {loadingAction === "quiz" ? <><SpinnerIcon /> Generating…</> : <><QuizIcon /> Quiz</>}
                </button>
            </div>
        </div>
    )
}

function MaterialRow ({ m, idx, onDelete, onSummarise, onQuiz, loadingAction }: {
    m: ReturnType<typeof useApp>["materials"][0]; idx: number
    onDelete: () => void; onSummarise: () => void; onQuiz: () => void
    loadingAction: "summary" | "quiz" | null
}) {
    const ts = TYPE_STYLE[m.type]
    const busy = loadingAction !== null
    return (
        <div className="mat-row" style={{ animationDelay: `${idx * 0.045}s` }}>
            <div className="mat-row-doc" style={{ background: m.color + "18" }}><span style={{ color: m.color }}><DocIcon /></span></div>
            <div className="mat-row-info">
                <span className="mat-row-name">{m.name}</span>
                <div className="mat-row-meta">
                    <span className="mat-type-badge sm" style={{ background: ts.bg, color: ts.color }}>{m.type}</span>
                    <span>{m.subject}</span><span className="mat-dot">·</span>
                    <span>{m.pages}p</span><span className="mat-dot">·</span>
                    <span>{m.size}</span><span className="mat-dot">·</span>
                    <span>{m.uploadedDate}</span>
                </div>
            </div>
            <div className="mat-row-chips">
                {m.hasSummary && <span className="mat-chip summary-chip"><CheckIcon /> Summary</span>}
                {m.hasQuiz && <span className="mat-chip quiz-chip"><CheckIcon /> Quiz</span>}
            </div>
            <div className="mat-row-actions">
                <button className="mat-btn-primary sm" onClick={onSummarise} disabled={busy}>
                    {loadingAction === "summary" ? <><SpinnerIcon /> Summarizing…</> : <><SummaryIcon /> Summarize</>}
                </button>
                <button className="mat-btn-secondary sm" onClick={onQuiz} disabled={busy}>
                    {loadingAction === "quiz" ? <><SpinnerIcon /> Generating…</> : <><QuizIcon /> Quiz</>}
                </button>
                <button className="mat-icon-btn danger" onClick={onDelete} disabled={busy}><TrashIcon /></button>
            </div>
        </div>
    )
}

export default function MaterialsPage () {
    const { materials, deleteMaterial, addMaterial, generateSummary, generateQuiz, navigate } = useApp()

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [search, setSearch] = useState("")
    const [activeSubject, setActiveSubject] = useState("All")
    const [activeType, setActiveType] = useState("All types")
    const [toast, setToast] = useState("")
    const [loadingMap, setLoadingMap] = useState<Record<number, "summary" | "quiz">>({})

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(""), 3000)
    }

    const handleUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return
        Array.from(files).forEach(file => {
            const ext = file.name.split(".").pop()?.toUpperCase() || "PDF"
            const type = (["PDF", "DOCX", "PPT", "TXT"].includes(ext) ? ext : "PDF") as "PDF" | "DOCX" | "PPT" | "TXT"
            const subject = "General"
            addMaterial({
                name: file.name.replace(/\.[^.]+$/, ""),
                type, subject,
                uploadedAgo: "Just now",
                uploadedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                pages: Math.floor(Math.random() * 40) + 5,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                hasSummary: false,
                hasQuiz: false,
                color: SUBJECT_COLORS[subject] || "#7c5cfc",
                file,
                hasFlashcards: false
            })
        })
        showToast(`${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully!`)
    }

    const handleSummarise = async (id: number) => {
        setLoadingMap(prev => ({ ...prev, [id]: "summary" }))
        const result = await generateSummary(id)
        setLoadingMap(prev => { const next = { ...prev }; delete next[id]; return next })
        if (result) navigate("summaries")
        else showToast("Failed to generate summary. Please try again.")
    }

    const handleGenerateQuiz = async (id: number) => {
        setLoadingMap(prev => ({ ...prev, [id]: "quiz" }))
        const result = await generateQuiz(id)
        setLoadingMap(prev => { const next = { ...prev }; delete next[id]; return next })
        if (result) navigate("quizzes")
        else showToast("Failed to generate quiz. Please try again.")
    }

    const filtered = materials.filter(m => {
        const s = search.toLowerCase()
        return (
            (m.name.toLowerCase().includes(s) || m.subject.toLowerCase().includes(s)) &&
            (activeSubject === "All" || m.subject === activeSubject) &&
            (activeType === "All types" || m.type === activeType)
        )
    })

    const totalMB = materials.reduce((a, m) => a + parseFloat(m.size), 0)

    return (
        <PageLayout
            title="My Materials"
            topbarActions={
                <label className="mat-upload-cta" style={{ cursor: "pointer" }}>
                    <PlusIcon /> <span>Upload</span>
                    <input type="file" multiple accept=".pdf,.docx,.ppt,.pptx,.txt" style={{ display: "none" }}
                        onChange={e => handleUpload(e.target.files)} />
                </label>
            }
        >
            <div className="mat-content">
                {/* Toast */}
                <div className={`mat-toast ${toast ? "visible" : ""}`}>
                    <span className="mat-toast-check"><CheckIcon /></span>{toast}
                </div>

                <div className="mat-heading">
                    <h1 className="mat-page-title">My Materials</h1>
                    <p className="mat-page-sub">{materials.length} files · {totalMB.toFixed(1)} MB used</p>
                </div>

                <UploadZone onUpload={handleUpload} />

                {/* Stats */}
                <div className="mat-stats-row">
                    <div className="mat-stat-pill"><span className="mat-stat-num">{materials.length}</span><span className="mat-stat-lbl">Total files</span></div>
                    <div className="mat-stat-pill"><span className="mat-stat-num">{materials.filter(m => m.hasSummary).length}</span><span className="mat-stat-lbl">With summaries</span></div>
                    <div className="mat-stat-pill"><span className="mat-stat-num">{materials.filter(m => m.hasQuiz).length}</span><span className="mat-stat-lbl">With quizzes</span></div>
                    <div className="mat-stat-pill"><span className="mat-stat-num">{totalMB.toFixed(1)} MB</span><span className="mat-stat-lbl">Storage used</span></div>
                </div>

                {/* Toolbar */}
                <div className="mat-toolbar">
                    <div className="mat-filters">
                        <span className="mat-filter-icon"><FilterIcon /></span>
                        <div className="mat-pills-scroll">
                            {SUBJECTS.map(s => (
                                <button key={s} className={`mat-pill ${activeSubject === s ? "active" : ""}`} onClick={() => setActiveSubject(s)}>{s}</button>
                            ))}
                        </div>
                        <select className="mat-type-select" value={activeType} onChange={e => setActiveType(e.target.value)}>
                            {FILE_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="mat-view-toggle">
                        <button className={`mat-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}><GridIcon /></button>
                        <button className={`mat-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><ListIcon /></button>
                    </div>
                </div>

                {search && <div className="mat-search-row">
                    <input className="mat-inline-search" placeholder="Search materials…" value={search} onChange={e => setSearch(e.target.value)} />
                    {search && <button className="mat-search-clear-btn" onClick={() => setSearch("")}><CloseIcon /></button>}
                </div>}

                {filtered.length === 0 && (
                    <div className="mat-empty">
                        <div className="mat-empty-icon"><SummaryIcon /></div>
                        <h3>No materials found</h3>
                        <p>Try adjusting your filters or upload new files</p>
                        <button className="mat-empty-reset" onClick={() => { setSearch(""); setActiveSubject("All"); setActiveType("All types") }}>Clear filters</button>
                    </div>
                )}

                {viewMode === "grid" && filtered.length > 0 && (
                    <div className="mat-grid">
                        {filtered.map((m, i) => (
                            <MaterialCard key={m.id} m={m} idx={i}
                                onDelete={() => deleteMaterial(m.id)}
                                onSummarise={() => handleSummarise(m.id)}
                                onQuiz={() => handleGenerateQuiz(m.id)}
                                loadingAction={loadingMap[m.id] ?? null}
                            />
                        ))}
                    </div>
                )}
                {viewMode === "list" && filtered.length > 0 && (
                    <div className="mat-list">
                        <div className="mat-list-head"><span>Name &amp; details</span><span>Status</span><span>Actions</span></div>
                        {filtered.map((m, i) => (
                            <MaterialRow key={m.id} m={m} idx={i}
                                onDelete={() => deleteMaterial(m.id)}
                                onSummarise={() => handleSummarise(m.id)}
                                onQuiz={() => handleGenerateQuiz(m.id)}
                                loadingAction={loadingMap[m.id] ?? null}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}   