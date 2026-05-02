import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const NAV = [
  { id: 'about',        label: 'About',        num: '01' },
  { id: 'experience',   label: 'Experience',   num: '02' },
  { id: 'achievements', label: 'Achievements', num: '03' },
  { id: 'techstack',    label: 'Tech Stack',   num: '04' },
  { id: 'projects',     label: 'Projects',     num: '05' },
  { id: 'platforms',    label: 'Platforms',    num: '06' },
  { id: 'blogs',        label: 'Blogs',        num: '07' },
  { id: 'resume',       label: 'Resume',       num: '08' },
  { id: 'contact',      label: 'Contact',      num: '09' },
];

const SOCIAL_ICONS = {
  github: {
    label: 'GitHub',
    svg: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  leetcode: {
    label: 'LeetCode',
    svg: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
  twitter: {
    label: 'Twitter',
    svg: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  discord: {
    label: 'Discord',
    svg: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.119 18.1.141 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
};

const SIDEBAR_W = 280;

const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  .portfolio-sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: ${SIDEBAR_W}px;
    background: #0d0d0d;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow-y: auto;
    z-index: 100;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    border-right: 1px solid #1f1f1f;
  }
  .portfolio-sidebar::-webkit-scrollbar { width: 3px; }
  .portfolio-sidebar::-webkit-scrollbar-thumb { background: rgba(240,165,0,0.25); }

  .sidebar-top {
    padding: 1.5rem 1.5rem 1.25rem;
    border-bottom: 1px solid #1a1a1a;
  }

  .sidebar-nav {
    flex: 1;
    padding: 0.75rem 0;
  }

  .sidebar-bottom {
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid #1a1a1a;
  }

  .portfolio-main {
    margin-left: ${SIDEBAR_W}px;
    min-height: 100vh;
    background: #f8f8f6;
  }

  /* Nav link */
  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 7px 1.5rem;
    background: transparent;
    border: none;
    border-left: 2px solid transparent;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.38);
    transition: all 0.15s;
    text-align: left;
    letter-spacing: 0.01em;
  }
  .nav-link:hover {
    color: rgba(255,255,255,0.75);
    background: rgba(255,255,255,0.04);
    border-left-color: rgba(240,165,0,0.4);
  }
  .nav-link.active {
    color: #f0a500;
    background: rgba(240,165,0,0.07);
    border-left-color: #f0a500;
    font-weight: 600;
  }
  .nav-num {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: rgba(255,255,255,0.18);
    letter-spacing: 0.05em;
    flex-shrink: 0;
    transition: color 0.15s;
    width: 22px;
  }
  .nav-link:hover .nav-num { color: rgba(240,165,0,0.5); }
  .nav-link.active .nav-num { color: #f0a500; }

  /* Section label */
  .sidebar-label {
    font-family: 'Space Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.2);
    padding: 0 1.5rem;
    margin-bottom: 4px;
    margin-top: 2px;
  }

  /* Social links */
  .social-row {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 0.85rem;
  }
  .social-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 2px;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.35);
    text-decoration: none;
    transition: all 0.15s;
  }
  .social-pill:hover {
    color: #f0a500;
    border-color: rgba(240,165,0,0.3);
    background: rgba(240,165,0,0.07);
  }

  /* Resume btn in sidebar */
  .sidebar-resume-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 7px 12px;
    background: rgba(240,165,0,0.1);
    border: 1px solid rgba(240,165,0,0.2);
    border-radius: 2px;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #f0a500;
    text-decoration: none;
    transition: background 0.15s;
    margin-bottom: 8px;
  }
  .sidebar-resume-btn:hover { background: rgba(240,165,0,0.18); }

  .sidebar-admin-link {
    font-size: 9px;
    color: rgba(255,255,255,0.15);
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.15s;
  }
  .sidebar-admin-link:hover { color: rgba(255,255,255,0.4); }

  /* Mobile topbar */
  @media (max-width: 768px) {

  .portfolio-sidebar {
    transform: translateX(-100%);
    width: 85%;
    max-width: 300px;
    z-index: 999;
    box-shadow: 8px 0 30px rgba(0,0,0,0.6);
  }

  .portfolio-sidebar.open {
    transform: translateX(0);
  }

  .portfolio-main {
    margin-left: 0;
    padding-top: 0; /* REMOVE TOP SPACE */
  }

  /* Overlay background */
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 998;
  }
}
`;

let sidebarStylesInjected = false;

export default function Sidebar({ profile, open, setOpen }) {
  const [active, setActive] = useState('about');

  useEffect(() => {
    if (!sidebarStylesInjected) {
      sidebarStylesInjected = true;
      const el = document.createElement('style');
      el.textContent = SIDEBAR_STYLES;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const v = entries.find(e => e.isIntersecting);
        if (v) setActive(v.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    
    <aside className={`portfolio-sidebar${open ? ' open' : ''}`}>
      {/* Top: Avatar + Info */}
      
      <div className="sidebar-top">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          {profile?.avatar ? (
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(240,165,0,0.35)', flexShrink: 0 }}>
              <img src={profile.avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(240,165,0,0.15)', border: '2px solid rgba(240,165,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#f0a500', flexShrink: 0 }}>
              {profile?.name?.charAt(0) || 'P'}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '14px', color: '#f5f5f5', lineHeight: 1.15, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.name || 'Portfolio'}
            </h2>
            {profile?.title && (
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f0a500', opacity: 0.85 }}>
                {profile.title}
              </p>
            )}
          </div>
        </div>

        {profile?.location && (
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>◎ {profile.location}</p>
        )}
        {profile?.email && (
          <a href={`mailto:${profile.email}`} style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', wordBreak: 'break-all', transition: 'color 0.15s', display: 'block' }}
            onMouseOver={e => e.currentTarget.style.color = '#f0a500'}
            onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
            {profile.email}
          </a>
        )}

        {/* Bio snippet */}
        {profile?.bio && (
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-label">Navigation</div>
        {NAV.map(({ id, label, num }) => (
          <button key={id} onClick={() => go(id)} className={`nav-link${active === id ? ' active' : ''}`}>
            <span className="nav-num">{num}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom: Socials + Resume + Admin */}
      <div className="sidebar-bottom">
        {/* Socials */}
        {profile?.socials && (
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>
              Links
            </div>
            <div className="social-row">
              {Object.entries(profile.socials).filter(([, v]) => v).map(([key, url]) => {
                const s = SOCIAL_ICONS[key];
                if (!s) return null;
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="social-pill">
                    {s.svg} {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Resume */}
        {profile?.resume && (
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="sidebar-resume-btn" style={{ marginTop: '1rem' }}>
            <ExternalLink size={10} /> View Resume
          </a>
        )}

        <a href="/admin/login" className="sidebar-admin-link">→ Admin</a>
      </div>
    </aside>
  );
}