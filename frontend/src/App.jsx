import React, { useState } from 'react';
import StartScreen    from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import DoneScreen     from './components/DoneScreen';
import ResumeScreen   from './components/ResumeScreen';

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

  const isInterview = ['start','question','feedback','done'].includes(screen);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(8,10,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Logo */}
        <div onClick={handleRestart} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #4f6ef7, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#fff',
          }}>AI</div>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', color: 'var(--text)' }}>
            InterviewAI
          </span>
        </div>

        {/* Interview + Resume buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { label: 'Interview', key: 'interview' },
            { label: 'Resume',    key: 'resume' },
          ].map(({ label, key }) => {
            const active = key === 'resume' ? screen === 'resume' : isInterview;
            return (
              <button
                key={key}
                onClick={() => key === 'resume' ? setScreen('resume') : handleRestart()}
                style={{
                  padding: '0.38rem 1rem', borderRadius: 8,
                  fontSize: '0.83rem', fontWeight: 500,
                  fontFamily: 'var(--font)', cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? 'rgba(79,110,247,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(79,110,247,0.35)' : 'var(--border)'}`,
                  color: active ? '#818cf8' : 'var(--muted)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Progress dots during interview */}
        {screen !== 'start' && screen !== 'resume' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', transition: 'all 0.3s',
                background: i < questionNum - (screen === 'feedback' ? 0 : 1)
                  ? 'var(--success)'
                  : i === questionNum - (screen === 'feedback' ? 0 : 1)
                  ? 'var(--accent)'
                  : 'var(--border2)',
              }} />
            ))}
          </div>
        )}

        {(screen === 'start' || screen === 'resume') && <div style={{ width: 80 }} />}
      </nav>

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
        {screen === 'done'   && <DoneScreen role={role} level={level} onRestart={handleRestart} />}
        {screen === 'resume' && <ResumeScreen onBack={handleRestart} />}
      </main>
    </div>
  );
}