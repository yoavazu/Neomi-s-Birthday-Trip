import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const EMOJIS = ['🌲', '🌳', '🍃', '🏕️', '⛰️', '🍄', '🪵', '🌿', '⛺', '🔦']
const QUESTIONS = [
  'מגיע/ה?',
  'בטוח/ה?',
  'מיליון אחוז?????'
]

function App() {
  const [stage, setStage] = useState(0)
  const [initialChoice, setInitialChoice] = useState(null)
  const [buttonPos, setButtonPos] = useState({ yes: { x: 0, y: 0 }, no: { x: 0, y: 0 } })
  const [floatingEmojis, setFloatingEmojis] = useState([])

  useEffect(() => {
    // Initialize floating emojis
    const newEmojis = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10
    }))
    setFloatingEmojis(newEmojis)
  }, [])

  const randomizePositions = () => {
    const isMobile = window.innerWidth < 600
    const xRange = isMobile ? window.innerWidth * 0.3 : window.innerWidth * 0.4
    const yRange = isMobile ? window.innerHeight * 0.3 : window.innerHeight * 0.4
    
    const newYes = {
      x: (Math.random() - 0.5) * xRange,
      y: Math.random() * yRange // Only move downwards to avoid the question
    }
    const newNo = {
      x: (Math.random() - 0.5) * xRange,
      y: Math.random() * yRange // Only move downwards to avoid the question
    }
    setButtonPos({ yes: newYes, no: newNo })
  }

  const handleButtonClick = (choice) => {
    if (stage === 0) {
      setInitialChoice(choice)
    }

    if (stage < 2) {
      setStage(stage + 1)
      randomizePositions()
    } else if (stage === 2) {
      setStage(3)
    }
  }

  const handleFinalButtonClick = () => {
    if (initialChoice === 'כן') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#889063', '#CFBB99', '#4C3D19']
      })
    }
    setStage(4)
  }

  return (
    <div className="app-container">
      <div className="emoji-layer">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="floating-emoji"
            style={{
              top: item.top,
              left: item.left,
              animationDelay: `${item.delay}s`
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <main className="card">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          טיול יומולדת לנעמימי 🌲
        </motion.h1>

        <AnimatePresence mode="wait">
          {stage < 3 && (
            <motion.div
              key="interaction-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="interaction-area"
            >
              <h2 className="question">{QUESTIONS[stage]}</h2>
              <div className="button-container">
                <motion.button
                  className="btn btn-yes"
                  animate={stage > 0 ? { x: buttonPos.yes.x, y: buttonPos.yes.y } : { x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => handleButtonClick('כן')}
                >
                  כן
                </motion.button>
                <motion.button
                  className="btn btn-no"
                  animate={stage > 0 ? { x: buttonPos.no.x, y: buttonPos.no.y } : { x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => handleButtonClick('לא')}
                >
                  לא
                </motion.button>
              </div>
            </motion.div>
          )}

          {stage === 3 && (
            <motion.div
              key="button-stage"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="button-image-container"
            >
              <button className="image-button" onClick={handleFinalButtonClick}>
                <img src="/button.png" alt="לחץ כאן" style={{ width: '200px' }} />
              </button>
            </motion.div>
          )}

          {stage === 4 && (
            <motion.div
              key="result-stage"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="result-container"
            >
              <img
                src={initialChoice === 'כן' ? '/good.jpg' : '/bad.png'}
                alt="תוצאה"
                className="result-image"
              />
              <p className="screenshot-text">
                תעשה/י צילום מסך ותשלח/י לנומי לאישור
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
