import { useState } from 'react'
import content from './data.json'

// ========== HAUPTKOMPONENTE ==========
export default function App() {
  const [phase, setPhase] = useState('start')
  const [userProfile, setUserProfile] = useState({
    level: 'developing',
    errorPatterns: [],
    completedModules: [],
    badges: [],
    totalScore: 0
  })
  const [currentModule, setCurrentModule] = useState(null)

  const handleDiagnosticComplete = (results) => {
    const correctCount = results.filter(r => r.correct).length
    let level = 'developing'
    if (correctCount <= 2) level = 'novice'
    else if (correctCount >= 4) level = 'advanced'
    
    const errors = results.filter(r => !r.correct && r.errorType).map(r => r.errorType)
    
    setUserProfile(prev => ({ ...prev, level, errorPatterns: errors }))
    setPhase('modules')
  }

  const handleModuleComplete = (moduleName, badge, score) => {
    setUserProfile(prev => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleName],
      badges: badge ? [...prev.badges, badge] : prev.badges,
      totalScore: prev.totalScore + score
    }))
    setCurrentModule(null)
  }

  if (phase === 'start') {
    return <StartScreen onStart={() => setPhase('diagnostic')} />
  }

  if (phase === 'diagnostic') {
    return <DiagnosticQuiz onComplete={handleDiagnosticComplete} />
  }

  if (phase === 'modules' && !currentModule) {
    return (
      <ModuleSelector
        userProfile={userProfile}
        onSelectModule={setCurrentModule}
        onFinalChallenge={() => setPhase('final')}
      />
    )
  }

  if (currentModule) {
    return (
      <ModuleRunner
        module={currentModule}
        userProfile={userProfile}
        onComplete={handleModuleComplete}
        onBack={() => setCurrentModule(null)}
      />
    )
  }

  if (phase === 'final') {
    return (
      <FinalChallenge
        userProfile={userProfile}
        onRestart={() => {
          setPhase('start')
          setUserProfile({ level: 'developing', errorPatterns: [], completedModules: [], badges: [], totalScore: 0 })
          setCurrentModule(null)
        }}
      />
    )
  }

  return null
}

// ========== START SCREEN ==========
function StartScreen({ onStart }) {
  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>🎯 Zuordnungen meistern</h1>
          <p>Proportionale und antiproportionale Zuordnungen verstehen</p>
          <p style={{ marginTop: '10px', fontSize: '0.95rem', color: '#6b7280' }}>
            Gymnasium Klasse 7 • ~90 Minuten
          </p>
        </div>
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Was erwartet dich?</h2>
          <div style={{ textAlign: 'left', lineHeight: '2', fontSize: '1.05rem' }}>
            <p>✓ Wertetabellen verstehen und vervollständigen</p>
            <p>✓ Graphen proportionaler Zuordnungen erkennen</p>
            <p>✓ Flexible Rechenstrategien entwickeln</p>
            <p>✓ Textaufgaben aus dem Alltag lösen</p>
          </div>
          <button className="button" onClick={onStart} style={{ marginTop: '40px', fontSize: '1.2rem', padding: '15px 40px' }}>
            Los geht's! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

// ========== DIAGNOSTIC QUIZ ==========
function DiagnosticQuiz({ onComplete }) {
  const [currentItem, setCurrentItem] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const items = content.diagnostic.items
  const item = items[currentItem]

  const handleCheck = () => {
    const isCorrect = item.options[selectedOption]?.correct || false
    const errorType = item.options[selectedOption]?.errorType || null
    setShowFeedback(true)
    
    const newAnswer = { 
      id: item.id, 
      correct: isCorrect, 
      errorType: errorType 
    }
    setAnswers([...answers, newAnswer])
  }

  const handleNext = () => {
    if (currentItem < items.length - 1) {
      setCurrentItem(currentItem + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      onComplete(answers)
    }
  }

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>📋 Eingangsdiagnose</h1>
          <p>Frage {currentItem + 1} von {items.length}</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentItem + 1) / items.length) * 100}%` }} />
        </div>
        <div className="question-container">
          <div className="question-text">{item.question}</div>
          <div className="options-container">
            {item.options && item.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-button ${selectedOption === idx ? 'selected' : ''} ${
                  showFeedback ? (opt.correct ? 'correct' : selectedOption === idx ? 'incorrect' : '') : ''
                }`}
                onClick={() => !showFeedback && setSelectedOption(idx)}
                disabled={showFeedback}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {showFeedback && (
            <div className={`feedback ${item.options[selectedOption]?.correct ? 'success' : 'error'}`}>
              {item.options[selectedOption]?.correct ? item.correctFeedback : item.wrongFeedback}
            </div>
          )}
        </div>
        <div className="button-group">
          {!showFeedback ? (
            <button className="button" onClick={handleCheck} disabled={selectedOption === null}>
              Prüfen
            </button>
          ) : (
            <button className="button" onClick={handleNext}>
              {currentItem < items.length - 1 ? 'Nächste Frage' : 'Diagnose abschließen'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ========== MODULE SELECTOR ==========
function ModuleSelector({ userProfile, onSelectModule, onFinalChallenge }) {
  const modules = [
    { id: 'tables', name: 'Tabellen-Detektive', description: 'Zuordnungstypen erkennen', icon: '📊', badge: '🏆 Tabellen-Profi' },
    { id: 'strategies', name: 'Rechen-Strategien', description: 'Flexibel rechnen lernen', icon: '🧮', badge: '🧮 Rechen-Champion' },
    { id: 'context', name: 'Kontext-Profis', description: 'Textaufgaben lösen', icon: '🌟', badge: '🌟 Alltagsprofi' }
  ]

  const allCompleted = modules.every(m => userProfile.completedModules.includes(m.id))

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>🎓 Deine Lernmodule</h1>
          <p>Wähle ein Modul oder fordere dich in der Final-Challenge heraus!</p>
          {userProfile.level === 'novice' && (
            <p style={{ marginTop: '10px', color: '#f59e0b', fontWeight: '600' }}>
              💡 Tipp: Starte mit "Tabellen-Detektive"!
            </p>
          )}
        </div>
        {userProfile.badges.length > 0 && (
          <div className="badges-container">
            {userProfile.badges.map((badge, idx) => (
              <div key={idx} className="badge">{badge}</div>
            ))}
          </div>
        )}
        <div className="module-selector">
          {modules.map(module => (
            <div
              key={module.id}
              className={`module-card ${userProfile.completedModules.includes(module.id) ? 'completed' : ''}`}
              onClick={() => onSelectModule(module.id)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{module.icon}</div>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
        {allCompleted && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="button" onClick={onFinalChallenge} style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
              🏆 Final-Challenge starten!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ========== MODULE RUNNER ==========
function ModuleRunner({ module, userProfile, onComplete, onBack }) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const getModuleTasks = () => {
    if (module === 'tables') return content.tables.tasks
    if (module === 'strategies') return content.strategies.tasks
    if (module === 'context') return content.context.tasks
    return []
  }

  const tasks = getModuleTasks()
  const task = tasks[currentTaskIndex]

  const handleNext = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
      setShowFeedback(false)
    } else {
      const badge = getBadgeForModule(module)
      onComplete(module, badge, score)
    }
  }

  const handleTaskComplete = (correct) => {
    if (correct) setScore(score + 1)
    setShowFeedback(true)
  }

  if (!task) {
    return (
      <div className="app-container">
        <div className="main-card">
          <div className="header">
            <h1>Lade Aufgaben...</h1>
          </div>
          <div className="button-group">
            <button className="button" onClick={onBack}>Zurück</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>{getModuleName(module)}</h1>
          <p>Aufgabe {currentTaskIndex + 1} von {tasks.length} • Punkte: {score}/{currentTaskIndex + (showFeedback ? 1 : 0)}</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentTaskIndex + 1) / tasks.length) * 100}%` }} />
        </div>
        <TaskRenderer
          task={task}
          onComplete={handleTaskComplete}
          showFeedback={showFeedback}
        />
        <div className="button-group">
          <button className="button button-secondary" onClick={onBack}>
            Zurück
          </button>
          {showFeedback && (
            <button className="button" onClick={handleNext}>
              {currentTaskIndex < tasks.length - 1 ? 'Nächste Aufgabe' : 'Modul abschließen'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ========== TASK RENDERER ==========
function TaskRenderer({ task, onComplete, showFeedback }) {
  const [answer, setAnswer] = useState(null)
  const [inputValues, setInputValues] = useState({})
  const [hintLevel, setHintLevel] = useState(0)
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    let isCorrect = false

    if (task.type === 'recognition' || task.type === 'situation') {
      isCorrect = answer === task.correct
    } else if (task.type === 'completion') {
      isCorrect = true
      task.data.forEach((row, rowIdx) => {
        row.forEach((cell, colIdx) => {
          if (cell === null) {
            const key = `${rowIdx}-${colIdx}`
            const expected = task.solution[rowIdx][colIdx]
            if (Math.abs(parseFloat(inputValues[key] || 0) - expected) > 0.1) {
              isCorrect = false
            }
          }
        })
      })
    } else if (task.type === 'choice' || task.type === 'mixed' || task.type === 'problem') {
      isCorrect = Math.abs(parseFloat(answer || 0) - task.solution) < 0.1
    } else if (task.type === 'trap') {
      const selectedOpt = task.options.find(o => o.value === parseInt(answer))
      isCorrect = selectedOpt?.correct || false
    }

    setChecked(true)
    onComplete(isCorrect)
  }

  // Recognition Task
  if (task.type === 'recognition' || task.type === 'situation') {
    const options = task.type === 'recognition' 
      ? ['proportional', 'antiproportional', 'none']
      : ['proportional', 'antiproportional', 'none']
    const labels = { 
      proportional: 'Proportional', 
      antiproportional: 'Antiproportional', 
      none: 'Keine von beiden' 
    }

    return (
      <div className="question-container">
        <div className="question-text">
          {task.question || task.situation}
        </div>
        {task.data && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  {task.data.map((row, idx) => <th key={idx}>{row[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>y</td>
                  {task.data.map((row, idx) => <td key={idx}>{row[1]}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="options-container">
          {options.map(opt => (
            <button
              key={opt}
              className={`option-button ${answer === opt ? 'selected' : ''} ${
                showFeedback ? (opt === task.correct ? 'correct' : answer === opt ? 'incorrect' : '') : ''
              }`}
              onClick={() => !showFeedback && setAnswer(opt)}
              disabled={showFeedback}
            >
              {labels[opt]}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div className={`feedback ${answer === task.correct ? 'success' : 'error'}`}>
            {answer === task.correct ? task.correctFeedback : (task.wrongFeedback || task.explanation)}
          </div>
        )}
        {!showFeedback && task.hints && (
          <div className="hint-system">
            {hintLevel < task.hints.length && (
              <button className="hint-button" onClick={() => setHintLevel(hintLevel + 1)}>
                💡 Hilfe anzeigen ({hintLevel + 1}/{task.hints.length})
              </button>
            )}
            {hintLevel > 0 && (
              <div className="hint-content">
                <strong>Tipp {hintLevel}:</strong> {task.hints[hintLevel - 1]}
              </div>
            )}
          </div>
        )}
        {!showFeedback && (
          <div className="button-group">
            <button className="button" onClick={handleCheck} disabled={!answer}>
              Prüfen
            </button>
          </div>
        )}
      </div>
    )
  }

  // Completion Task
  if (task.type === 'completion') {
    return (
      <div className="question-container">
        <div className="question-text">{task.description}</div>
        <div className="table-container">
          <table>
            <tbody>
              {task.data.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx}>
                      {cell === null ? (
                        <input
                          type="number"
                          step="0.1"
                          className={`input-field ${
                            showFeedback
                              ? Math.abs(parseFloat(inputValues[`${rowIdx}-${colIdx}`] || 0) - task.solution[rowIdx][colIdx]) < 0.1
                                ? 'correct'
                                : 'incorrect'
                              : ''
                          }`}
                          value={inputValues[`${rowIdx}-${colIdx}`] || ''}
                          onChange={(e) => setInputValues({ ...inputValues, [`${rowIdx}-${colIdx}`]: e.target.value })}
                          disabled={showFeedback}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showFeedback && (
          <div className="feedback success">
            ✓ {checked && Math.abs(parseFloat(Object.values(inputValues)[0] || 0) - task.solution[0][1]) < 0.1 
              ? 'Sehr gut! Alle Werte sind korrekt.' 
              : 'Fast! Überprüfe deine Berechnungen nochmal.'}
          </div>
        )}
        {!showFeedback && task.hints && (
          <div className="hint-system">
            {hintLevel < task.hints.length && (
              <button className="hint-button" onClick={() => setHintLevel(hintLevel + 1)}>
                💡 Hilfe ({hintLevel + 1}/{task.hints.length})
              </button>
            )}
            {hintLevel > 0 && <div className="hint-content">{task.hints[hintLevel - 1]}</div>}
          </div>
        )}
        {!showFeedback && (
          <div className="button-group">
            <button className="button" onClick={handleCheck}>
              Prüfen
            </button>
          </div>
        )}
      </div>
    )
  }

  // Calculation Tasks (choice, mixed, problem)
  if (task.type === 'choice' || task.type === 'mixed' || task.type === 'problem') {
    return (
      <div className="question-container">
        <div className="question-text">{task.question || task.text}</div>
        <div style={{ margin: '20px 0' }}>
          <input
            type="number"
            step="0.01"
            className={`input-field ${
              showFeedback ? (Math.abs(parseFloat(answer || 0) - task.solution) < 0.1 ? 'correct' : 'incorrect') : ''
            }`}
            style={{ width: '150px', fontSize: '1.1rem', padding: '10px' }}
            value={answer || ''}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={showFeedback}
            placeholder="Deine Antwort"
          />
          {task.unit && <span style={{ marginLeft: '10px', fontSize: '1.1rem' }}>{task.unit}</span>}
        </div>
        {showFeedback && (
          <div className={`feedback ${Math.abs(parseFloat(answer || 0) - task.solution) < 0.1 ? 'success' : 'error'}`}>
            {Math.abs(parseFloat(answer || 0) - task.solution) < 0.1
              ? '✓ Perfekt gelöst!'
              : `⚠️ Nicht ganz. Die richtige Lösung ist ${task.solution} ${task.unit || ''}.`}
          </div>
        )}
        {!showFeedback && task.hints && (
          <div className="hint-system">
            {hintLevel < task.hints.length && (
              <button className="hint-button" onClick={() => setHintLevel(hintLevel + 1)}>
                💡 Hilfe ({hintLevel + 1}/{task.hints.length})
              </button>
            )}
            {hintLevel > 0 && <div className="hint-content">{task.hints[hintLevel - 1]}</div>}
          </div>
        )}
        {!showFeedback && (
          <div className="button-group">
            <button className="button" onClick={handleCheck} disabled={!answer}>
              Prüfen
            </button>
          </div>
        )}
      </div>
    )
  }

  // Trap Task (Overlinearization)
  if (task.type === 'trap') {
    return (
      <div className="question-container">
        <div className="question-text">{task.text}</div>
        <div className="options-container">
          {task.options.map(opt => (
            <button
              key={opt.value}
              className={`option-button ${answer == opt.value ? 'selected' : ''} ${
                showFeedback ? (opt.correct ? 'correct' : answer == opt.value ? 'incorrect' : '') : ''
              }`}
              onClick={() => !showFeedback && setAnswer(opt.value)}
              disabled={showFeedback}
            >
              {opt.value}
            </button>
          ))}
        </div>
        {showFeedback && (
          <div className={`feedback ${task.options.find(o => o.value === parseInt(answer))?.correct ? 'success' : 'error'}`}>
            {task.options.find(o => o.value === parseInt(answer))?.correct ? task.correctFeedback : task.wrongFeedback}
          </div>
        )}
        {!showFeedback && (
          <div className="button-group">
            <button className="button" onClick={handleCheck} disabled={!answer}>
              Prüfen
            </button>
          </div>
        )}
      </div>
    )
  }

  return <div className="question-container"><p>Aufgabe wird geladen...</p></div>
}

// ========== FINAL CHALLENGE ==========
function FinalChallenge({ userProfile, onRestart }) {
  const [completed, setCompleted] = useState(false)

  if (!completed) {
    return (
      <div className="app-container">
        <div className="main-card">
          <div className="header">
            <h1>🏆 Final-Challenge</h1>
            <p>Zeige was du gelernt hast!</p>
          </div>
          <div className="question-container">
            <h3 style={{ marginBottom: '20px' }}>Deine Leistung:</h3>
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-label">Module gemeistert</div>
                <div className="stat-value">{userProfile.completedModules.length}/3</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Badges erhalten</div>
                <div className="stat-value">{userProfile.badges.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Gesamtpunkte</div>
                <div className="stat-value">{userProfile.totalScore}</div>
              </div>
            </div>
            {userProfile.badges.length > 0 && (
              <div>
                <h3 style={{ textAlign: 'center', margin: '30px 0 20px' }}>Deine Badges:</h3>
                <div className="badges-container">
                  {userProfile.badges.map((badge, idx) => (
                    <div key={idx} className="badge">{badge}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="button-group">
            <button className="button" onClick={() => setCompleted(true)} style={{ fontSize: '1.1rem' }}>
              Abschließen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header">
          <h1>🎉 Geschafft!</h1>
          <p>Du hast das Lernprogramm erfolgreich abgeschlossen!</p>
        </div>
        <div className="reflection-form">
          <h3 style={{ marginBottom: '20px' }}>Was hast du gelernt?</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Proportionale Zuordnungen erkennen
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Antiproportionale Zuordnungen erkennen
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Verschiedene Rechenstrategien anwenden
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Textaufgaben lösen
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked /> Erkennen wenn etwas NICHT proportional ist
            </label>
          </div>
        </div>
        <div className="button-group">
          <button className="button" onClick={onRestart} style={{ fontSize: '1.1rem' }}>
            Nochmal starten 🔄
          </button>
        </div>
      </div>
    </div>
  )
}

// ========== HELPER FUNCTIONS ==========
function getModuleName(module) {
  const names = {
    tables: '📊 Tabellen-Detektive',
    strategies: '🧮 Rechen-Strategien',
    context: '🌟 Kontext-Profis'
  }
  return names[module] || module
}

function getBadgeForModule(module) {
  const badges = {
    tables: '🏆 Tabellen-Profi',
    strategies: '🧮 Rechen-Champion',
    context: '🌟 Alltagsprofi'
  }
  return badges[module]
}
