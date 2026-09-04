import { useState } from "react"
import { useApp } from "../context/AppContext"
import "../styles/Auth.css"

const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
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
const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
)
const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)
const GithubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
)
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

function getPasswordStrength (pw: string) {
    if (!pw) return { score: 0, label: "", color: "" }
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return [
        { score: 0, label: "", color: "" },
        { score: 1, label: "Weak", color: "#e24b4a" },
        { score: 2, label: "Fair", color: "#ef9f27" },
        { score: 3, label: "Good", color: "#1D9E75" },
        { score: 4, label: "Strong", color: "#00d2a5" },
    ][s]
}

export default function SignUpPage () {
    const { signup, navigate, theme, toggleTheme } = useApp()
    const [showPw, setShowPw] = useState(false)
    const [showConf, setShowConf] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [agreed, setAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const strength = getPasswordStrength(password)
    const match = confirm.length > 0 && password === confirm

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!fullName.trim()) return setError("Please enter your name.")
        if (!email.trim()) return setError("Please enter your email.")
        if (password.length < 6) return setError("Password must be at least 6 characters.")
        if (!match) return setError("Passwords do not match.")
        if (!agreed) return setError("Please accept the terms.")
        setLoading(true)
        const errMsg = await signup(fullName.trim(), email.trim(), password)
        setLoading(false)
        if (errMsg) setError(errMsg)
    }

    const PERKS = [
        "Unlimited AI summaries from your uploads",
        "Auto-generate quizzes from any material",
        "Track progress across all your courses",
        "Collaborate with classmates in real time",
        "Dark & light mode for night study sessions",
    ]

    return (
        <div className={`auth-app ${theme}`}>
            <div className="auth-bg-mesh" />
            <div className="auth-bg-dots" />
            <svg className="auth-network-svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice">
                <line x1="0" y1="230" x2="320" y2="110" stroke="#00d2a5" strokeWidth="0.6" opacity="0.5" />
                <line x1="320" y1="110" x2="640" y2="320" stroke="#00d2a5" strokeWidth="0.6" opacity="0.5" />
                <line x1="120" y1="640" x2="450" y2="520" stroke="#7c5cfc" strokeWidth="0.6" opacity="0.4" />
                <circle cx="320" cy="110" r="3" fill="#00d2a5" opacity="0.7" />
                <circle cx="450" cy="520" r="2.5" fill="#7c5cfc" opacity="0.6" />
            </svg>

            <nav className="auth-nav">
                <button className="auth-logo" onClick={() => navigate("landing")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <div className="auth-logo-icon"><BookIcon /></div>
                    Smart Study
                </button>
                <button className="auth-theme-btn" onClick={toggleTheme}>
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
            </nav>

            <main className="auth-main">
                <div className="auth-panel-left">
                    <div className="auth-panel-inner">
                        <div className="auth-brand-badge">Free forever plan</div>
                        <h2 className="auth-panel-heading">Everything you need<br />to study better.</h2>
                        <p className="auth-panel-sub">Create your free account and unlock AI-powered tools that transform how you study.</p>
                        <div className="auth-perks">
                            {PERKS.map((perk, i) => (
                                <div className="auth-perk" key={i}>
                                    <div className="auth-perk-check"><CheckIcon /></div>
                                    <span>{perk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="auth-panel-right">
                    <div className="auth-card auth-card-signup">
                        <div className="auth-card-header">
                            <h1 className="auth-card-title">Create your account</h1>
                            <p className="auth-card-sub">Start studying smarter today — it's free</p>
                        </div>

                        <div className="auth-social-row">
                            <button className="auth-social-btn" type="button" onClick={() => setError("Social signup isn't set up yet — please use email and password.")}>
                                <GoogleIcon /><span>Google</span>
                            </button>
                            <button className="auth-social-btn" type="button" onClick={() => setError("Social signup isn't set up yet — please use email and password.")}>
                                <GithubIcon /><span>GitHub</span>
                            </button>
                        </div>

                        <div className="auth-divider"><span>or sign up with email</span></div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && <div className="auth-error-msg">{error}</div>}
                            <div className="auth-field">
                                <label className="auth-label">Full name</label>
                                <input type="text" className="auth-input" placeholder="Alex Johnson" value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                            <div className="auth-field">
                                <label className="auth-label">Email address</label>
                                <input type="email" className="auth-input" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="auth-field">
                                <label className="auth-label">Password</label>
                                <div className="auth-input-wrap">
                                    <input type={showPw ? "text" : "password"} className="auth-input auth-input-icon" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                                    <button type="button" className="auth-eye-btn" onClick={() => setShowPw(v => !v)}>
                                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className="auth-strength">
                                        <div className="auth-strength-bars">
                                            {[1, 2, 3, 4].map(n => (
                                                <div key={n} className="auth-strength-bar" style={{ background: n <= strength.score ? strength.color : undefined }} />
                                            ))}
                                        </div>
                                        <span className="auth-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                                    </div>
                                )}
                            </div>
                            <div className="auth-field">
                                <label className="auth-label">Confirm password</label>
                                <div className="auth-input-wrap">
                                    <input
                                        type={showConf ? "text" : "password"}
                                        className={`auth-input auth-input-icon ${confirm.length > 0 ? (match ? "auth-input-valid" : "auth-input-error") : ""}`}
                                        placeholder="Repeat your password"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                    />
                                    <button type="button" className="auth-eye-btn" onClick={() => setShowConf(v => !v)}>
                                        {showConf ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {confirm.length > 0 && !match && <span className="auth-field-error">Passwords do not match</span>}
                            </div>
                            <div className="auth-check-row">
                                <label className="auth-checkbox-label">
                                    <input type="checkbox" className="auth-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                    <span className="auth-checkmark" />
                                    <span className="auth-check-text">I agree to the <span className="auth-switch-link">Terms</span> and <span className="auth-switch-link">Privacy Policy</span></span>
                                </label>
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Creating account…" : "Create free account"}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account?{" "}
                            <button className="auth-switch-link" onClick={() => navigate("login")} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0 }}>
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}