import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import api from '../utils/api';
import Sidebar from '../components/portfolio/Sidebar';
import Platforms from '../components/portfolio/Platforms';
import {
  About,
  Experience,
  Achievements,
  TechStack,
  Projects,
  Blogs,
  Resume,
  Contact,
} from '../components/portfolio/Sections';

/* ── Loading screen ── */
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0d0d',
      gap: 16,
    }}>
      <div style={{ position: 'relative', width: 40, height: 40 }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '2px solid rgba(240,165,0,0.15)',
          borderTopColor: '#f0a500',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
      <p style={{
        fontFamily: '"Space Mono", monospace',
        fontSize: '9px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        color: 'rgba(255,255,255,0.3)',
      }}>
        Loading…
      </p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

export default function PortfolioPage() {
  const [profile,      setProfile]      = useState(null);
  const [experience,   setExperience]   = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects,     setProjects]     = useState([]);
  const [platforms,    setPlatforms]    = useState([]);
  const [blogs,        setBlogs]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get('/profile'),
      api.get('/experience'),
      api.get('/achievements'),
      api.get('/projects'),
      api.get('/platforms'),
      api.get('/blogs'),
    ]).then(([p, e, a, pr, pl, b]) => {
      if (p.status  === 'fulfilled') setProfile(p.value.data);
      if (e.status  === 'fulfilled') setExperience(e.value.data || []);
      if (a.status  === 'fulfilled') setAchievements(a.value.data || []);
      if (pr.status === 'fulfilled') setProjects(pr.value.data || []);
      if (pl.status === 'fulfilled') setPlatforms(pl.value.data || []);
      if (b.status  === 'fulfilled') setBlogs(b.value.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#f8f8f6' }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 140,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile?.avatar ? (
            <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(240,165,0,0.4)' }}>
              <img src={profile.avatar} alt={profile?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(240,165,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.85rem', color: '#f0a500' }}>
              {profile?.name?.charAt(0) || 'P'}
            </div>
          )}
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '13px', color: '#f5f5f5', letterSpacing: '0.02em' }}>
            {profile?.name || 'Portfolio'}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            padding: '6px 8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            cursor: 'pointer',
            color: '#f5f5f5',
            display: 'flex', alignItems: 'center',
          }}
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <Sidebar profile={profile} open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content — section order: About, Experience, Achievements, TechStack, Projects, Platforms, Blogs, Resume, Contact */}
      <main className="portfolio-main">
        <About        profile={profile} />
        <Experience   experience={experience} />
        <Achievements achievements={achievements} />
        <TechStack    profile={profile} />
        <Projects     projects={projects} />
        <Platforms    platforms={platforms} />
        <Blogs        blogs={blogs} />
        <Resume       profile={profile} />
        <Contact      profile={profile} />
      </main>
    </div>
  );
}