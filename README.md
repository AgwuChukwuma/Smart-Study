# Smart Study

An AI-powered study assistant app built with a React (Vite) frontend and an Express backend, using the Google Gemini API.

## Tech Stack

**Frontend**
- React + Vite
- TypeScript

**Backend**
- Node.js + Express
- Google Gemini API

## Project Structure

```
smart-study/
├── src/                # React frontend source
├── public/              # Static assets
├── server/              # Express backend
│   ├── index.js
│   └── package.json
├── package.json         # Frontend package config
└── README.md
```

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd smart-study
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/` with:

```
GEMINI_API_KEY=your_actual_key_here
```

Start the backend:

```bash
node index.js
```

The server will run on `http://localhost:3001`.

### 3. Set up the frontend

In a new terminal, from the project root:

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port) and talk to the backend at `http://localhost:3001`.

## Environment Variables

| Variable          | Location          | Description                          |
|-------------------|--------------------|---------------------------------------|
| `GEMINI_API_KEY`   | `server/.env`      | API key for Google Gemini             |


## Deployment

This app is deployed as two separate services from a single repo:

- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend** → [Render](https://render.com) (or similar host that supports persistent Node servers)

The frontend's `API_BASE` (in `src/context/AppContext.tsx`) points to the live backend URL in production and `http://localhost:3001` in development.

## License

This project currently has no license specified. All rights reserved unless otherwise stated.
