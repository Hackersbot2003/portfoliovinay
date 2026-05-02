import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, ArrowUpRight } from 'lucide-react';

function Carousel({ photos }) {
  const [idx, setIdx] = useState(0);
  const n = photos.length;
  const prev = useCallback(() => setIdx(i => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIdx(i => (i + 1) % n), [n]);

  useEffect(() => {
    const h = e => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prev, next]);

  if (!n) return null;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
      <div className="carousel-track" style={{ transform: `translateX(-${idx * 100}%)`, height: '100%' }}>
        {photos.map((src, i) => (
          <div key={i} className="carousel-slide" style={{ height: '100%' }}>
            <img src={src} alt={`screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(247,244,239,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--gold)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(247,244,239,0.9)'}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(247,244,239,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', transition: 'background 0.15s' }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--gold)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(247,244,239,0.9)'}>
            <ChevronRight size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(26,23,20,0.7)', padding: '4px 10px', fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'rgba(247,244,239,0.8)', fontWeight: 600 }}>
            {idx + 1} / {n}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h); };
  }, [onClose]);

  if (!project) return null;

  const StatusBadge = () => {
    if (project.status === 'completed') return <span className="badge-live">Live</span>;
    if (project.status === 'in-progress') return <span className="badge-wip">In Progress</span>;
    return <span className="badge-archived">Archived</span>;
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel">
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'white', borderBottom: '1px solid var(--cream-dark)' }}>
          <div style={{ display: 'flex', align: 'center', gap: 8 }}>
            {project.topic && (
              <span className="tag tag-gold">{project.topic}</span>
            )}
            <StatusBadge />
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'var(--cream)', border: '1px solid var(--cream-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)', transition: 'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}>
            <X size={14} />
          </button>
        </div>

        {/* Carousel */}
        {project.photos?.length > 0 && <Carousel photos={project.photos} />}

        {/* Body */}
        <div style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {project.title}
            </h2>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--ink-light)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{project.description}</p>

          {/* Features */}
          {project.features?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: 10 }}>Key Features</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {project.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: '13px', padding: '8px 12px', background: 'var(--cream)', borderLeft: '2px solid var(--gold)' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>→</span>
                    <span style={{ color: 'var(--ink-light)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: 10 }}>Tech Stack</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.techStack.map((t, i) => (
                  <span key={i} className="tag tag-outline">
                    {t.icon && <img src={t.icon} alt={t.name} style={{ width: 12, height: 12 }} />}
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: '1.25rem', borderTop: '1px solid var(--cream-dark)' }}>
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '11px', padding: '8px 18px' }}>
                <Github size={13} /> Source Code
              </a>
            )}
            {project.deployedLink && (
              <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '11px', padding: '8px 18px' }}>
                <ArrowUpRight size={13} /> Live Demo
              </a>
            )}
            {project.extraLinks?.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '11px', padding: '8px 18px' }}>
                <ExternalLink size={13} /> {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-muted)' }}>
            {project.title}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--ink-faint)' }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
