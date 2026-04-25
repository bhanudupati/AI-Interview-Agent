import React from 'react';

export function Button({ children, variant = 'primary', disabled, onClick, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '0.7rem 1.6rem', borderRadius: '10px',
    fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.02em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    border: 'none', opacity: disabled ? 0.4 : 1, position: 'relative', overflow: 'hidden',
  };
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #4f6ef7 0%, #6366f1 100%)',
      color: '#fff',
      boxShadow: '0 2px 16px rgba(79,110,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    outline: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border2)',
      color: 'var(--text2)',
      backdropFilter: 'blur(8px)',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid transparent',
      color: 'var(--muted)',
    },
  };
  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={e => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'outline') { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.color = 'var(--text)'; }
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        if (variant === 'outline') { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }
      }}
    >
      {children}
    </button>
  );
}

export function Spinner({ size = 18 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: '2px solid rgba(255,255,255,0.15)',
      borderTopColor: 'rgba(255,255,255,0.8)',
      borderRadius: '50%', animation: 'spin 0.65s linear infinite', flexShrink: 0,
    }} />
  );
}

export function Card({ children, style, glow }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, var(--card) 0%, var(--card2) 100%)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '2rem',
      boxShadow: glow
        ? '0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(79,110,247,0.1), inset 0 1px 0 rgba(255,255,255,0.03)'
        : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Label({ children, style }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 600, color: 'var(--muted)',
      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Tag({ children, color = 'accent' }) {
  const colors = {
    accent:  { bg: 'rgba(79,110,247,0.1)',  text: '#818cf8', border: 'rgba(79,110,247,0.2)' },
    gold:    { bg: 'rgba(232,184,75,0.1)',  text: '#e8b84b', border: 'rgba(232,184,75,0.2)' },
    success: { bg: 'rgba(52,211,153,0.1)',  text: '#34d399', border: 'rgba(52,211,153,0.2)' },
    muted:   { bg: 'rgba(255,255,255,0.04)', text: 'var(--text2)', border: 'var(--border)' },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.22rem 0.7rem', borderRadius: '20px',
      fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.02em',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      marginRight: '0.4rem',
    }}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 3 }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, marginBottom: '2rem', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
        borderRadius: 2, transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 0 8px rgba(79,110,247,0.5)',
      }} />
    </div>
  );
}

export function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
      padding: '0.75rem 1rem', borderRadius: 8, marginTop: '1rem',
      background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
      color: 'var(--danger)', fontSize: '0.85rem', lineHeight: 1.5,
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>
      <span>{message}</span>
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, style }) {
  return (
    <input
      type="text" value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.95rem',
        outline: 'none', transition: 'all 0.2s', letterSpacing: '0.01em', ...style,
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,110,247,0.12)'; e.target.style.background = 'rgba(79,110,247,0.04)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
    />
  );
}

export function Select({ value, onChange, options, style }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{
        width: '100%', padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.95rem',
        outline: 'none', cursor: 'pointer', ...style,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: '#12151e' }}>{o.label}</option>)}
    </select>
  );
}

export function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder}
      style={{
        width: '100%', minHeight: '140px', padding: '0.85rem 1rem',
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem',
        resize: 'vertical', outline: 'none', lineHeight: 1.7, transition: 'all 0.2s',
        letterSpacing: '0.01em',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,110,247,0.12)'; e.target.style.background = 'rgba(79,110,247,0.03)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
    />
  );
}

export function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '1.5rem 0' }} />;
}