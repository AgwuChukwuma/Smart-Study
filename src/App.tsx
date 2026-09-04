// src/App.tsx
// Root router – renders the correct page based on currentPage in AppContext
// No external router needed; all navigation goes through navigate()

import { useApp } from "./context/AppContext"

// Pages
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Materials from "./pages/Materials"
import AiSummaries from "./pages/AiSummaries"
import Quizzes from "./pages/Quizzes"
import Progress from "./pages/Progress"
import Collaborate from "./pages/Collaborate"
import Settings from "./pages/Settings"

export default function App () {
  const { currentPage, isLoggedIn } = useApp()

  // Redirect unauthenticated users to landing
  if (!isLoggedIn && !["landing", "login", "signup"].includes(currentPage)) {
    return <LandingPage />
  }

  switch (currentPage) {
    case "landing": return <LandingPage />
    case "login": return <Login />
    case "signup": return <SignUp />
    case "dashboard": return <Dashboard />
    case "materials": return <Materials />
    case "summaries": return <AiSummaries />
    case "quizzes": return <Quizzes />
    case "progress": return <Progress />
    case "collaborate": return <Collaborate />
    case "settings": return <Settings />
    default: return <Dashboard />
  }
}