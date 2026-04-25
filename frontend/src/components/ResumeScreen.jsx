import React, { useState, useRef } from 'react';
import { Button, Card, Label, Tag, ErrorMsg, Spinner } from './UI';
import { uploadResume, generateLeetcode } from '../api';

export default function ResumeScreen({ onBack }) {
  const [file, setFile]           = useState(null);
  const [mode, setMode]           = useState('interview'); // 'interview' | 'leetcode'
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef();

  function handleFileDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (f?.type === 'application/pdf') setFile(f);
    else setError('Please upload a PDF file.');
  }

  async function handleAnalyze() {
    if (!file) { setError('Please upload a PDF resume.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const data = mode === 'interview'
        ? await uploadResume(file)
        : await generateLeetcode(file);
      setResult(data);
    } catch (e) {
      setError(`Backend error: ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: '2.4rem', fontWeight: 400, lineHeight: 1.15,
          marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #e8eaf2 30%, var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Resume Analysis
        </h1>
        <p style={{ color: 'var(--muted)' }}>Upload your resume to get personalized questions</p>
      </div>

      <Card>
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['interview', 'leetcode'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '0.55rem', borderRadius: 9, fontSize: '0.88rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                background: mode === m ? 'var(--accent)' : 'transparent',
                borderColor: mode === m ? 'var(--accent)' : 'var(--border)',
                color: mode === m ? '#fff' : 'var(--muted)',
              }}
            >
              {m === 'interview' ? 'Interview Questions' : 'Leetcode Questions'}
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current.click()}
          onDrop={handleFileDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            border: `1.5px dashed ${file ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 10, padding: '2rem', textAlign: 'center',
            cursor: 'pointer', marginBottom: '1.25rem', transition: 'border 0.2s',
            background: file ? 'rgba(108,127,255,0.05)' : 'transparent',
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileDrop} />
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</div>
          {file
            ? <div style={{ color: 'var(--accent2)', fontWeight: 500 }}>{file.name}</div>
            : <>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Drop your PDF here</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>or click to browse</div>
              </>
          }
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button disabled={loading || !file} onClick={handleAnalyze}>
            {loading ? <><Spinner size={16} /> Analyzing...</> : 'Analyze Resume →'}
          </Button>
          <Button variant="outline" onClick={onBack}>← Back</Button>
        </div>

        <ErrorMsg message={error} />
      </Card>

      {/* Results */}
      {result && (
        <div className="fade-up" style={{ marginTop: '1.25rem' }}>
          {/* Skills */}
          {result.skills_detected && (
            <Card style={{ marginBottom: '1rem' }}>
              <Label>Skills detected</Label>
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
              <Label>Interview questions</Label>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
                {(Array.isArray(result.questions) ? result.questions : [result.questions]).map((q, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', lineHeight: 1.6, fontSize: '0.95rem' }}>{q}</li>
                ))}
              </ol>
            </Card>
          )}

          {/* Leetcode questions */}
          {(result.easy_questions || result.medium_questions || result.hard_questions) && (
            <Card>
              {[
                { key: 'easy_questions',   label: 'Easy',   color: 'success' },
                { key: 'medium_questions', label: 'Medium', color: 'gold' },
                { key: 'hard_questions',   label: 'Hard',   color: 'accent' },
              ].map(({ key, label, color }) => result[key] && (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <Tag color={color}>{label}</Tag>
                  <ol style={{ paddingLeft: '1.25rem', marginTop: '0.6rem' }}>
                    {(Array.isArray(result[key]) ? result[key] : [result[key]]).map((q, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>{q}</li>
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