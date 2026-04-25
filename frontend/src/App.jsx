import React, { useState } from 'react';
import StartScreen    from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import DoneScreen     from './components/DoneScreen';

export default function App() {
  const [screen, setScreen]     = useState('start');
  const [role, setRole]         = useState('');
  const [level, setLevel]       = useState('Entry');
  const [questionNum, setQNum]  = useState(1);
  const [question, setQuestion] = useState('');
  const [evaluation, setEval]   = useState(null);

  function handleStarted({ role, level, questionNum, question }) {
    setRole(role); setLevel(level);
    setQNum(questionNum); setQuestion(question);
    setScreen('question');
  }

  function handleEvaluated(evaluation) {
    setEval(evaluation);
    setScreen('feedback');
  }

  function handleNext(nextQuestion) {
    setQNum(n => n + 1);
    setQuestion(nextQuestion);
    setEval(null);
    setScreen('question');
  }

  function handleRestart() {
    setRole(''); setLevel('Entry');
    setQNum(1); setQuestion(''); setEval(null);
    setScreen('start');
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(8,10,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div
          onClick={handleRestart}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: '#fff',
          }}>AI</div>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', color: 'var(--text)' }}>
            InterviewAI
          </span>
        </div>

        {/* Screen indicator */}
        {screen !== 'start' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {['question', 'feedback', 'question', 'feedback', 'question', 'feedback', 'done'].slice(0, 3).map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i < questionNum - (screen === 'feedback' ? 0 : 1)
                  ? 'var(--success)'
                  : i === questionNum - (screen === 'feedback' ? 0 : 1)
                  ? 'var(--accent)'
                  : 'var(--border2)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        )}

        <button
          onClick={handleRestart}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--muted)', fontSize: '0.8rem',
            padding: '0.35rem 0.85rem', cursor: 'pointer', fontFamily: 'var(--font)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          {screen === 'start' ? 'Docs' : '← Restart'}
        </button>
      </nav>

      {/* Main content */}
      <main style={{ padding: '2rem 1.5rem 6rem', maxWidth: 780, margin: '0 auto' }}>
        {screen === 'start'    && <StartScreen onStarted={handleStarted} />}
        {screen === 'question' && (
          <QuestionScreen
            role={role} level={level}
            questionNum={questionNum} question={question}
            onEvaluated={handleEvaluated}
          />
        )}
        {screen === 'feedback' && (
          <FeedbackScreen
            role={role} level={level}
            questionNum={questionNum} evaluation={evaluation}
            onNext={handleNext}
            onDone={() => setScreen('done')}
          />
        )}
        {screen === 'done' && <DoneScreen role={role} level={level} onRestart={handleRestart} />}
      </main>
    </div>
  );
}