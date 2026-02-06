import { useEffect, useState } from 'react'
import './App.css'
import Bulb from './components/Bulb'
import { playClickSound, playLightOnSound, playFireworksSound } from './utils/audio'
import confetti from 'canvas-confetti'

// The Golden Path (5 Bulbs)
const SECRET_CODE = [2, 0, 4, 1, 3];

function App() {
  const [bulbs, setBulbs] = useState(Array(5).fill(true))
  const [userSequence, setUserSequence] = useState([])
  const [gameState, setGameState] = useState('active') // 'active', 'won', 'failed'
  const [hintActive, setHintActive] = useState(null) // Index of bulb to flash

  const handleBulbClick = (index) => {
    // Only allow clicking if game is active and bulb is ON
    if (gameState !== 'active' || !bulbs[index]) return

    playClickSound()

    // Clear hint if active
    setHintActive(null)

    // Update State
    const newBulbs = [...bulbs]
    newBulbs[index] = false // Turn OFF
    setBulbs(newBulbs)

    const newSequence = [...userSequence, index]
    setUserSequence(newSequence)

    // Check Logic
    // 1. Check if the newly clicked bulb is valid FOR THIS STEP
    // The user must click the bulb that matches SECRET_CODE[current_step]
    // STRICT MODE: If they click out of order, they fail immediately.

    /* 
       Actually, the prompt says: "If the user’s clickHistory matches the SECRET_CODE exactly when the last bulb is turned off."
       And "Failure Condition: If any bulb is clicked out of order... or if the final bulb is reached and sequence is wrong."
       
       Let's implement strict step-by-step validation for immediate feedback (The Haunting).
    */

    const currentStep = newSequence.length - 1;
    if (newSequence[currentStep] !== SECRET_CODE[currentStep]) {
      // WRONG MOVE -> HAUNTING
      setGameState('failed')
      // Trigger Haunting Restart after a short delay or keep it dead?
      // Prompt says: "All bulbs will suddenly slam back ON in a harsh... pattern"
      setTimeout(() => {
        // Slam ON visuals handled by CSS class 'haunting'
      }, 0)
      return;
    }

    // 2. Check Win Condition
    if (newSequence.length === SECRET_CODE.length) {
      setGameState('won')
      // Confetti triggered by useEffect now
    }
  }

  // Effect to trigger confetti on Win
  useEffect(() => {
    if (gameState === 'won') {
      playFireworksSound();
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [gameState])

  const handleHint = () => {
    if (gameState !== 'active') return

    // Find the next correct bulb in the sequence
    const currentStep = userSequence.length
    const nextBulbIndex = SECRET_CODE[currentStep]

    // Flash it
    setHintActive(nextBulbIndex)

    // Auto-clear hint after 1.5s
    setTimeout(() => setHintActive(null), 1500)
  }

  const handleRetry = () => {
    setGameState('active')
    setBulbs(Array(5).fill(true))
    setUserSequence([])
    setHintActive(null)
    playLightOnSound()
  }

  // Determine Bulb Class
  const getBulbClass = (index) => {
    if (gameState === 'won') return 'victory-dance'
    if (gameState === 'failed') return 'haunting'
    if (hintActive === index) return 'hint-flash'
    return '' // Normal state handled by Bulb component
  }

  return (
    <div className='app-container'>
      <header className="game-header">
        <h1>Interactive Bulb<br />Logic Challenge</h1>
      </header>

      <div className="content-wrapper">
        <main className="game-board">
          {gameState === 'active' ? (
            <div className="progress-container">
              <div className="progress-text">Sequence Progress: <span>{userSequence.length} / 5</span></div>
            </div>
          ) : (
            <div className={`game-status ${gameState === 'won' ? 'status-won' : 'status-lost'}`}>
              {gameState === 'won' ? 'VICTORY DANCE!' : 'SYSTEM FAILURE'}
            </div>
          )}

          <div className="bulb-wrapper">
            {bulbs.map((isOn, index) => (
              <div key={index} className={getBulbClass(index)}>
                <Bulb
                  isOn={gameState === 'failed' ? true : isOn} // Haunting snaps all ON
                  index={index}
                  onClick={() => handleBulbClick(index)}
                />
              </div>
            ))}
          </div>

          <div className="retry-container">
            {gameState !== 'active' ? (
              <button className="retry-btn" onClick={handleRetry}>
                [ SYSTEM RESET ]
              </button>
            ) : (
              <button
                className="hint-btn"
                onClick={handleHint}
                disabled={hintActive !== null}
              >
                Need a Hint?
              </button>
            )}
          </div>
        </main>

        <section className="manual-container">
          <div className="manual-content">
            <h2>💡 The Mystery of the Lightbulb Grid</h2>
            <p>Welcome to the upgraded Bulb Challenge. This isn't just a toggle test anymore—it’s a logic-based combination lock.</p>

            <h3>🎮 How to Play</h3>
            <ul>
              <li><strong>The Starting State:</strong> All bulbs begin in the ON position (glowing).</li>
              <li><strong>The Objective:</strong> You must turn OFF every bulb on the screen.</li>
              <li><strong>The Secret Sequence:</strong> The order in which you turn them off matters. There is one "Golden Path" hidden in the code.</li>
            </ul>

            <h3>✨ The Outcomes</h3>
            <ul>
              <li><strong>The Reward (The Dance):</strong> If you guess the correct sequence, the bulbs will break into a "Victory Dance"—a rhythmic, pleasing flicker.</li>
              <li><strong>The Penalty (The Haunting):</strong> If you click the wrong bulb, the screen will flash GAME OVER. All bulbs will suddenly slam back ON in a harsh, ominous pattern.</li>
            </ul>

            <h3>⌨️ Laptop Controls</h3>
            <div className="controls-table">
              <div className="row header">
                <span>Input</span>
                <span>Action</span>
                <span>Effect</span>
              </div>
              <div className="row">
                <span><strong>Click / Space</strong></span>
                <span>Toggle Bulb</span>
                <span>Must follow the Secret Code.</span>
              </div>
              <div className="row">
                <span><strong>Tab</strong></span>
                <span>Navigate</span>
                <span>Select next bulb.</span>
              </div>
            </div>

            <div className="pro-tip">
              <strong>Hint:</strong> The code is <strong>3 - 1 - 5 - 2 - 4</strong>. (Don't tell anyone!)
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
