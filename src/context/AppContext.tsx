// src/context/AppContext.tsx
// Central state store – theme, auth, materials, summaries, quizzes,
// progress, notifications, and AI chat

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    type ReactNode,
} from "react"

// ── Types ──────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark"

export interface User {
    id: number
    name: string
    email: string
    username: string
    university: string
    major: string
    year: string
    bio: string
    avatarColor: string
    initials: string
}

export interface Material {
    id: number
    name: string
    type: "PDF" | "DOCX" | "PPT" | "TXT"
    subject: string
    uploadedAgo: string
    uploadedDate: string
    pages: number
    size: string
    hasSummary: boolean
    hasQuiz: boolean
    hasFlashcards: boolean
    color: string
    file?: File
}

export interface Summary {
    id: number
    title: string
    subject: string
    sourceFile: string
    fileType: "PDF" | "DOCX" | "PPT"
    generatedAgo: string
    readTime: string
    wordCount: number
    color: string
    overview: string
    keyPoints: {
        id: number
        text: string
    }[]
    tags: string[]
    materialId?: number
}

export interface QuizQuestion {
    id: number
    text: string
    options: {
        id: string
        text: string
    }[]
    correct: string
    explanation: string
}

export interface Quiz {
    id: number
    title: string
    subject: string
    sourceFile: string
    questions: QuizQuestion[]
    status: "pending" | "completed" | "in-progress"
    score: number | null
    due: string
    color: string
    attempts: number
    bestScore: number | null
    materialId?: number
}

export interface Notification {
    id: number
    type: "quiz" | "summary" | "upload" | "collab" | "streak"
    title: string
    message: string
    time: string
    read: boolean
    link?: string
}

export interface ChatMessage {
    id: number
    role: "user" | "assistant"
    content: string
}

export interface Flashcard {
    id: number
    front: string
    back: string
    interval: number
    easeFactor: number
    repetitions: number
    dueDate: string
    lastReviewed: string | null
}

export interface FlashcardSet {
    id: number
    title: string
    subject: string
    sourceFile: string
    color: string
    cards: Flashcard[]
    materialId?: number
    generatedAgo: string
}

// ── Initial data ───────────────────────────────────────────────────────────

const INITIAL_USER: User = {
    id: 1,
    name: "Alex Johnson",
    email: "alex@university.edu",
    username: "alexj",
    university: "University of Manchester",
    major: "Computer Science",
    year: "3rd Year",
    bio: "Computer Science student. Passionate about chemistry and mathematics.",
    avatarColor: "#7c5cfc",
    initials: "AJ",
}

const INITIAL_MATERIALS: Material[] = [
    {
        id: 1,
        name: "Organic Chemistry Ch.4 — Reaction Mechanisms",
        type: "PDF",
        subject: "Chemistry",
        uploadedAgo: "2h ago",
        uploadedDate: "Mar 18, 2026",
        pages: 32,
        size: "3.2 MB",
        hasSummary: true,
        hasQuiz: true,
        color: "#7c5cfc",
        hasFlashcards: false,
    },
    {
        id: 2,
        name: "World History Lecture Notes — WWI",
        type: "DOCX",
        subject: "History",
        uploadedAgo: "Yesterday",
        uploadedDate: "Mar 17, 2026",
        pages: 18,
        size: "1.1 MB",
        hasSummary: true,
        hasQuiz: false,
        color: "#f59e0b",
        hasFlashcards: false,
    },
    {
        id: 3,
        name: "Calculus Integration Techniques",
        type: "PDF",
        subject: "Mathematics",
        uploadedAgo: "3d ago",
        uploadedDate: "Mar 15, 2026",
        pages: 45,
        size: "5.8 MB",
        hasSummary: false,
        hasQuiz: false,
        color: "#00d2a5",
        hasFlashcards: false,
    },
    {
        id: 4,
        name: "Macroeconomics — Supply & Demand Slides",
        type: "PPT",
        subject: "Economics",
        uploadedAgo: "1w ago",
        uploadedDate: "Mar 11, 2026",
        pages: 60,
        size: "8.4 MB",
        hasSummary: true,
        hasQuiz: true,
        color: "#f87171",
        hasFlashcards: false,
    },
    {
        id: 5,
        name: "Thermodynamics Fundamentals",
        type: "PDF",
        subject: "Physics",
        uploadedAgo: "1w ago",
        uploadedDate: "Mar 10, 2026",
        pages: 28,
        size: "2.9 MB",
        hasSummary: false,
        hasQuiz: false,
        color: "#60a5fa",
        hasFlashcards: false,
    },
    {
        id: 6,
        name: "Cell Biology — Mitosis & Meiosis",
        type: "PDF",
        subject: "Biology",
        uploadedAgo: "2w ago",
        uploadedDate: "Mar 4, 2026",
        pages: 22,
        size: "4.1 MB",
        hasSummary: true,
        hasQuiz: true,
        color: "#34d399",
        hasFlashcards: false,
    },
]

const INITIAL_SUMMARIES: Summary[] = [
    {
        id: 1,
        title: "Organic Chemistry — Reaction Mechanisms",
        subject: "Chemistry",
        sourceFile: "Organic Chemistry Ch.4.pdf",
        fileType: "PDF",
        generatedAgo: "2h ago",
        readTime: "4 min read",
        wordCount: 620,
        color: "#7c5cfc",
        materialId: 1,
        overview:
            "This chapter examines the core mechanisms underlying organic chemical reactions, focusing on nucleophilic substitution (SN1 and SN2), elimination reactions (E1 and E2), and electrophilic addition.",
        keyPoints: [
            {
                id: 1,
                text: "SN2 reactions occur in a single concerted step — the nucleophile attacks as the leaving group departs, inverting stereochemistry.",
            },
            {
                id: 2,
                text: "SN1 reactions proceed via a stable carbocation intermediate; tertiary substrates react fastest.",
            },
            {
                id: 3,
                text: "E2 eliminations require an anti-periplanar arrangement of the hydrogen and leaving group.",
            },
            {
                id: 4,
                text: "Polar aprotic solvents accelerate SN2 by failing to solvate the nucleophile, increasing its reactivity.",
            },
            {
                id: 5,
                text: "Markovnikov's rule predicts that electrophilic addition places the electrophile on the more hydrogen-bearing carbon.",
            },
        ],
        tags: ["SN1/SN2", "Elimination", "Stereochemistry", "Carbocations"],
    },

    {
        id: 2,
        title: "World War I — Causes & Timeline",
        subject: "History",
        sourceFile: "World History Lecture Notes — WWI.docx",
        fileType: "DOCX",
        generatedAgo: "Yesterday",
        readTime: "3 min read",
        wordCount: 480,
        color: "#f59e0b",
        materialId: 2,
        overview:
            "These lecture notes survey the origins of World War I through the MAIN causes — Militarism, Alliance systems, Imperialism, and Nationalism — and the trigger of the assassination of Archduke Franz Ferdinand.",
        keyPoints: [
            {
                id: 1,
                text: "The MAIN causes created a powder keg across Europe by 1914.",
            },
            {
                id: 2,
                text: "The Triple Alliance and Triple Entente divided Europe into two armed blocs.",
            },
            {
                id: 3,
                text: "The assassination of Archduke Franz Ferdinand triggered the July Crisis.",
            },
            {
                id: 4,
                text: "Germany's Schlieffen Plan aimed to defeat France quickly before rotating east.",
            },
            {
                id: 5,
                text: "The war settled into trench warfare on the Western Front by late 1914.",
            },
        ],
        tags: ["WWI", "MAIN Causes", "July Crisis", "Schlieffen Plan"],
    },

    {
        id: 3,
        title: "Supply & Demand — Macroeconomic Foundations",
        subject: "Economics",
        sourceFile: "Macroeconomics — Supply & Demand Slides.ppt",
        fileType: "PPT",
        generatedAgo: "1w ago",
        readTime: "5 min read",
        wordCount: 730,
        color: "#f87171",
        materialId: 4,
        overview:
            "This slide deck introduces the foundational model of supply and demand, covering market equilibrium, elasticity, and government interventions.",
        keyPoints: [
            {
                id: 1,
                text: "Market equilibrium is reached when quantity supplied equals quantity demanded.",
            },
            {
                id: 2,
                text: "Price elasticity of demand measures responsiveness of quantity demanded to price change.",
            },
            {
                id: 3,
                text: "A price ceiling set below equilibrium creates persistent shortages.",
            },
            {
                id: 4,
                text: "Shifts in supply arise from changes in input costs, technology, or expectations.",
            },
            {
                id: 5,
                text: "Aggregate demand comprises C + I + G + NX.",
            },
        ],
        tags: [
            "Equilibrium",
            "Elasticity",
            "Price Controls",
            "Aggregate Demand",
        ],
    },
]

const INITIAL_QUIZZES: Quiz[] = [
    {
        id: 1,
        title: "Organic Chemistry — Reaction Mechanisms",
        subject: "Chemistry",
        sourceFile: "Organic Chemistry Ch.4.pdf",
        due: "Today",
        color: "#7c5cfc",
        status: "pending",
        score: null,
        attempts: 0,
        bestScore: null,
        materialId: 1,
        questions: [
            {
                id: 1,
                text: "Which mechanism results in inversion of stereochemistry?",
                options: [
                    { id: "a", text: "SN1" },
                    { id: "b", text: "SN2" },
                    { id: "c", text: "E1" },
                    { id: "d", text: "E2" },
                ],
                correct: "b",
                explanation:
                    "SN2 is a concerted backside attack causing Walden inversion.",
            },
            {
                id: 2,
                text: "Which solvent best accelerates an SN2 reaction?",
                options: [
                    { id: "a", text: "Polar protic (water)" },
                    { id: "b", text: "Non-polar (hexane)" },
                    { id: "c", text: "Polar aprotic (DMSO)" },
                    { id: "d", text: "Aqueous acid" },
                ],
                correct: "c",
                explanation:
                    "Polar aprotic solvents don't solvate anions, making nucleophiles highly reactive.",
            },
            {
                id: 3,
                text: "A tertiary substrate reacts fastest via:",
                options: [
                    { id: "a", text: "SN2" },
                    { id: "b", text: "E2" },
                    { id: "c", text: "SN1" },
                    { id: "d", text: "Electrophilic addition" },
                ],
                correct: "c",
                explanation:
                    "Tertiary carbons form stable carbocations, favouring SN1.",
            },
            {
                id: 4,
                text: "Markovnikov's rule: the electrophile adds to:",
                options: [
                    { id: "a", text: "More substituted carbon" },
                    { id: "b", text: "Less substituted carbon" },
                    { id: "c", text: "Both equally" },
                    { id: "d", text: "Carbon with fewer H" },
                ],
                correct: "b",
                explanation:
                    "H+ adds to the carbon with more H atoms, producing the more stable carbocation.",
            },
            {
                id: 5,
                text: "E2 elimination requires H and leaving group to be:",
                options: [
                    { id: "a", text: "Syn-periplanar (0°)" },
                    { id: "b", text: "Anti-periplanar (180°)" },
                    { id: "c", text: "Gauche (60°)" },
                    { id: "d", text: "Eclipsed (120°)" },
                ],
                correct: "b",
                explanation:
                    "Anti-periplanar geometry maximises orbital overlap.",
            },
        ],
    },

    {
        id: 2,
        title: "World War I — Causes & Key Events",
        subject: "History",
        sourceFile: "World History Lecture Notes — WWI.docx",
        due: "Yesterday",
        color: "#f59e0b",
        status: "completed",
        score: 88,
        attempts: 2,
        bestScore: 88,
        materialId: 2,
        questions: [
            {
                id: 1,
                text: "What does 'M' in MAIN stand for?",
                options: [
                    { id: "a", text: "Migration" },
                    { id: "b", text: "Militarism" },
                    { id: "c", text: "Monarchy" },
                    { id: "d", text: "Manufacturing" },
                ],
                correct: "b",
                explanation:
                    "MAIN = Militarism, Alliance systems, Imperialism, Nationalism.",
            },
            {
                id: 2,
                text: "Franz Ferdinand was assassinated in:",
                options: [
                    { id: "a", text: "Vienna" },
                    { id: "b", text: "Belgrade" },
                    { id: "c", text: "Sarajevo" },
                    { id: "d", text: "Prague" },
                ],
                correct: "c",
                explanation:
                    "He was shot in Sarajevo on 28 June 1914.",
            },
            {
                id: 3,
                text: "Which plan aimed to defeat France quickly?",
                options: [
                    { id: "a", text: "War Plan Red" },
                    { id: "b", text: "Schlieffen Plan" },
                    { id: "c", text: "Plan XVII" },
                    { id: "d", text: "Operation Barbarossa" },
                ],
                correct: "b",
                explanation:
                    "The Schlieffen Plan proposed sweeping through Belgium to encircle Paris.",
            },
        ],
    },

    {
        id: 3,
        title: "Calculus — Limits & Derivatives",
        subject: "Mathematics",
        sourceFile: "Calculus Integration Techniques.pdf",
        due: "Tomorrow",
        color: "#00d2a5",
        status: "in-progress",
        score: null,
        attempts: 1,
        bestScore: null,
        materialId: 3,
        questions: [
            {
                id: 1,
                text: "What is the derivative of f(x) = x³ − 4x + 7?",
                options: [
                    { id: "a", text: "3x² − 4" },
                    { id: "b", text: "x² − 4x" },
                    { id: "c", text: "3x² + 7" },
                    { id: "d", text: "3x − 4" },
                ],
                correct: "a",
                explanation:
                    "Power rule: d/dx(x³) = 3x², d/dx(−4x) = −4, d/dx(7) = 0.",
            },
            {
                id: 2,
                text: "Product rule is used when differentiating:",
                options: [
                    { id: "a", text: "Sum of functions" },
                    { id: "b", text: "Quotient of functions" },
                    { id: "c", text: "Product f(x)·g(x)" },
                    { id: "d", text: "A constant" },
                ],
                correct: "c",
                explanation:
                    "h'(x) = f'(x)g(x) + f(x)g'(x)",
            },
            {
                id: 3,
                text: "lim(x→0) sin(x)/x =",
                options: [
                    { id: "a", text: "0" },
                    { id: "b", text: "∞" },
                    { id: "c", text: "1" },
                    { id: "d", text: "Undefined" },
                ],
                correct: "c",
                explanation:
                    "Fundamental trig limit equals 1 by squeeze theorem.",
            },
        ],
    },

    {
        id: 4,
        title: "Macroeconomics — Supply & Demand",
        subject: "Economics",
        sourceFile: "Macroeconomics Slides.ppt",
        due: "3d ago",
        color: "#f87171",
        status: "completed",
        score: 94,
        attempts: 1,
        bestScore: 94,
        materialId: 4,
        questions: [
            {
                id: 1,
                text: "Market equilibrium occurs when:",
                options: [
                    { id: "a", text: "Price is maximised" },
                    { id: "b", text: "Qs = Qd" },
                    { id: "c", text: "Government sets price" },
                    { id: "d", text: "Supply > Demand" },
                ],
                correct: "b",
                explanation:
                    "Equilibrium is where quantity supplied equals quantity demanded.",
            },
            {
                id: 2,
                text: "Price ceiling below equilibrium causes:",
                options: [
                    { id: "a", text: "Surplus" },
                    { id: "b", text: "No change" },
                    { id: "c", text: "Shortage" },
                    { id: "d", text: "Increased supply" },
                ],
                correct: "c",
                explanation:
                    "Qd > Qs creates a persistent shortage.",
            },
        ],
    },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: "quiz",
        title: "Quiz due today",
        message:
            "Organic Chemistry — Reaction Mechanisms is due today.",
        time: "10m ago",
        read: false,
        link: "quizzes",
    },
    {
        id: 2,
        type: "summary",
        title: "Summary ready",
        message:
            "Your AI summary for WWI lecture notes is ready.",
        time: "2h ago",
        read: false,
        link: "summaries",
    },
    {
        id: 3,
        type: "collab",
        title: "New message",
        message:
            "Maya Patel sent a message in Chem Squad 🧪",
        time: "3h ago",
        read: false,
        link: "collaborate",
    },
    {
        id: 4,
        type: "streak",
        title: "7 day streak! 🔥",
        message:
            "You've studied 7 days in a row. Keep it up!",
        time: "Yesterday",
        read: true,
    },
    {
        id: 5,
        type: "upload",
        title: "Upload complete",
        message:
            "Thermodynamics Fundamentals.pdf has been processed.",
        time: "1w ago",
        read: true,
        link: "materials",
    },
]

// ── Context interface ──────────────────────────────────────────────────────

interface AppContextValue {
    // Auth
    isLoggedIn: boolean
    user: User
    login: (
        email: string,
        password: string
    ) => Promise<string | null>
    signup: (
        name: string,
        email: string,
        password: string
    ) => Promise<string | null>
    logout: () => void
    updateUser: (updates: Partial<User>) => void

    // Theme
    theme: Theme
    toggleTheme: () => void
    setTheme: (t: Theme) => void

    // Navigation
    currentPage: string
    navigate: (page: string) => void

    // Materials
    materials: Material[]
    addMaterial: (m: Omit<Material, "id">) => Material
    deleteMaterial: (id: number) => void
    updateMaterial: (
        id: number,
        updates: Partial<Material>
    ) => void

    // Summaries
    summaries: Summary[]
    addSummary: (s: Omit<Summary, "id">) => Summary
    deleteSummary: (id: number) => void
    generateSummary: (
        materialId: number
    ) => Promise<Summary | null>

    // Quizzes
    quizzes: Quiz[]
    addQuiz: (q: Omit<Quiz, "id">) => Quiz
    updateQuiz: (
        id: number,
        updates: Partial<Quiz>
    ) => void
    generateQuiz: (
        materialId: number
    ) => Promise<Quiz | null>
    completeQuiz: (
        id: number,
        score: number
    ) => void

    // Chat
    chatHistories: Record<number, ChatMessage[]>
    askQuestion: (
        materialId: number,
        question: string
    ) => Promise<string | null>
    clearChat: (materialId: number) => void

    // Notifications
    notifications: Notification[]
    markNotifRead: (id: number) => void
    markAllNotifsRead: () => void
    addNotification: (
        n: Omit<Notification, "id">
    ) => void
    unreadCount: number

    // Sidebar
    sidebarOpen: boolean
    setSidebarOpen: (v: boolean) => void

    // Flashcards
    flashcardSets: FlashcardSet[]
    generateFlashcards: (materialId: number) => Promise<FlashcardSet | null>
    deleteFlashcardSet: (id: number) => void
    reviewFlashcard: (setId: number, cardId: number, rating: "again" | "hard" | "good" | "easy") => void
}

// ── Context ────────────────────────────────────────────────────────────────

const AppContext =
    createContext<AppContextValue | null>(null)

const API_BASE = "https://smart-study-api-8l4t.onrender.com"
// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider ({
    children,
}: {
    children: ReactNode
}) {
    const [isLoggedIn, setIsLoggedIn] =
        useState(false)

    const [user, setUser] =
        useState<User>(INITIAL_USER)

    const [theme, setThemeState] =
        useState<Theme>("light")

    const [currentPage, setCurrentPage] =
        useState("landing")

    const [materials, setMaterials] =
        useState<Material[]>(INITIAL_MATERIALS)

    const [summaries, setSummaries] =
        useState<Summary[]>(INITIAL_SUMMARIES)

    const [quizzes, setQuizzes] =
        useState<Quiz[]>(INITIAL_QUIZZES)

    const [notifications, setNotifications] =
        useState<Notification[]>(INITIAL_NOTIFICATIONS)

    const [sidebarOpen, setSidebarOpen] =
        useState(true)

    const [flashcardSets, setFlashcardSets] =
        useState<FlashcardSet[]>([])

    // Chat histories are stored separately for each material
    const [chatHistories, setChatHistories] =
        useState<Record<number, ChatMessage[]>>({})

    const hasLoadedRef = useRef(false)

    // ── Restore session on refresh ─────────────────────────────────────────

    useEffect(() => {
        const savedEmail = localStorage.getItem(
            "smartstudy_user_email"
        )

        if (savedEmail && !isLoggedIn) {
            setUser((prev) => ({
                ...prev,
                email: savedEmail,
            }))

            setIsLoggedIn(true)

            setCurrentPage((prev) =>
                prev === "landing"
                    ? "dashboard"
                    : prev
            )
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Load persisted app state ───────────────────────────────────────────

    useEffect(() => {
        fetch(`${API_BASE}/api/state`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "Failed to load application state"
                    )
                }

                return res.json()
            })
            .then((data) => {
                if (data) {
                    if (data.materials) {
                        setMaterials(data.materials)
                    }

                    if (data.summaries) {
                        setSummaries(data.summaries)
                    }

                    if (data.quizzes) {
                        setQuizzes(data.quizzes)
                    }

                    if (data.flashcardSets) {
                        setFlashcardSets(data.flashcardSets)
                    }

                    if (data.notifications) {
                        setNotifications(
                            data.notifications
                        )
                    }
                }

                hasLoadedRef.current = true
            })
            .catch((err) => {
                console.error(
                    "Failed to load saved state:",
                    err
                )

                hasLoadedRef.current = true
            })
    }, [])

    // ── Save app state whenever it changes ──────────────────────────────────

    useEffect(() => {
        if (!hasLoadedRef.current) return

        const payload = {
            materials: materials.map(
                ({ file, ...rest }) => rest
            ),
            summaries,
            quizzes,
            flashcardSets,
            notifications,
        }

        fetch(`${API_BASE}/api/state`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }).catch((err) =>
            console.error(
                "Failed to save state:",
                err
            )
        )
    }, [
        materials,
        summaries,
        quizzes,
        flashcardSets,
        notifications,
    ])

    // ── Notifications ──────────────────────────────────────────────────────

    const addNotification = useCallback(
        (n: Omit<Notification, "id">) => {
            setNotifications((prev) => [
                {
                    ...n,
                    id: Date.now(),
                },
                ...prev,
            ])
        },
        []
    )

    const markNotifRead = useCallback(
        (id: number) => {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id
                        ? { ...n, read: true }
                        : n
                )
            )
        },
        []
    )

    const markAllNotifsRead = useCallback(() => {
        setNotifications((prev) =>
            prev.map((n) => ({
                ...n,
                read: true,
            }))
        )
    }, [])

    const unreadCount =
        notifications.filter(
            (n) => !n.read
        ).length

    // ── Auth ────────────────────────────────────────────────────────────────

    const login = useCallback(
        async (
            email: string,
            password: string
        ): Promise<string | null> => {
            try {
                const res = await fetch(
                    `${API_BASE}/api/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                    }
                )

                const data = await res.json()

                if (!res.ok) {
                    return (
                        data.error ||
                        "Login failed."
                    )
                }

                setUser((prev) => ({
                    ...prev,
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    initials: data.user.name
                        .split(" ")
                        .map(
                            (n: string) =>
                                n[0]
                        )
                        .join("")
                        .toUpperCase()
                        .slice(0, 2),
                }))

                setIsLoggedIn(true)
                setCurrentPage("dashboard")

                localStorage.setItem(
                    "smartstudy_user_email",
                    data.user.email
                )

                return null
            } catch (err) {
                console.error(
                    "Login failed:",
                    err
                )

                return "Could not reach the server. Please try again."
            }
        },
        []
    )

    const signup = useCallback(
        async (
            name: string,
            email: string,
            password: string
        ): Promise<string | null> => {
            try {
                const res = await fetch(
                    `${API_BASE}/api/signup`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password,
                        }),
                    }
                )

                const data = await res.json()

                if (!res.ok) {
                    return (
                        data.error ||
                        "Signup failed."
                    )
                }

                setUser((prev) => ({
                    ...prev,
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    initials: data.user.name
                        .split(" ")
                        .map(
                            (n: string) =>
                                n[0]
                        )
                        .join("")
                        .toUpperCase()
                        .slice(0, 2),
                }))

                setIsLoggedIn(true)
                setCurrentPage("dashboard")

                localStorage.setItem(
                    "smartstudy_user_email",
                    data.user.email
                )

                return null
            } catch (err) {
                console.error(
                    "Signup failed:",
                    err
                )

                return "Could not reach the server. Please try again."
            }
        },
        []
    )

    const logout = useCallback(() => {
        setIsLoggedIn(false)
        setCurrentPage("landing")

        localStorage.removeItem(
            "smartstudy_user_email"
        )
    }, [])

    const updateUser = useCallback(
        (updates: Partial<User>) => {
            setUser((prev) => ({
                ...prev,
                ...updates,
            }))
        },
        []
    )

    // ── Theme ───────────────────────────────────────────────────────────────

    const toggleTheme = useCallback(() => {
        setThemeState((t) =>
            t === "light" ? "dark" : "light"
        )
    }, [])

    const setTheme = useCallback(
        (t: Theme) => {
            setThemeState(t)
        },
        []
    )

    // ── Navigation ──────────────────────────────────────────────────────────

    const navigate = useCallback(
        (page: string) => {
            setCurrentPage(page)

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        },
        []
    )

    // ── Materials ───────────────────────────────────────────────────────────

    const addMaterial = useCallback(
        (
            m: Omit<Material, "id">
        ): Material => {
            const mat: Material = {
                ...m,
                id: Date.now(),
            }

            setMaterials((prev) => [
                mat,
                ...prev,
            ])

            addNotification({
                type: "upload",
                title: "Upload complete",
                message: `${m.name} has been processed.`,
                time: "Just now",
                read: false,
                link: "materials",
            })

            return mat
        },
        [addNotification]
    )

    const deleteMaterial = useCallback(
        (id: number) => {
            setMaterials((prev) =>
                prev.filter(
                    (m) => m.id !== id
                )
            )

            setSummaries((prev) =>
                prev.filter(
                    (s) =>
                        s.materialId !== id
                )
            )

            setQuizzes((prev) =>
                prev.filter(
                    (q) =>
                        q.materialId !== id
                )
            )

            setFlashcardSets((prev) =>
                prev.filter(
                    (f) => f.materialId !== id
                )
            )

            setChatHistories((prev) => {
                const next = {
                    ...prev,
                }

                delete next[id]

                return next
            })
        },
        []
    )

    const updateMaterial = useCallback(
        (
            id: number,
            updates: Partial<Material>
        ) => {
            setMaterials((prev) =>
                prev.map((m) =>
                    m.id === id
                        ? {
                            ...m,
                            ...updates,
                        }
                        : m
                )
            )
        },
        []
    )

    // ── Summaries ───────────────────────────────────────────────────────────

    const addSummary = useCallback(
        (
            s: Omit<Summary, "id">
        ): Summary => {
            const sum: Summary = {
                ...s,
                id: Date.now(),
            }

            setSummaries((prev) => [
                sum,
                ...prev,
            ])

            if (s.materialId) {
                updateMaterial(
                    s.materialId,
                    {
                        hasSummary: true,
                    }
                )
            }

            return sum
        },
        [updateMaterial]
    )

    const deleteSummary = useCallback(
        (id: number) => {
            setSummaries((prev) =>
                prev.filter(
                    (s) => s.id !== id
                )
            )
        },
        []
    )

    const generateSummary = useCallback(
        async (
            materialId: number
        ): Promise<Summary | null> => {
            const mat = materials.find(
                (m) => m.id === materialId
            )

            if (!mat) return null

            const existing =
                summaries.find(
                    (s) =>
                        s.materialId ===
                        materialId
                )

            if (existing) {
                return existing
            }

            const colors: Record<string, string> = { Chemistry: "#7c5cfc", History: "#f59e0b", Mathematics: "#00d2a5", Economics: "#f87171", Physics: "#60a5fa", Biology: "#34d399", Politics: "#c084fc" }

            try {
                const formData =
                    new FormData()

                if (mat.file) {
                    formData.append(
                        "file",
                        mat.file
                    )
                } else {
                    formData.append(
                        "file",
                        new Blob(
                            [mat.name],
                            {
                                type: "text/plain",
                            }
                        ),
                        `${mat.name}.txt`
                    )
                }

                const res = await fetch(
                    `${API_BASE}/api/summarize`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )

                if (!res.ok) {
                    throw new Error(
                        "Request failed"
                    )
                }

                const data =
                    await res.json()

                const subject =
                    data.subject ||
                    mat.subject

                const color =
                    colors[subject] ||
                    mat.color ||
                    "#7c5cfc"

                if (
                    mat.subject ===
                    "General" &&
                    subject
                ) {
                    updateMaterial(
                        materialId,
                        {
                            subject,
                            color,
                        }
                    )
                }

                const overview =
                    data.overview ||
                    "No overview was generated."

                const keyPoints =
                    Array.isArray(
                        data.keyPoints
                    )
                        ? data.keyPoints
                        : []

                const newSum: Omit<Summary, "id"> = {
                    title: mat.name,
                    subject,
                    sourceFile: mat.name,
                    fileType:
                        mat.type as
                        | "PDF"
                        | "DOCX"
                        | "PPT",
                    generatedAgo:
                        "Just now",
                    readTime: `${Math.ceil(
                        mat.pages / 8
                    )} min read`,
                    wordCount:
                        overview.split(
                            /\s+/
                        ).length +
                        keyPoints
                            .join(" ")
                            .split(
                                /\s+/
                            ).length,
                    color,
                    materialId,
                    overview,
                    keyPoints:
                        keyPoints.map(
                            (
                                text: string,
                                i: number
                            ) => ({
                                id: i + 1,
                                text,
                            })
                        ),
                    tags:
                        Array.isArray(
                            data.tags
                        )
                            ? data.tags
                            : [],
                }

                const sum =
                    addSummary(newSum)

                addNotification({
                    type: "summary",
                    title: "Summary ready",
                    message: `Your AI summary for ${mat.name} is ready.`,
                    time: "Just now",
                    read: false,
                    link: "summaries",
                })

                return sum
            } catch (err) {
                console.error(
                    "generateSummary failed:",
                    err
                )

                addNotification({
                    type: "summary",
                    title: "Summary failed",
                    message: `Could not generate a summary for ${mat.name}.`,
                    time: "Just now",
                    read: false,
                })

                return null
            }
        },
        [
            materials,
            summaries,
            addSummary,
            addNotification,
            updateMaterial,
        ]
    )

    // ── Quizzes ─────────────────────────────────────────────────────────────

    const addQuiz = useCallback(
        (
            q: Omit<Quiz, "id">
        ): Quiz => {
            const quiz: Quiz = {
                ...q,
                id: Date.now(),
            }

            setQuizzes((prev) => [
                quiz,
                ...prev,
            ])

            if (q.materialId) {
                updateMaterial(
                    q.materialId,
                    {
                        hasQuiz: true,
                    }
                )
            }

            return quiz
        },
        [updateMaterial]
    )

    const updateQuiz = useCallback(
        (
            id: number,
            updates: Partial<Quiz>
        ) => {
            setQuizzes((prev) =>
                prev.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            ...updates,
                        }
                        : q
                )
            )
        },
        []
    )

    const completeQuiz = useCallback(
        (
            id: number,
            score: number
        ) => {
            setQuizzes((prev) =>
                prev.map((q) =>
                    q.id === id
                        ? {
                            ...q,
                            status: "completed",
                            score,
                            attempts:
                                q.attempts +
                                1,
                            bestScore:
                                Math.max(
                                    q.bestScore ??
                                    0,
                                    score
                                ),
                        }
                        : q
                )
            )

            addNotification({
                type: "quiz",
                title: "Quiz completed",
                message: `You scored ${score}% on your latest quiz!`,
                time: "Just now",
                read: false,
                link: "quizzes",
            })
        },
        [addNotification]
    )

    const generateQuiz = useCallback(
        async (
            materialId: number
        ): Promise<Quiz | null> => {
            const mat = materials.find(
                (m) => m.id === materialId
            )

            if (!mat) return null

            const existing =
                quizzes.find(
                    (q) =>
                        q.materialId ===
                        materialId
                )

            if (existing) {
                return existing
            }

            const colors: Record<string, string> = { Chemistry: "#7c5cfc", History: "#f59e0b", Mathematics: "#00d2a5", Economics: "#f87171", Physics: "#60a5fa", Biology: "#34d399" }
            const LABELS = [
                "a",
                "b",
                "c",
                "d",
            ]

            try {
                const formData =
                    new FormData()

                if (mat.file) {
                    formData.append(
                        "file",
                        mat.file
                    )
                } else {
                    formData.append(
                        "file",
                        new Blob(
                            [mat.name],
                            {
                                type: "text/plain",
                            }
                        ),
                        `${mat.name}.txt`
                    )
                }

                const res = await fetch(
                    `${API_BASE}/api/quiz`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )

                if (!res.ok) {
                    throw new Error(
                        "Request failed"
                    )
                }

                const data =
                    await res.json()

                const questions: QuizQuestion[] =
                    Array.isArray(
                        data.questions
                    )
                        ? data.questions.map(
                            (
                                q: any,
                                i: number
                            ) => ({
                                id: i + 1,
                                text:
                                    q.question,
                                options:
                                    Array.isArray(
                                        q.options
                                    )
                                        ? q.options.map(
                                            (
                                                opt: string,
                                                j: number
                                            ) => ({
                                                id:
                                                    LABELS[
                                                    j
                                                    ],
                                                text: opt,
                                            })
                                        )
                                        : [],
                                correct:
                                    LABELS[
                                    q.correctIndex
                                    ],
                                explanation:
                                    q.explanation ||
                                    "",
                            })
                        )
                        : []

                if (!questions.length) {
                    throw new Error(
                        "No questions were generated"
                    )
                }

                const newQuiz: Omit<Quiz, "id"> = {
                    title: mat.name,
                    subject:
                        mat.subject,
                    sourceFile: mat.name,
                    due: "This week",
                    color:
                        colors[
                        mat.subject
                        ] ||
                        "#7c5cfc",
                    status: "pending",
                    score: null,
                    attempts: 0,
                    bestScore: null,
                    materialId,
                    questions,
                }

                return addQuiz(newQuiz)
            } catch (err) {
                console.error(
                    "generateQuiz failed:",
                    err
                )

                addNotification({
                    type: "quiz",
                    title: "Quiz failed",
                    message: `Could not generate a quiz for ${mat.name}.`,
                    time: "Just now",
                    read: false,
                })

                return null
            }
        },
        [
            materials,
            quizzes,
            addQuiz,
            addNotification,
        ]
    )

    // ── Flashcards ──────────────────────────────────────────────────────────

    const generateFlashcards = useCallback(
        async (materialId: number): Promise<FlashcardSet | null> => {
            const mat = materials.find(m => m.id === materialId)
            if (!mat) return null
            const existing = flashcardSets.find(f => f.materialId === materialId)
            if (existing) return existing

            try {
                const formData = new FormData()
                if (mat.file) {
                    formData.append("file", mat.file)
                } else {
                    formData.append("file", new Blob([mat.name], { type: "text/plain" }), `${mat.name}.txt`)
                }

                const res = await fetch(`${API_BASE}/api/flashcards`, {
                    method: "POST",
                    body: formData,
                })
                if (!res.ok) throw new Error("Request failed")
                const data = await res.json()

                if (!Array.isArray(data.cards) || data.cards.length === 0) {
                    throw new Error("No flashcards were generated")
                }

                const today = new Date().toISOString()
                const cards: Flashcard[] = data.cards.map((c: any, i: number) => ({
                    id: i + 1,
                    front: c.front,
                    back: c.back,
                    interval: 0,
                    easeFactor: 2.5,
                    repetitions: 0,
                    dueDate: today,
                    lastReviewed: null,
                }))

                const newSet: FlashcardSet = {
                    id: Date.now(),
                    title: mat.name,
                    subject: mat.subject,
                    sourceFile: mat.name,
                    color: mat.color,
                    cards,
                    materialId,
                    generatedAgo: "Just now",
                }
                setFlashcardSets(prev => [newSet, ...prev])
                updateMaterial(materialId, { hasFlashcards: true })
                addNotification({ type: "summary", title: "Flashcards ready", message: `Your flashcards for ${mat.name} are ready.`, time: "Just now", read: false, link: "materials" })
                return newSet
            } catch (err) {
                console.error("generateFlashcards failed:", err)
                addNotification({ type: "summary", title: "Flashcards failed", message: `Could not generate flashcards for ${mat.name}.`, time: "Just now", read: false })
                return null
            }
        },
        [materials, flashcardSets, updateMaterial, addNotification]
    )

    const deleteFlashcardSet = useCallback((id: number) => {
        setFlashcardSets(prev => prev.filter(f => f.id !== id))
    }, [])

    const reviewFlashcard = useCallback(
        (setId: number, cardId: number, rating: "again" | "hard" | "good" | "easy") => {
            setFlashcardSets(prev => prev.map(set => {
                if (set.id !== setId) return set
                return {
                    ...set,
                    cards: set.cards.map(card => {
                        if (card.id !== cardId) return card

                        let { interval, easeFactor, repetitions } = card

                        if (rating === "again") {
                            repetitions = 0
                            interval = 0
                            easeFactor = Math.max(1.3, easeFactor - 0.2)
                        } else {
                            repetitions += 1
                            if (rating === "hard") {
                                easeFactor = Math.max(1.3, easeFactor - 0.15)
                                interval = repetitions === 1 ? 1 : Math.ceil(interval * 1.2)
                            } else if (rating === "good") {
                                interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.ceil(interval * easeFactor)
                            } else if (rating === "easy") {
                                easeFactor = easeFactor + 0.15
                                interval = repetitions === 1 ? 3 : Math.ceil(interval * easeFactor * 1.3)
                            }
                        }

                        const nextDue = new Date()
                        nextDue.setDate(nextDue.getDate() + interval)

                        return {
                            ...card,
                            interval,
                            easeFactor,
                            repetitions,
                            dueDate: nextDue.toISOString(),
                            lastReviewed: new Date().toISOString(),
                        }
                    }),
                }
            }))
        },
        []
    )

    // ── AI Chat ─────────────────────────────────────────────────────────────

    const askQuestion = useCallback(
        async (
            materialId: number,
            question: string
        ): Promise<string | null> => {
            const mat = materials.find(
                (m) => m.id === materialId
            )

            if (!mat) return null

            const existingHistory =
                chatHistories[
                materialId
                ] || []

            const userMsg: ChatMessage = {
                id: Date.now(),
                role: "user",
                content: question,
            }

            setChatHistories((prev) => ({
                ...prev,
                [materialId]: [
                    ...(prev[materialId] ||
                        []),
                    userMsg,
                ],
            }))

            try {
                const formData =
                    new FormData()

                if (mat.file) {
                    formData.append(
                        "file",
                        mat.file
                    )
                } else {
                    formData.append(
                        "file",
                        new Blob(
                            [mat.name],
                            {
                                type: "text/plain",
                            }
                        ),
                        `${mat.name}.txt`
                    )
                }

                formData.append(
                    "question",
                    question
                )

                formData.append(
                    "history",
                    JSON.stringify(
                        existingHistory
                    )
                )

                const res = await fetch(
                    `${API_BASE}/api/ask`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )

                if (!res.ok) {
                    throw new Error(
                        "Request failed"
                    )
                }

                const data =
                    await res.json()

                const assistantMsg: ChatMessage =
                {
                    id:
                        Date.now() +
                        1,
                    role: "assistant",
                    content:
                        data.answer ||
                        "I couldn't generate an answer.",
                }

                setChatHistories(
                    (prev) => ({
                        ...prev,
                        [materialId]: [
                            ...(prev[
                                materialId
                            ] || []),
                            assistantMsg,
                        ],
                    })
                )

                return data.answer
            } catch (err) {
                console.error(
                    "askQuestion failed:",
                    err
                )

                const errorMsg: ChatMessage =
                {
                    id:
                        Date.now() +
                        1,
                    role: "assistant",
                    content:
                        "Sorry, I couldn't answer that. Please try again.",
                }

                setChatHistories(
                    (prev) => ({
                        ...prev,
                        [materialId]: [
                            ...(prev[
                                materialId
                            ] || []),
                            errorMsg,
                        ],
                    })
                )

                return null
            }
        },
        [materials, chatHistories]
    )

    const clearChat = useCallback(
        (materialId: number) => {
            setChatHistories((prev) => {
                const next = {
                    ...prev,
                }

                delete next[materialId]

                return next
            })
        },
        []
    )

    // ── Provider ────────────────────────────────────────────────────────────

    return (
        <AppContext.Provider
            value={{
                // Auth
                isLoggedIn,
                user,
                login,
                signup,
                logout,
                updateUser,

                // Theme
                theme,
                toggleTheme,
                setTheme,

                // Navigation
                currentPage,
                navigate,

                // Materials
                materials,
                addMaterial,
                deleteMaterial,
                updateMaterial,

                // Summaries
                summaries,
                addSummary,
                deleteSummary,
                generateSummary,

                // Quizzes
                quizzes,
                addQuiz,
                updateQuiz,
                generateQuiz,
                completeQuiz,

                // Chat
                chatHistories,
                askQuestion,
                clearChat,

                // Notifications
                notifications,
                markNotifRead,
                markAllNotifsRead,
                addNotification,
                unreadCount,

                // Sidebar
                sidebarOpen,
                setSidebarOpen,

                // Flashcards
                flashcardSets,
                generateFlashcards,
                deleteFlashcardSet,
                reviewFlashcard,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useApp () {
    const ctx = useContext(AppContext)

    if (!ctx) {
        throw new Error(
            "useApp must be used within AppProvider"
        )
    }

    return ctx
}