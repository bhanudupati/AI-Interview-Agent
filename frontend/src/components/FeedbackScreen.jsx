import React, { useState } from 'react';
import { Button, Card, Tag, ProgressBar, ErrorMsg, Spinner } from './UI';
import { nextQuestion } from '../api';

export default function FeedbackScreen({ role, level, questionNum, evaluation, onNext, onDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const score = evaluation?.score ?? 0;
  const pct   = (score / 10) * 100;

  const scoreConfig = score >= 8
    ? { color: 'var(--success)', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', label: 'Excellent', emoji: '🏆' }
    : score >= 6
    ? { color: 'var(--accent2)', bg: 'rgba(79,110,247,0.08)', border: 'rgba(79,110,247,0.2)', label: 'Good', emoji: '👍' }
    : score >= 4
    ? { color: 'var(--gold)', bg: 'rgba(232,184,75,0.08)', border: 'rgba(232,184,75,0.2)', label: 'Fair', emoji: '📝' }
    : { color: 'var(--warn)', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', label: 'Needs Work', emoji: '💪' };

  const levelColor = { Entry: 'success', Mid: 'gold', Senior: 'accent' }[level] || 'accent';

  async function handleNext() {
    if (questionNum >= 3) { onDone(); return; }
    setLoading(true); setError('');
    try {
      const data = await nextQuestion();
      if (!data.question || data.question === 'Interview completed.') { onDone(); return; }
      onNext(data.question);
    } catch (e) {
      setError(`Could not reach backend. (${e.message})`);
    }
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <Tag color="muted">{role}</Tag>
          <Tag color={levelColor}>{level}</Tag>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 500 }}>
          {questionNum} <span style={{ opacity: 0.4 }}>/ 3</span>
        </span>
      </div>

      <ProgressBar value={questionNum} max={3} />

      <Card glow>
        {/* Score section */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          padding: '1.25rem', borderRadius: 12, marginBottom: '1.5rem',
          background: scoreConfig.bg, border: `1px solid ${scoreConfig.border}`,
        }}>
          {/* Score ring */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.2)', border: `2px solid ${scoreConfig.color}`,
            boxShadow: `0 0 16px ${scoreConfig.color}30`,
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: scoreConfig.color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>/10</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1rem' }}>{scoreConfig.emoji}</span>
              <span style={{ fontWeight: 600, color: scoreConfig.color, fontSize: '0.95rem' }}>{scoreConfig.label}</span>
            </div>
            {/* Score bar */}
            <div style={{ height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, borderRadius: 4,
                background: `linear-gradient(90deg, ${scoreConfig.color}80, ${scoreConfig.color})`,
                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }} />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {evaluation?.feedback && (
          <div style={{
            padding: '1.1rem 1.25rem', borderRadius: 10, marginBottom: '0.85rem',
            background: 'rgba(79,110,247,0.06)', border: '1px solid rgba(79,110,247,0.15)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              ◆ Feedback
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>{evaluation.feedback}</div>
          </div>
        )}

        {/* Ideal answer */}
        {evaluation?.correct_answer && (
          <div style={{
            padding: '1.1rem 1.25rem', borderRadius: 10, marginBottom: '1.5rem',
            background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--success)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              ◆ Ideal Answer
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>{evaluation.correct_answer}</div>
          </div>
        )}

        <Button disabled={loading} onClick={handleNext} style={{ width: '100%', padding: '0.85rem' }}>
          {loading
            ? <><Spinner /> Loading...</>
            : questionNum >= 3 ? 'View Results →' : `Next Question (${questionNum + 1}/3) →`
          }
        </Button>

        <ErrorMsg message={error} />
      </Card>
    </div>
  );
}