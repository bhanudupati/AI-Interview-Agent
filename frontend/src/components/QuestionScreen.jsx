import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, ProgressBar, Textarea, ErrorMsg, Spinner, Label } from './UI';
import { submitAnswer } from '../api';

export default function QuestionScreen({ role, level, questionNum, question, onEvaluated }) {
  const [answer, setAnswer]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => { setCharCount(answer.length); }, [answer]);

  const levelColor = { Entry: 'success', Mid: 'gold', Senior: 'accent' }[level] || 'accent';

  async function handleSubmit(skip = false) {
    setLoading(true); setError('');
    try {
      const data = await submitAnswer(skip ? '(skipped)' : answer);
      onEvaluated(data);
    } catch (e) {
      setError(`Could not reach backend. (${e.message})`);
    }
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Tag color="muted">{role}</Tag>
          <Tag color={levelColor}>{level}</Tag>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.04em' }}>
          {questionNum} <span style={{ opacity: 0.4 }}>/ 3</span>
        </div>
      </div>

      <ProgressBar value={questionNum - 1} max={3} />

      <Card glow>
        {/* Question number badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent2)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem',
          padding: '0.2rem 0.65rem', borderRadius: 6,
          background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.15)',
        }}>
          Question {questionNum}
        </div>

        {/* Question text */}
        <div style={{
          fontFamily: 'var(--serif)', fontSize: '1.3rem', lineHeight: 1.6,
          color: 'var(--text)', marginBottom: '2rem', fontWeight: 400,
          borderLeft: '2px solid rgba(79,110,247,0.3)', paddingLeft: '1.25rem',
        }}>
          {question}
        </div>

        {/* Answer area */}
        <div style={{
          background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '1.25rem',
          border: '1px solid var(--border)', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <Label style={{ margin: 0 }}>Your answer</Label>
            <span style={{ fontSize: '0.75rem', color: charCount > 20 ? 'var(--accent2)' : 'var(--muted)' }}>
              {charCount} chars
            </span>
          </div>
          <Textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be thorough and explain your reasoning."
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button disabled={loading} onClick={() => handleSubmit(false)} style={{ flex: 1, padding: '0.8rem' }}>
            {loading ? <><Spinner /> Evaluating...</> : 'Submit Answer →'}
          </Button>
          <Button variant="outline" disabled={loading} onClick={() => handleSubmit(true)}>
            Skip
          </Button>
        </div>

        <ErrorMsg message={error} />
      </Card>

      {/* Tip */}
      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 8,
        background: 'rgba(232,184,75,0.05)', border: '1px solid rgba(232,184,75,0.1)',
        fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem',
      }}>
        <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✦</span>
        Tip: Explain your thought process and give examples where possible.
      </div>
    </div>
  );
}