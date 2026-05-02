import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

function GitHubHeatmap({ username }) {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(data => {
        if (data?.contributions) {
          const all = data.contributions;
          const w = [];
          for (let i = 0; i < all.length; i += 7) w.push(all.slice(i, i + 7));
          setWeeks(w.slice(-53));
          setTotal(all.reduce((s, d) => s + d.count, 0));
        }
      }).catch(() => {});
  }, [username]);

  const getClass = c => {
    if (!c) return 'heatmap-0';
    if (c < 3) return 'heatmap-1';
    if (c < 6) return 'heatmap-2';
    if (c < 10) return 'heatmap-3';
    return 'heatmap-4';
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    if (week[0]) {
      const m = new Date(week[0].date).getMonth();
      if (m !== lastMonth) { monthLabels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
    }
  });

  if (!weeks.length) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-muted)', marginBottom: 8 }}>
        <strong style={{ color: 'var(--ink)' }}>{total}</strong> contributions last year
      </p>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ position: 'relative', height: 16, marginBottom: 4 }}>
          {monthLabels.map(({ wi, label }) => (
            <span key={wi} style={{ position: 'absolute', left: wi * 13, fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>{label}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, width: 'fit-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {week.map((day, di) => (
                <div key={di} className={getClass(day.count)}
                  title={`${day.date}: ${day.count}`}
                  style={{ width: 11, height: 11, cursor: 'default', transition: 'transform 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.4)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6, justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-faint)' }}>Less</span>
          {[0,1,3,6,10].map((v,i) => <div key={i} className={getClass(v)} style={{ width: 10, height: 10 }} />)}
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-faint)' }}>More</span>
        </div>
      </div>
    </div>
  );
}

function GitHubStats({ username }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(`https://api.github.com/users/${username}`).then(r=>r.json()).then(setData).catch(()=>{}); }, [username]);
  if (!data) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {[['public_repos','Repos'],['followers','Followers'],['following','Following']].map(([key,label]) => (
        <div key={key} style={{ padding: '8px 18px', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', textAlign: 'center', minWidth: 80 }}>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.4rem', color: 'var(--ink)', lineHeight: 1 }}>{data[key]}</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '9px', color: 'var(--ink-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function LeetCodeStats({ username }) {
  const [profile, setProfile] = useState(null);
  const [solved, setSolved] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      fetch(`https://alfa-leetcode-api.onrender.com/${username}`).then(r=>r.json()),
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`).then(r=>r.json()),
    ]).then(([p,s]) => {
      if (p.status==='fulfilled' && p.value?.username) setProfile(p.value);
      if (s.status==='fulfilled' && s.value?.solvedProblem !== undefined) setSolved(s.value);
    });
  }, [username]);

  if (!solved) return null;

  const total = solved.solvedProblem ?? 0;
  const easy  = solved.easySolved ?? 0;
  const med   = solved.mediumSolved ?? 0;
  const hard  = solved.hardSolved ?? 0;
  const tE = solved.totalEasy ?? 800;
  const tM = solved.totalMedium ?? 1600;
  const tH = solved.totalHard ?? 700;
  const tAll = tE + tM + tH;
  const R = 38, C = 2 * Math.PI * R;
  const pct = tAll > 0 ? total / tAll : 0;

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
      {/* Arc */}
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        <svg viewBox="0 0 96 96" style={{ width: 96, height: 96, transform: 'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r={R} fill="none" stroke="var(--cream-dark)" strokeWidth="6" />
          <circle cx="48" cy="48" r={R} fill="none" stroke="var(--gold)" strokeWidth="6"
            strokeDasharray={`${C * pct} ${C * (1-pct)}`} strokeLinecap="butt" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: 700, fontFamily: '"DM Sans",sans-serif' }}>SOLVED</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['Easy', easy, tE,'#22c55e'], ['Medium', med, tM, 'var(--gold)'], ['Hard', hard, tH, 'var(--coral)']].map(([label,s,t,col]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--cream)', borderLeft: `3px solid ${col}` }}>
            <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '10px', fontWeight: 700, color: col, width: 50 }}>{label}</span>
            <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1rem', color: col }}>{s}</span>
            <span style={{ fontSize: '9px', color: 'var(--ink-faint)', fontFamily: '"DM Sans"' }}>/{t}</span>
            <div style={{ flex: 1, height: 3, background: 'var(--cream-dark)' }}>
              <div style={{ width: `${t>0?(s/t)*100:0}%`, height: '100%', background: col }} />
            </div>
          </div>
        ))}
      </div>

      {profile?.ranking > 0 && (
        <div style={{ padding: '8px 16px', background: 'var(--blue-light)', border: '1px solid #c8d6f8', textAlign: 'center' }}>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--blue)' }}>#{profile.ranking.toLocaleString()}</p>
          <p style={{ fontSize: '9px', color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans"' }}>Global Rank</p>
        </div>
      )}
    </div>
  );
}

function CodeforcesStats({ username }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(`https://codeforces.com/api/user.info?handles=${username}`)
      .then(r=>r.json()).then(d => { if (d.status==='OK'&&d.result?.[0]) setData(d.result[0]); }).catch(()=>{});
  }, [username]);
  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {data.rating && (
        <div style={{ padding: '8px 16px', background: 'var(--blue-light)', border: '1px solid #c8d6f8', textAlign: 'center' }}>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--blue)' }}>{data.rating}</p>
          <p style={{ fontSize: '9px', color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans"' }}>Rating</p>
        </div>
      )}
      {data.rank && (
        <div style={{ padding: '8px 16px', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', textAlign: 'center' }}>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', textTransform: 'capitalize' }}>{data.rank}</p>
          <p style={{ fontSize: '9px', color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans"' }}>Rank</p>
        </div>
      )}
    </div>
  );
}

export default function Platforms({ platforms }) {
  if (!platforms?.length) return null;

  return (
    <section id="platforms" className="section">
      <div className="section-eyebrow">Online Presence</div>
      <h2 className="section-title"><em>Platforms</em></h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {platforms.map(p => {
          const n = p.name?.toLowerCase();
          return (
            <div key={p._id} style={{ background: 'white', border: '1px solid var(--cream-dark)', borderTop: '3px solid var(--gold)', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {p.icon
                    ? <img src={p.icon} alt={p.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                    : <div style={{ width: 24, height: 24, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem' }}>{p.name?.charAt(0)}</div>
                  }
                  <div>
                    <span style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>{p.name}</span>
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '11px', color: 'var(--ink-muted)', marginLeft: 8 }}>@{p.username}</span>
                  </div>
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '10px', padding: '4px 12px' }}>
                  <ExternalLink size={11} /> Visit
                </a>
              </div>

              {n === 'github' && p.showStats && <GitHubStats username={p.username} />}
              {n === 'github' && p.showHeatmap && <GitHubHeatmap username={p.username} />}
              {n === 'leetcode' && <LeetCodeStats username={p.username} />}
              {n === 'codeforces' && <CodeforcesStats username={p.username} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
