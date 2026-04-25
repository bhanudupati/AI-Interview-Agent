import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Select, ErrorMsg, Spinner } from './UI';
import { startInterview } from '../api';

const roles = [
  'Data Analyst', 'Data Scientist', 'ML Engineer', 'Backend Engineer',
  'Frontend Engineer', 'Full Stack Engineer', 'Data Engineer', 'AI Engineer',
];

export default function StartScreen({ onStarted }) {
  const [role, setRole]       = useState('');
  const [level, setLevel]     = useState('Entry');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const levelOptions = [
    { value: 'Entry',  label: 'Entry-level' },
    { value: 'Mid',    label: 'Mid-level' },
    { value: 'Senior', label: 'Senior-level' },
  ];

  async function handleStart() {
    if (!role.trim()) { setError('Please enter a job role to continue.'); return; }
    setLoading(true); setError('');
    try {
      const data = await startInterview(role.trim(), level);
      onStarted({ role: role.trim(), level, questionNum: data.question_number || 1, question: data.question });
    } catch (e) {
      setError(`Could not connect to backend. Make sure FastAPI is running on localhost:8000. (${e.message})`);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '2rem 0' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.3rem 0.9rem', borderRadius: '20px', marginBottom: '1.5rem',
          background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)',
          fontSize: '0.78rem', fontWeight: 500, color: 'var(--accent2)', letterSpacing: '0.06em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
          AI-POWERED INTERVIEWS
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: '3.2rem', fontWeight: 400,
          lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.01em',
          background: 'linear-gradient(135deg, var(--text) 30%, var(--accent2) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Practice makes<br /><em>perfect</em>
        </h1>

        <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
          AI-generated technical questions tailored to your role and experience level.
        </p>
      </div>

      {/* Form card */}
      <Card className="fade-up-1" glow style={{ marginBottom: '1.5rem' }}>
        <Label>Job role</Label>
        <TextInput
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="e.g. Data Analyst, ML Engineer"
          style={{ marginBottom: '1.25rem' }}
        />

        {/* Quick role chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {roles.slice(0, 5).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: '0.25rem 0.65rem', borderRadius: 6, fontSize: '0.75rem',
                fontFamily: 'var(--font)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                background: role === r ? 'rgba(79,110,247,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${role === r ? 'rgba(79,110,247,0.35)' : 'var(--border)'}`,
                color: role === r ? 'var(--accent2)' : 'var(--muted)',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <Label>Experience level</Label>
        <Select value={level} onChange={e => setLevel(e.target.value)} options={levelOptions} style={{ marginBottom: '1.75rem' }} />

        <Button
          disabled={loading} onClick={handleStart}
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.92rem', letterSpacing: '0.03em' }}
        >
          {loading ? <><Spinner /> Generating question...</> : 'Start Interview →'}
        </Button>

        <ErrorMsg message={error} />
      </Card>

      {/* Stats row */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
        {[
          { n: '3', label: 'Questions' },
          { n: 'AI', label: 'Evaluated' },
          { n: '∞', label: 'Roles' },
        ].map(s => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '0.85rem',
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: 'var(--accent2)', marginBottom: '0.1rem' }}>{s.n}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}