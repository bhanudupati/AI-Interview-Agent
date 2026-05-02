import React, { useState, useRef } from 'react';
import { Button, Card, Label, Tag, ErrorMsg, Spinner } from './UI';
import { uploadResume, generateLeetcode } from '../api';

export default function ResumeScreen({ onBack }) {
  const [file, setFile]       = useState(null);
  const [mode, setMode]       = useState('interview');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const fileRef = useRef();

  function handleFile(f) {
    if (f?.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please upload a PDF file.');
  }

  async function handleAnalyze() {
    if (!file) { setError('Please upload a PDF resume first.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = mode === 'interview' ? await uploadResume(file) : await generateLeetcode(file);
      setResult(data);
    } catch (e) {
      setError(`Backend error: ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 0' }}>
      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 400,
          lineHeight: 1.15, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, var(--text) 30%, var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Resume Analysis
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.92rem' }}>
          Upload your resume to get personalized questions
        </p>
      </div>

      <Card className="fade-up-1" glow style={{ marginBottom: '1.25rem' }}>
        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: '0.4rem', marginBottom: '1.5rem',
          padding: '0.3rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10,
          border: '1px solid var(--border)',
        }}>
          {['interview', 'leetcode'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '0.55rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'var(--font)', border: 'none',
              background: mode === m ? 'linear-gradient(135deg, #4f6ef7, #6366f1)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--muted)',
              boxShadow: mode === m ? '0 2px 8px rgba(79,110,247,0.3)' : 'none',
            }}>
              {m === 'interview' ? '🎯 Interview Questions' : '⚡ Leetcode Questions'}
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer?.files?.[0]); }}
          onDragOver={e => e.preventDefault()}
          style={{
            border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border2)'}`,
            borderRadius: 12, padding: '2.5rem', textAlign: 'center',
            cursor: 'pointer', marginBottom: '1.25rem', transition: 'all 0.2s',
            background: file ? 'rgba(79,110,247,0.04)' : 'rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => !file && (e.currentTarget.style.borderColor = 'var(--border2)', e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
          onMouseLeave={e => !file && (e.currentTarget.style.borderColor = 'var(--border2)', e.currentTarget.style.background = 'rgba(0,0,0,0.15)')}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files?.[0])} />
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{file ? '📄' : '⬆️'}</div>
          {file
            ? <div style={{ color: 'var(--accent2)', fontWeight: 500, fontSize: '0.9rem' }}>{file.name}</div>
            : <>
                <div style={{ fontWeight: 500, marginBottom: '0.3rem', color: 'var(--text)' }}>Drop your PDF resume here</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>or click to browse files</div>
              </>
          }
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button disabled={loading || !file} onClick={handleAnalyze} style={{ flex: 1, padding: '0.8rem' }}>
            {loading ? <><Spinner /> Analyzing...</> : 'Analyze Resume →'}
          </Button>
          <Button variant="outline" onClick={onBack}>← Back</Button>
        </div>

        <ErrorMsg message={error} />
      </Card>

      {/* Results */}
      {result && (
        <div className="fade-up">
          {/* Skills */}
          {result.skills_detected && (
            <Card style={{ marginBottom: '1rem' }}>
              <Label>Skills Detected</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {(Array.isArray(result.skills_detected)
                  ? result.skills_detected
                  : result.skills_detected.split(',')
                ).map((s, i) => <Tag key={i} color="accent">{s.trim()}</Tag>)}
              </div>
            </Card>
          )}

          {/* Interview questions */}
          {result.questions && (
            <Card>
              <Label>Interview Questions</Label>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
                {(Array.isArray(result.questions) ? result.questions : [result.questions]).map((q, i) => (
                  <li key={i} style={{
                    marginBottom: '0.9rem', lineHeight: 1.65, fontSize: '0.92rem',
                    color: 'var(--text2)', paddingLeft: '0.25rem',
                  }}>{q}</li>
                ))}
              </ol>
            </Card>
          )}

          {/* Leetcode */}
          {(result.easy_questions || result.medium_questions || result.hard_questions) && (
            <Card>
              {[
                { key: 'easy_questions',   label: 'Easy',   color: 'success' },
                { key: 'medium_questions', label: 'Medium', color: 'gold' },
                { key: 'hard_questions',   label: 'Hard',   color: 'accent' },
              ].filter(({ key }) => result[key]).map(({ key, label, color }) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ marginBottom: '0.6rem' }}><Tag color={color}>{label}</Tag></div>
                  <ol style={{ paddingLeft: '1.25rem' }}>
                    {(Array.isArray(result[key]) ? result[key] : [result[key]]).map((q, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>{q}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}