// src/pages/LandingPage.tsx  (updated — uses AppContext for navigation)
import { useState } from "react"
import { useApp } from "../context/AppContext"
import "../styles/Landing.css"

type Feature = {
    icon: React.ReactNode
    number: string
    title: string
    description: string
}

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
)
const SummaryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)
const QuizIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)
const ProgressIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const ThemeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
)
const CollabIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)
const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
)
const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
)
const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
)

const features: Feature[] = [
    { icon: <UploadIcon />, number: "1. Multi-format Upload", title: "Upload materials, PDFs, DOCS, quizzes, and Multi-format", description: "Supports PDFs, DOCX, images, and more for instant processing." },
    { icon: <SummaryIcon />, number: "2. AI Summaries", title: "Upload materials, generate AI summaries and markdowns", description: "Get concise, intelligent summaries of any uploaded document." },
    { icon: <QuizIcon />, number: "3. Quiz Generation", title: "Create and quiz generation & questions generation", description: "Auto-generate quizzes to reinforce and test your knowledge." },
    { icon: <ProgressIcon />, number: "4. Progress Tracking", title: "Progress earned with materials and progress tracking", description: "Visual dashboards showing your learning milestones over time." },
    { icon: <ThemeIcon />, number: "5. Theme Toggle", title: "Toggle from dark, light, theme, and marks", description: "Switch themes for comfortable studying any time of day." },
    { icon: <CollabIcon />, number: "6. Collaborative Study", title: "Collaborative deliberate study with their team of teams", description: "Shared study rooms, live notes, and real-time collaboration." },
]

export default function LandingPage () {
    const { navigate, theme, toggleTheme } = useApp()
    const [demoToggle, setDemoToggle] = useState(false)

    return (
        <div className={`app ${theme}`}>
            <div className="bg-mesh" />
            <div className="bg-dots" />

            <svg className="network-svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
                <line x1="0" y1="230" x2="320" y2="110" stroke="#00d2a5" strokeWidth="0.6" opacity="0.5" />
                <line x1="320" y1="110" x2="640" y2="320" stroke="#00d2a5" strokeWidth="0.6" opacity="0.5" />
                <line x1="640" y1="320" x2="1060" y2="160" stroke="#00d2a5" strokeWidth="0.6" opacity="0.5" />
                <line x1="120" y1="640" x2="450" y2="520" stroke="#7c5cfc" strokeWidth="0.6" opacity="0.4" />
                <line x1="450" y1="520" x2="760" y2="700" stroke="#7c5cfc" strokeWidth="0.6" opacity="0.4" />
                <circle cx="320" cy="110" r="3" fill="#00d2a5" opacity="0.7" />
                <circle cx="640" cy="320" r="3" fill="#00d2a5" opacity="0.7" />
                <circle cx="450" cy="520" r="2.5" fill="#7c5cfc" opacity="0.6" />
                <circle cx="760" cy="700" r="3" fill="#7c5cfc" opacity="0.7" />
            </svg>

            <div className="wrapper">
                <nav className="navbar">
                    <div className="nav-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search..." readOnly />
                    </div>

                    <button className="logo" onClick={() => navigate("landing")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <div className="logo-icon"><BookIcon /></div>
                        Smart Study
                    </button>

                    <div className="nav-buttons">
                        <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
                            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button className="btn-signup" onClick={() => navigate("signup")}>Sign Up</button>
                        <button className="btn-login" onClick={() => navigate("login")}>Log In</button>
                    </div>
                </nav>

                <section className="hero">
                    <h1>AI Copilot for Academic Success</h1>
                    <p>Upload materials, generate summaries and quizzes, and track your progress with AI.</p>
                    <div className="hero-btns">
                        <button className="btn-hp" onClick={() => navigate("signup")}>Get Started</button>
                        <button className="btn-ho" onClick={() => navigate("login")}>See How It Works</button>
                    </div>
                </section>

                <section className="features">
                    <div className="feat-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feat-card" style={{ animationDelay: `${0.06 + index * 0.06}s` }}>
                                <div className="card-icon">{feature.icon}</div>
                                <div className="card-num">{feature.number}</div>
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="card-desc">{feature.description}</p>
                                {index === 4 && (
                                    <div className="tog-row">
                                        <div className={`mini-tog ${demoToggle ? "on" : "off"}`} onClick={() => setDemoToggle(v => !v)} />
                                        <span className="tog-lbl">{demoToggle ? "Dark mode" : "Light mode"}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="footer">
                    <div>
                        <h3>Smart Study</h3>
                        <p>AI Copilot for students</p>
                    </div>
                    <p>© 2026 Smart Study</p>
                </footer>
            </div>
        </div>
    )
}