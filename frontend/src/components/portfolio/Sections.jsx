import { useState, useEffect } from 'react';
import {
  ExternalLink, Github, Download, Play, Trophy,
  ArrowUpRight, Send, CheckCircle, X, Award,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   GLOBAL STYLES  — original fonts restored
───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap');

  :root {
    --ink:          #1a1714;
    --ink-light:    #2e2a24;
    --ink-muted:    #6b6560;
    --ink-faint:    #a8a49f;
    --cream:        #f7f4ef;
    --cream-dark:   #e8e3d9;
    --gold:         #e8b84b;
    --gold-pale:    #fdf6e3;
    --gold-light:   #f0d080;
    --blue:         #2d5be3;
    --blue-light:   #e8eeff;
    --green:        #16a34a;
    --coral:        #e05c4b;
    --paper:        #fafaf5;
    --surface:      #f5f2ed;
    --border:       #e2ddd6;
    --border-strong:#ccc8c0;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── FULLSCREEN OVERLAY — FIXED, ALWAYS ON TOP ── */
  .fs-overlay {
    position: fixed !important;
    inset: 0 !important;
    z-index: 99999 !important;
    background: rgba(20,18,14,0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fsIn 0.2s ease;
  }
  @keyframes fsIn { from { opacity:0; } to { opacity:1; } }

  .fs-panel {
    position: relative;
    background: var(--paper);
    border: 1px solid var(--cream-dark);
    border-top: 3px solid var(--gold);
    max-width: 720px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: fsSlide 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 40px 100px rgba(0,0,0,0.45);
  }
  @keyframes fsSlide {
    from { transform: translateY(20px) scale(0.97); opacity:0; }
    to   { transform: translateY(0)    scale(1);    opacity:1; }
  }
  .fs-panel::-webkit-scrollbar { width:4px; }
  .fs-panel::-webkit-scrollbar-thumb { background: var(--gold); }

  .fs-close-bar {
    position: sticky; top:0; z-index:10;
    display: flex; justify-content: flex-end;
    padding: 10px 14px;
    background: var(--paper);
    border-bottom: 1px solid var(--cream-dark);
  }
  .fs-close-btn {
    display: flex; align-items: center; gap:5px;
    padding: 5px 14px;
    background: var(--ink); color: var(--gold);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    clip-path: polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%);
    transition: filter 0.15s;
  }
  .fs-close-btn:hover { filter: brightness(1.2); }

  /* ── TRAP BUTTON ── */
  .trap-btn {
    position: relative;
    display: inline-flex; align-items: center; gap:6px;
    padding: 8px 20px 8px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.13em;
    cursor: pointer; border: none; outline: none; text-decoration: none;
    transition: filter 0.18s, transform 0.15s;
    clip-path: polygon(0 0,calc(100% - 13px) 0,100% 50%,calc(100% - 13px) 100%,0 100%);
  }
  .trap-btn:hover  { filter: brightness(1.08); transform: translateY(-1px); }
  .trap-btn:active { transform: translateY(0); }
  .trap-btn-primary { background: var(--ink);  color: var(--gold); }
  .trap-btn-gold    { background: var(--gold); color: var(--ink);  }
  .trap-btn-outline {
    background: transparent; color: var(--ink);
    box-shadow: inset 0 0 0 1.5px var(--ink);
  }
  .trap-btn-ghost {
    background: rgba(232,184,75,0.1); color: var(--ink-muted);
    box-shadow: inset 0 0 0 1px rgba(232,184,75,0.35);
  }

  /* ── SECTION ── */
  .port-section {
    padding: 3rem 2.5rem;
    border-bottom: 1px solid var(--cream-dark);
    background: var(--paper);
    position: relative;
    overflow: hidden;
  }
  .port-section:nth-child(even) { background: var(--surface); }

  /* ── EYEBROW / TITLE ── */
  .section-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.22em;
    color: var(--gold); margin-bottom: 5px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem,3.5vw,2.6rem);
    font-weight: 700; color: var(--ink); line-height: 1;
    margin-bottom: 2rem;
  }

  /* ── BIG NUM decoration ── */
  .big-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5rem; color: rgba(0,0,0,0.03);
    line-height:1; pointer-events:none; user-select:none;
    position: absolute; top:-4px; right:8px;
  }

  /* ── CARD ── */
  .port-card {
    background: var(--paper);
    border: 1px solid var(--cream-dark);
    overflow: hidden; transition: all 0.2s; cursor: pointer;
  }
  .port-card:hover {
    border-color: var(--gold-light);
    box-shadow: 0 6px 24px rgba(0,0,0,0.09);
    transform: translateY(-2px);
  }

  /* ── CHIPS / TAGS ── */
  .chip {
    display: inline-flex; align-items: center; gap:3px;
    padding: 2px 8px;
    font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.09em;
    border: 1px solid var(--cream-dark); color: var(--ink-muted);
    background: var(--cream);
    clip-path: polygon(0 0,calc(100% - 7px) 0,100% 50%,calc(100% - 7px) 100%,0 100%);
  }
  .chip-gold { background: var(--gold-pale); border-color: var(--gold-light); color: var(--ink); }
  .chip-dark { background: var(--ink); border-color: var(--ink); color: var(--gold); }

  /* ── BADGES ── */
  .badge {
    display: inline-flex; align-items: center; gap:3px;
    padding: 2px 8px; border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .badge-live { background:#dcfce7; color:#166534; }
  .badge-wip  { background:#fef3c7; color:#92400e; }
  .badge-arch { background:#f3f4f6; color:#6b7280; }

  /* ── SKILL PILL ── */
  .skill-pill {
    display: inline-flex; align-items: center; gap:7px;
    padding: 7px 18px 7px 10px;
    background: var(--cream); border: 1px solid var(--cream-dark);
    border-left: 3px solid var(--gold-light);
    clip-path: polygon(0 0,calc(100% - 13px) 0,100% 50%,calc(100% - 13px) 100%,0 100%);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink);
    transition: all 0.18s; cursor: default;
  }
  .skill-pill:hover {
    background: var(--gold-pale); border-color: var(--gold-light);
    transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.07);
  }

  /* ── EXP CARD ── */
  .exp-card {
    border: 1px solid var(--cream-dark);
    padding: 1rem 1.25rem;
    background: var(--paper);
    cursor: pointer; transition: all 0.2s;
    border-left: 3px solid transparent;
  }
  .exp-card:hover {
    border-left-color: var(--gold);
    box-shadow: 0 2px 14px rgba(0,0,0,0.07);
    transform: translateX(3px);
  }

  /* ── ACH CARD ── */
  .ach-card {
    border: 1px solid var(--cream-dark);
    border-top: 2px solid transparent;
    padding: 1rem 1.2rem;
    background: var(--paper);
    cursor: pointer; transition: all 0.2s;
    display: flex; gap:12px; align-items: flex-start;
  }
  .ach-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.09);
  }

  /* ── INPUT ── */
  .port-input {
    width: 100%; padding: 9px 12px;
    border: 1px solid var(--cream-dark);
    border-bottom: 2px solid var(--gold-light);
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: var(--ink); outline: none; background: white;
    transition: border-color 0.15s;
  }
  .port-input:focus { border-color: var(--gold); }

  /* ── RESPONSIVE ── */
  @media (max-width:768px) {
    .two-col   { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr 1fr !important; }
    .port-section { padding: 2.5rem 1.25rem; }
    .fs-panel { max-height:95vh; }
    .hide-mobile { display:none !important; }
  }
  @media (max-width:480px) {
    .three-col { grid-template-columns: 1fr !important; }
    .port-section { padding: 2rem 1rem; }
    .section-title { font-size: 1.7rem !important; }
    .big-num { font-size: 3rem !important; }
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin  { to{transform:rotate(360deg)} }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = GLOBAL_STYLES;
  document.head.appendChild(el);
}

/* ─── HELPERS ─── */
function SectionHeader({ eyebrow, title, num }) {
  return (
    <div style={{ marginBottom: '2rem', position: 'relative' }}>
      {num && <span className="big-num">{num}</span>}
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title"><em>{title}</em></h2>
    </div>
  );
}

function Btn({ children, onClick, href, variant = 'primary', style = {}, download, target, rel }) {
  const cls = `trap-btn trap-btn-${variant}`;
  if (href) return <a href={href} className={cls} style={style} download={download} target={target} rel={rel}>{children}</a>;
  return <button className={cls} onClick={onClick} style={style}>{children}</button>;
}

function FSOverlay({ onClose, children }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fs-overlay" onClick={onClose}>
      <div className="fs-panel" onClick={e => e.stopPropagation()}>
        <div className="fs-close-bar">
          <button className="fs-close-btn" onClick={onClose}><X size={11} /> Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT — big image right, original style
═══════════════════════════════════════════ */
export function About({ profile }) {
  useEffect(() => { injectStyles(); }, []);
  if (!profile) return null;

  return (
    <section className="port-section" id="about">
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}
        className="two-col"
      >
        {/* LEFT */}
        <div>
          <div className="section-eyebrow">Introduction</div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 700,
            fontSize: 'clamp(2.8rem,6vw,5rem)',
            color: 'var(--ink)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '1.1rem',
          }}>
            {profile.name || 'Your Name'}
          </h1>

          {profile.title && (
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              color: 'var(--gold)', marginBottom: '1.5rem',
            }}>
              {profile.title}
            </p>
          )}

          {profile.bio && (
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              color: 'var(--ink-muted)', fontSize: '13px',
              lineHeight: 1.85, maxWidth: '44ch', marginBottom: '1.75rem',
            }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '2rem' }}>
            {[
              ['Location',  profile.location],
              ['Email',     profile.email],
              ['Education', profile.institution],
            ].map(([label, val]) => val ? (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '9px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: 'var(--ink-muted)', width: 72, flexShrink: 0,
                }}>
                  {label}
                </span>
                {label === 'Email'
                  ? <a href={`mailto:${val}`} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--blue)', textDecoration: 'none' }}>{val}</a>
                  : <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink)' }}>{val}</span>
                }
              </div>
            ) : null)}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {profile.email && <Btn href={`mailto:${profile.email}`} variant="primary"><Send size={11} /> Contact Me</Btn>}
            {profile.resume && <Btn href={profile.resume} target="_blank" rel="noopener noreferrer" variant="outline"><ExternalLink size={11} /> Resume</Btn>}
          </div>
        </div>

        {/* RIGHT — big photo with gold offset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-end' }}>
          {profile.avatar ? (
            <div style={{ position: 'relative' }}>
              {/* gold shadow block */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'var(--gold)',
                transform: 'translate(10px,10px)',
                opacity: 0.22,
                clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
              }} />
              <div style={{
                position: 'relative',
                width: 280, height: 340,
                overflow: 'hidden',
                border: '2px solid var(--ink)',
                clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
              }}>
                <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          ) : (
            <div style={{
              width: 280, height: 340,
              background: 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Cormorant Garamond",serif',
              fontSize: '5rem', color: 'var(--ink-faint)',
              border: '2px solid var(--ink)',
              clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
            }}>
              {profile.name?.charAt(0) || 'P'}
            </div>
          )}

          {/* Available badge */}
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--ink)', color: 'var(--gold)',
            padding: '8px 18px',
            fontFamily: '"DM Sans",sans-serif',
            fontSize: '10px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%)',
          }}>
            ✦ Available for hire
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════ */
export function Experience({ experience }) {
  const [selected, setSelected] = useState(null);
  if (!experience?.length) return null;

  return (
    <section className="port-section" id="experience">
      {selected && (
        <FSOverlay onClose={() => setSelected(null)}>
          <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--cream-dark)' }}>
              {selected.companyIcon && (
                <img src={selected.companyIcon} alt={selected.company} style={{ width: 42, height: 42, objectFit: 'contain', border: '1px solid var(--cream-dark)', padding: 4, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 3 }}>{selected.role}</h2>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: 6 }}>
                  {selected.link
                    ? <a href={selected.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', textDecoration: 'none' }}>{selected.company} ↗</a>
                    : selected.company}
                </p>
                {selected.duration && <span className="chip chip-gold">{selected.duration}</span>}
              </div>
            </div>

            {selected.description && (
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 8 }}>About the Role</p>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>{selected.description}</p>
              </div>
            )}

            {selected.points?.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 8 }}>Work</p>
                <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.points.map((pt, i) => (
                    <li key={i} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.techStack?.length > 0 && (
              <div>
                <p className="section-eyebrow" style={{ marginBottom: 8 }}>Tech Stack</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {selected.techStack.map((t, i) => (
                    <span key={i} className="chip chip-gold">
                      {t.icon && <img src={t.icon} alt={t.name} style={{ width: 12, height: 12 }} />}
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FSOverlay>
      )}

      <SectionHeader eyebrow="Work History" title="Experience" num="02" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 820 }}>
        {experience.map((exp) => (
          <div key={exp._id} className="exp-card" onClick={() => setSelected(exp)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {exp.companyIcon && (
                <img src={exp.companyIcon} alt={exp.company} style={{ width: 32, height: 32, objectFit: 'contain', border: '1px solid var(--cream-dark)', padding: 3, flexShrink: 0, marginTop: 2 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                  <div>
                    <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)' }}>{exp.role}</span>
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', marginLeft: 8 }}>{exp.company}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {exp.duration && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)' }}>{exp.duration}</span>}
                    <ArrowUpRight size={13} style={{ color: 'var(--gold)' }} />
                  </div>
                </div>

                {exp.description && (
                  <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 6 }}>{exp.description}</p>
                )}

                {exp.points?.length > 0 && (
                  <ul style={{ paddingLeft: '1rem', marginBottom: 6 }}>
                    {exp.points.slice(0, 2).map((pt, i) => (
                      <li key={i} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{pt}</li>
                    ))}
                    {exp.points.length > 2 && (
                      <li style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', color: 'var(--ink-faint)' }}>+{exp.points.length - 2} more — click to expand</li>
                    )}
                  </ul>
                )}

                {exp.techStack?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                    <span className="section-eyebrow" style={{ marginBottom: 0, marginRight: 4 }}>Stack —</span>
                    {exp.techStack.slice(0, 5).map((t, i) => (
                      <span key={i} className="chip">
                        {t.icon && <img src={t.icon} alt={t.name} style={{ width: 10, height: 10 }} />}
                        {t.name}
                      </span>
                    ))}
                    {exp.techStack.length > 5 && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-faint)' }}>+{exp.techStack.length - 5}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ACHIEVEMENTS — right after Experience
═══════════════════════════════════════════ */
export function Achievements({ achievements }) {
  const [selected, setSelected] = useState(null);
  if (!achievements?.length) return null;

  const TIERS = [
    { label: 'Legendary', color: '#f59e0b' },
    { label: 'Epic',      color: '#8b5cf6' },
    { label: 'Rare',      color: '#3b82f6' },
    { label: 'Common',    color: '#6b7280' },
  ];

  return (
    <section className="port-section" id="achievements">
      {selected && (
        <FSOverlay onClose={() => setSelected(null)}>
          <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem 0 1.25rem', borderBottom: '1px solid var(--cream-dark)', marginBottom: '1.25rem' }}>
              <div style={{ width: 60, height: 60, margin: '0 auto 12px', background: 'var(--gold-pale)', border: '2px solid var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
                {selected.icon
                  ? <img src={selected.icon} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                  : <Trophy size={26} style={{ color: 'var(--gold)' }} />}
              </div>
              <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 6 }}>{selected.title}</h2>
              {selected.date && <span className="chip chip-gold">{selected.date}</span>}
            </div>

            {selected.description && (
              <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderLeft: '3px solid var(--gold)' }}>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>{selected.description}</p>
              </div>
            )}

            {selected.link && <Btn href={selected.link} target="_blank" rel="noopener noreferrer" variant="gold"><ExternalLink size={10} /> View Credential</Btn>}
          </div>
        </FSOverlay>
      )}

      <SectionHeader eyebrow="Recognition" title="Achievements" num="03" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.65rem' }}>
        {achievements.map((item, i) => {
          const tier = TIERS[Math.min(i, TIERS.length - 1)];
          return (
            <div key={item._id} className="ach-card" onClick={() => setSelected(item)}
              style={{ borderTopColor: tier.color }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 20px ${tier.color}28`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              <div style={{ width: 40, height: 40, flexShrink: 0, background: tier.color + '18', border: `1.5px solid ${tier.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
                {item.icon
                  ? <img src={item.icon} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                  : <Award size={18} style={{ color: tier.color }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{item.title}</span>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '8px', fontWeight: 700, color: tier.color, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, marginLeft: 8 }}>{tier.label}</span>
                </div>
                {item.date && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', display: 'block', marginBottom: 4 }}>{item.date}</span>}
                {item.description && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{item.description?.slice(0, 90)}{item.description?.length > 90 ? '…' : ''}</p>}
                <div style={{ marginTop: 6, fontSize: '9px', color: 'var(--ink-faint)', fontFamily: '"DM Sans",sans-serif', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ArrowUpRight size={9} /> Click to expand
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TECH STACK
═══════════════════════════════════════════ */
export function TechStack({ profile }) {
  const skills = profile?.skills || [];
  if (!skills.length) return null;

  const CHIP_THEMES = [
    { bg: 'var(--gold-pale)',  border: 'var(--gold-light)' },
    { bg: '#e8eeff',           border: '#adc3f8' },
    { bg: '#d1fae5',           border: '#6ee7b7' },
    { bg: '#fce7f3',           border: '#f9a8d4' },
    { bg: '#ede9fe',           border: '#c4b5fd' },
    { bg: '#fee2e2',           border: '#fca5a5' },
    { bg: '#fef3c7',           border: '#fcd34d' },
    { bg: '#ecfeff',           border: '#67e8f9' },
  ];

  return (
    <section className="port-section" id="techstack">
      <SectionHeader eyebrow="Technical Skills" title="Tech Stack" num="04" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 900 }}>
        {skills.map((group, gi) => (
          <div key={gi}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>{group.category}</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--gold-light),transparent)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {group.items?.map((item, ii) => {
                const th = CHIP_THEMES[ii % CHIP_THEMES.length];
                return (
                  <div key={ii} className="skill-pill"
                    style={{ background: th.bg, borderColor: th.border, borderLeftColor: th.border }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    {item.icon
                      ? <img src={item.icon} alt={item.name} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                      : <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{item.name?.charAt(0)}</span>
                    }
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════ */
function ProjectCard({ project, idx, onClick }) {
  return (
    <div className="port-card" onClick={onClick}>
      {project.photos?.[0] && (
        <div style={{ height: 155, overflow: 'hidden', position: 'relative' }}>
          <img
            src={project.photos[0]} alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderTop: '40px solid var(--gold)', borderRight: '40px solid transparent', zIndex: 1 }} />
          <span style={{ position: 'absolute', top: 6, left: 7, fontFamily: '"Bebas Neue",sans-serif', fontSize: '12px', color: 'var(--ink)', zIndex: 2 }}>
            {String(idx + 1).padStart(2, '0')}
          </span>
        </div>
      )}
      <div style={{ padding: '0.9rem 1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', lineHeight: 1.15, margin: 0 }}>{project.title}</h3>
          <div style={{ flexShrink: 0 }}>
            {project.status === 'completed'   && <span className="badge badge-live">Completed</span>}
            {project.status === 'in-progress' && <span className="badge badge-wip">In Progress</span>}
            {project.status === 'archived'    && <span className="badge badge-arch">Archived</span>}
          </div>
        </div>

        {project.description && (
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 7 }}>
            {project.description?.length > 90 ? project.description.slice(0, 90) + '…' : project.description}
          </p>
        )}

        {(project.features?.length > 0 || project.points?.length > 0) && (
          <div style={{ marginBottom: 7 }}>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', marginBottom: 3 }}>Features</p>
            <ul style={{ paddingLeft: '1rem' }}>
              {(project.features || project.points || []).slice(0, 2).map((f, i) => (
                <li key={i} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {project.techStack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', marginRight: 4 }}>Stack:</span>
            {project.techStack.slice(0, 5).map((t, i) => (
              t.icon
                ? <img key={i} src={t.icon} alt={t.name} title={t.name} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                : <span key={i} className="chip" style={{ fontSize: '9px', padding: '1px 5px' }}>{t.name}</span>
            ))}
            {project.techStack.length > 5 && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-faint)' }}>+{project.techStack.length - 5}</span>}
          </div>
        )}

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="trap-btn trap-btn-outline" style={{ fontSize: '9px', padding: '5px 14px 5px 8px' }}>
              <Github size={10} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="trap-btn trap-btn-ghost" style={{ fontSize: '9px', padding: '5px 14px 5px 8px' }}>
              <ExternalLink size={10} /> Live
            </a>
          )}
          {project.playStoreUrl && (
            <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="trap-btn trap-btn-ghost" style={{ fontSize: '9px', padding: '5px 14px 5px 8px' }}>
              <Play size={10} /> Play Store
            </a>
          )}
          {project.customLinks?.slice(0, 1).map((cl, i) => (
            <a key={i} href={cl.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="trap-btn trap-btn-ghost" style={{ fontSize: '9px', padding: '5px 14px 5px 8px' }}>
              <ExternalLink size={10} /> {cl.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }) {
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  if (!projects?.length) return null;

  const topics = ['ALL', ...Array.from(new Set(projects.map(p => p.topic).filter(Boolean)))];
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.topic === filter);

  return (
    <section className="port-section" id="projects">
      {selected && (
        <FSOverlay onClose={() => setSelected(null)}>
          <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
            {selected.photos?.[0] && (
              <div style={{ height: 210, overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--cream-dark)' }}>
                <img src={selected.photos[0]} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 5 }}>{selected.title}</h2>
                {selected.status === 'completed'   && <span className="badge badge-live">● Completed</span>}
                {selected.status === 'in-progress' && <span className="badge badge-wip">● In Progress</span>}
                {selected.status === 'archived'    && <span className="badge badge-arch">Archived</span>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {selected.liveUrl   && <Btn href={selected.liveUrl}   target="_blank" rel="noopener noreferrer" variant="gold"><ExternalLink size={10} /> Live</Btn>}
                {selected.githubUrl && <Btn href={selected.githubUrl} target="_blank" rel="noopener noreferrer" variant="outline"><Github size={10} /> GitHub</Btn>}
              </div>
            </div>

            {selected.description && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Overview</p>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>{selected.description}</p>
              </div>
            )}

            {selected.features?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Features</p>
                <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selected.features.map((f, i) => (
                    <li key={i} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.points?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Key Points</p>
                <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selected.points.map((pt, i) => (
                    <li key={i} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.techStack?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Stack</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {selected.techStack.map((t, i) => (
                    <span key={i} className="chip chip-gold">
                      {t.icon && <img src={t.icon} alt={t.name} style={{ width: 12, height: 12 }} />}
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(selected.githubUrl || selected.playStoreUrl || selected.customLinks?.length) && (
              <div>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Links</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.githubUrl    && <Btn href={selected.githubUrl}    target="_blank" rel="noopener noreferrer" variant="outline"><Github size={10} /> GitHub</Btn>}
                  {selected.playStoreUrl && <Btn href={selected.playStoreUrl} target="_blank" rel="noopener noreferrer" variant="ghost"><Play size={10} /> Play Store</Btn>}
                  {selected.customLinks?.map((cl, i) => (
                    <Btn key={i} href={cl.url} target="_blank" rel="noopener noreferrer" variant="ghost"><ExternalLink size={10} /> {cl.label}</Btn>
                  ))}
                </div>
              </div>
            )}

            {selected.photos?.length > 1 && (
              <div style={{ marginTop: '1rem' }}>
                <p className="section-eyebrow" style={{ marginBottom: 6 }}>Gallery</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 6 }}>
                  {selected.photos.slice(1).map((ph, i) => (
                    <div key={i} style={{ height: 90, overflow: 'hidden', border: '1px solid var(--cream-dark)' }}>
                      <img src={ph} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FSOverlay>
      )}

      <SectionHeader eyebrow="Selected Works" title="Projects" num="05" />

      {topics.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1.5rem' }}>
          {topics.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`trap-btn ${filter === t ? 'trap-btn-primary' : 'trap-btn-outline'}`}
              style={{ fontSize: '10px', padding: '5px 16px 5px 10px' }}>
              {t}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '0.75rem' }}>
        {filtered.map((p, i) => (
          <ProjectCard key={p._id} project={p} idx={i} onClick={() => setSelected(p)} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   BLOGS
═══════════════════════════════════════════ */
export function Blogs({ blogs }) {
  const pub = blogs?.filter(b => b.published);
  if (!pub?.length) return null;

  return (
    <section className="port-section" id="blogs">
      <SectionHeader eyebrow="Writing" title="Blogs" num="07" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '0.65rem' }}>
        {pub.map((blog) => (
          <div key={blog._id} className="port-card" style={{ cursor: 'default' }}>
            {blog.coverImage && (
              <div style={{ height: 120, overflow: 'hidden' }}>
                <img src={blog.coverImage} alt={blog.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
            )}
            <div style={{ padding: '0.85rem 1rem' }}>
              {blog.topic && <span className="chip chip-gold" style={{ marginBottom: 6, display: 'inline-block' }}>{blog.topic}</span>}
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 5 }}>{blog.title}</h3>
              {blog.description && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 6 }}>{blog.description}</p>}
              {blog.publishedAt && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', marginBottom: 8 }}>{blog.publishedAt}</p>}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {blog.platforms?.map((pl, pi) => (
                  <a key={pi} href={pl.url} target="_blank" rel="noopener noreferrer"
                    className="trap-btn trap-btn-ghost" style={{ fontSize: '9px', padding: '4px 12px 4px 8px' }}>
                    {pl.icon && <img src={pl.icon} alt={pl.name} style={{ width: 10, height: 10 }} />} {pl.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   RESUME
═══════════════════════════════════════════ */
export function Resume({ profile }) {
  if (!profile?.resume) return null;
  return (
    <section className="port-section" id="resume">
      <SectionHeader eyebrow="Documents" title="Resume" num="08" />
      <div style={{ background: 'white', border: '1px solid var(--cream-dark)', borderLeft: '3px solid var(--gold)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, maxWidth: 620 }}>
        <div>
          <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--ink)', marginBottom: 3 }}>Curriculum Vitae</h3>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink-muted)' }}>Download or view the complete résumé document.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn href={profile.resume} target="_blank" rel="noopener noreferrer" variant="outline"><Play size={11} /> View</Btn>
          <Btn href={profile.resume} download variant="gold"><Download size={11} /> Download</Btn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════ */
export function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + (profile?.email || 'example@example.com'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Portfolio Contact from ${form.name}` }),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else throw new Error('Failed');
    } catch {
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
      window.location.href = `mailto:${profile?.email || ''}?subject=Portfolio Contact&body=${body}`;
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <section className="port-section" id="contact">
      <SectionHeader eyebrow="Get In Touch" title="Contact" num="09" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3.5rem', alignItems: 'start', maxWidth: 900 }} className="two-col">
        <div>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '28ch' }}>
            "Open to collaborations, projects, and interesting conversations."
          </p>
          {profile?.email && (
            <div style={{ marginBottom: '1rem' }}>
              <p className="section-eyebrow" style={{ marginBottom: 5 }}>Email</p>
              <a href={`mailto:${profile.email}`} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>{profile.email}</a>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--green)' }}>Available for work</span>
          </div>
        </div>

        {status === 'success' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '2.5rem', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)' }}>
            <CheckCircle size={40} style={{ color: '#22c55e' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>Message Sent!</p>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '12px', color: 'var(--ink-muted)' }}>I'll get back to you soon.</p>
            </div>
            <Btn onClick={() => setStatus('idle')} variant="outline">Send another</Btn>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="two-col">
              {[['Name','text','Your name','name'],['Email','email','your@email.com','email']].map(([label,type,ph,key]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: 5 }}>{label}</label>
                  <input type={type} className="port-input" placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: '"DM Sans",sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: 5 }}>Message</label>
              <textarea className="port-input" placeholder="Tell me about your project…" rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'vertical' }} required />
            </div>
            <Btn onClick={null} variant="primary"
              style={{ alignSelf: 'flex-start', opacity: status === 'sending' ? 0.6 : 1, pointerEvents: status === 'sending' ? 'none' : 'auto' }}>
              {status === 'sending'
                ? <><div style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Sending…</>
                : <><Send size={11} /> Send Message</>}
            </Btn>
          </form>
        )}
      </div>

      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>
          {profile?.name || 'Portfolio'} © {new Date().getFullYear()}
        </span>
        <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--ink-faint)' }}>
          Crafted with care ✦
        </span>
      </div>
    </section>
  );
}