import { useState } from "react"
import "../styles/FlashcardDeck.css"

interface Flashcard {
    id: number
    front: string
    back: string
}

const ArrowLeft = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" width="18" height="18"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
const ArrowRight = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
const ShuffleIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>

export default function FlashcardDeck ({ cards, color }: { cards: Flashcard[]; color: string }) {
    const [order, setOrder] = useState(cards.map((_, i) => i))
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)

    if (cards.length === 0) return null

    const card = cards[order[index]]
    const progress = ((index + 1) / cards.length) * 100

    const goNext = () => {
        setFlipped(false)
        setIndex(i => (i + 1) % cards.length)
    }
    const goPrev = () => {
        setFlipped(false)
        setIndex(i => (i - 1 + cards.length) % cards.length)
    }
    const shuffle = () => {
        const shuffled = [...order].sort(() => Math.random() - 0.5)
        setOrder(shuffled)
        setIndex(0)
        setFlipped(false)
    }

    return (
        <div className="fc-deck" style={{ ["--fc-color" as any]: color }}>
            <div className="fc-progress-row">
                <span className="fc-counter">{index + 1} / {cards.length}</span>
                <button className="fc-shuffle-btn" onClick={shuffle}><ShuffleIcon /> Shuffle</button>
            </div>
            <div className="fc-progress-track">
                <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="fc-card-stage" onClick={() => setFlipped(f => !f)}>
                <div className={`fc-card ${flipped ? "flipped" : ""}`}>
                    <div className="fc-card-face fc-front">
                        <span className="fc-face-label">Question</span>
                        <p className="fc-face-text">{card.front}</p>
                        <span className="fc-tap-hint">Tap to reveal answer</span>
                    </div>
                    <div className="fc-card-face fc-back">
                        <span className="fc-face-label">Answer</span>
                        <p className="fc-face-text">{card.back}</p>
                        <span className="fc-tap-hint">Tap to flip back</span>
                    </div>
                </div>
            </div>

            <div className="fc-nav-row">
                <button className="fc-nav-btn" onClick={goPrev}><ArrowLeft /></button>
                <button className="fc-nav-btn primary" style={{ background: color }} onClick={goNext}>
                    Next <ArrowRight />
                </button>
            </div>
        </div>
    )
}