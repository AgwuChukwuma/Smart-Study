import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const USERS_FILE = path.join(__dirname, "users.json");

const app = express();
app.use(cors({ origin: ["https://lofty-smart-study.netlify.app", "http://localhost:5173"] }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    generationConfig: {
        maxOutputTokens: 8192,
    },
});
function loadUsers () {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function saveUsers (users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function generateWithRetry (prompt, retries = 3) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await model.generateContent(prompt);
        } catch (err) {
            const isOverloaded = err.status === 503;
            if (isOverloaded && i < retries) {
                const wait = 2000 * (i + 1);
                console.log(`Model overloaded, retrying in ${wait}ms... (attempt ${i + 1}/${retries})`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }
            throw err;
        }
    }
}

async function extractText (file) {
    const { mimetype, buffer } = file;

    if (mimetype === "application/pdf") {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        return result.text;
    }

    if (mimetype.includes("wordprocessingml") || mimetype.includes("msword")) {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
    }

    return buffer.toString("utf-8");
}

// --- Signup ---
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        const users = loadUsers();
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now(),
            name,
            email,
            passwordHash,
        };
        users.push(newUser);
        saveUsers(users);

        const { passwordHash: _omit, ...safeUser } = newUser;
        res.json({ user: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed." });
    }
});

// --- Login ---
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const users = loadUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const { passwordHash: _omit, ...safeUser } = user;
        res.json({ user: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed." });
    }
});

// --- App state persistence ---
app.get("/api/state", (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.json(null);
        }
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        res.json(JSON.parse(raw));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load state" });
    }
});

app.post("/api/state", (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save state" });
    }
});

// --- Summarize endpoint ---
app.post("/api/summarize", upload.single("file"), async (req, res) => {
    try {
        const text = await extractText(req.file);

        const prompt = `Based on the following study notes, return ONLY valid JSON (no markdown, no preamble) in this exact shape:

{
  "subject": "one word/short phrase classifying the subject, e.g. Chemistry, History, Mathematics, Economics, Physics, Biology, Computer Science, Literature, Politics, etc.",
  "overview": "2-3 sentence overview of the material",
  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "tags": ["tag1", "tag2", "tag3"]
}

Notes:
---
${text}`;

        const result = await generateWithRetry(prompt);
        const raw = result.response.text();
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

// --- Quiz generation endpoint ---
app.post("/api/quiz", upload.single("file"), async (req, res) => {
    try {
        const text = await extractText(req.file);

        const prompt = `You are creating a comprehensive study guide from the following course material, for a university student preparing for an exam. Return ONLY valid JSON (no markdown, no preamble) in this exact shape:

{
  "subject": "one word/short phrase classifying the subject, e.g. Chemistry, History, Mathematics, Economics, Physics, Biology, Computer Science, Literature, Politics, etc.",
  "overview": "A thorough overview, 8-12 sentences, that introduces the topic, explains why it matters, what a student is expected to understand after studying it, and how the different sections/themes in the material connect to each other.",
  "keyPoints": ["key point 1", "key point 2", "..."],
  "tags": ["tag1", "tag2", "..."]
}

Requirements:
- Extract EVERY distinct concept, definition, formula, process, or fact that a student would need to know for an exam on this material — do not skip minor points, since a student is relying on this to avoid re-reading the original document.
- Each key point should be a full, self-contained explanation of 3-5 sentences: state the concept clearly, explain how/why it works, and include any relevant example, formula, or exception mentioned in the notes.
- Aim for as many key points as the material genuinely supports — dense material should produce 10-20+ key points rather than being compressed into a handful of vague bullets.
- Do not just paraphrase headings — actually explain the underlying content beneath each heading.
- Include 5-8 tags covering the specific sub-topics, not just the general subject.

Notes:
---
${text}`;

        const result = await generateWithRetry(prompt);
        const raw = result.response.text();
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        res.json({ questions: parsed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
});
// --- Ask about a document ---
app.post("/api/ask", upload.single("file"), async (req, res) => {
    try {
        const text = await extractText(req.file);
        const { question, history } = req.body;

        const parsedHistory = history ? JSON.parse(history) : [];
        const historyText = parsedHistory
            .map(h => `${h.role === "user" ? "Student" : "Tutor"}: ${h.content}`)
            .join("\n");

        const prompt = `You are a helpful study tutor. Answer the student's question using ONLY the information in the notes below. If the answer isn't covered in the notes, say so honestly rather than making something up — you can still explain the general concept briefly if helpful, but be clear it's not from their material.

Keep your answer clear and conversational, like a tutor explaining to a student. Use examples from the notes where relevant.

--- NOTES ---
${text}

--- CONVERSATION SO FAR ---
${historyText || "(none yet)"}

--- STUDENT'S QUESTION ---
${question}`;

        const result = await generateWithRetry(prompt);
        const answer = result.response.text();

        res.json({ answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to answer question" });
    }
});
// --- Flashcards endpoint ---
app.post("/api/flashcards", upload.single("file"), async (req, res) => {
    try {
        const text = await extractText(req.file);

        const prompt = `Based on the following study notes, generate exactly 10 flashcards for exam revision.
Return ONLY valid JSON (no markdown, no preamble) in this exact shape:

[
  { "front": "question or term", "back": "answer or definition, 1-3 sentences" }
]

Requirements:
- Generate exactly 10 flashcards, no more and no fewer.
- Cover the most important terms, definitions, formulas, and concepts in the notes — prioritize the most exam-relevant content if there's more material than 10 cards can cover.
- The "front" should be a short question or term (not a full sentence restating the answer).
- The "back" should be a clear, self-contained answer, 1-3 sentences.

Notes:
---
${text}`;

        const result = await generateWithRetry(prompt);
        const raw = result.response.text();
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        res.json({ cards: parsed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate flashcards" });
    }
});
app.listen(3001, () => console.log("Server running on port 3001"));