import React from 'react';
import { Button, Card } from './UI';

export default function DoneScreen({ role, level, onRestart }) {
  return (
    <div className="fade-up" style={{ maxWidth: 500, margin: '0 auto', padding: '2rem 0' }}>
      <Card glow style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        {/* Trophy */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, rgba(232,184,75,0.15), rgba(232,184,75,0.05))',
          border: '1px solid rgba(232,184,75,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 0 32px rgba(232,184,75,0.15)',
        }}>
          🏁
        </div>

        <div style={{
          fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 400,
          marginBottom: '0.5rem', lineHeight: 1.2,
        }}>
          Interview Complete
        </div>

        <p style={{ color: 'var(--text2)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          You completed all 3 questions for
        </p>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{
            display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 8,
            background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)',
            color: 'var(--accent2)', fontWeight: 500, fontSize: '0.9rem', marginRight: '0.5rem',
          }}>{role}</span>
          <span style={{
            display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: 8,
            background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.2)',
            color: 'var(--gold)', fontWeight: 500, fontSize: '0.9rem',
          }}>{level}-level</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 2rem' }} />

        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.75rem', lineHeight: 1.7 }}>
          Review the feedback above to improve your answers.<br />
          Practice again to build confidence!
        </p>

        <Button onClick={onRestart} style={{ width: '100%', padding: '0.85rem' }}>
          Start a New Interview →
        </Button>
      </Card>
    </div>
  );
}