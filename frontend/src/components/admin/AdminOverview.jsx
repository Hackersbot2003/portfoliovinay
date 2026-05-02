import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { AdminShell } from './FormHelpers';
import { FolderOpen, Briefcase, BookOpen, Globe, Trophy, User } from 'lucide-react';

export default function AdminOverview() {
  const [counts, setCounts] = useState({ projects:0, experience:0, blogs:0, platforms:0, achievements:0 });
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      api.get('/projects'), api.get('/experience'), api.get('/blogs?all=true'),
      api.get('/platforms'), api.get('/achievements'),
    ]).then(([pr,e,b,pl,a]) => {
      const pData = pr.status==='fulfilled' ? pr.value.data : [];
      const eData = e.status==='fulfilled' ? e.value.data : [];
      const bData = b.status==='fulfilled' ? b.value.data : [];
      const plData = pl.status==='fulfilled' ? pl.value.data : [];
      const aData = a.status==='fulfilled' ? a.value.data : [];
      setCounts({ projects:pData.length, experience:eData.length, blogs:bData.length, platforms:plData.length, achievements:aData.length });
      setProjects(pData.slice(0,4));
      setBlogs(bData.slice(0,3));
    });
  }, []);

  const stats = [
    { label:'PROJECTS', value:counts.projects, icon:FolderOpen, color:'#ff6b00' },
    { label:'EXPERIENCE', value:counts.experience, icon:Briefcase, color:'#191c1d' },
    { label:'BLOGS', value:counts.blogs, icon:BookOpen, color:'#586062' },
    { label:'PLATFORMS', value:counts.platforms, icon:Globe, color:'#191c1d' },
    { label:'ACHIEVEMENTS', value:counts.achievements, icon:Trophy, color:'#ff6b00' },
  ];

  return (
    <AdminShell title="ADMIN_DASHBOARD" subtitle="SYSTEM_OVERVIEW_MODULE">
      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:4, marginBottom:28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:`4px solid ${s.color}`, padding:'16px 20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:8, right:8, opacity:0.06 }}>
              <s.icon size={48} />
            </div>
            <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>{s.label}</p>
            <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'2.2rem', color:'#191c1d', lineHeight:1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Projects */}
        <div style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderTop:'3px solid #ff6b00' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #e6e8e9', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#191c1d' }}>RECENT_PROJECTS</span>
            <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100' }}>[{counts.projects} TOTAL]</span>
          </div>
          {projects.map(p => (
            <div key={p._id} style={{ padding:'10px 16px', borderBottom:'1px solid #f2f4f5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:600, fontSize:'0.82rem', textTransform:'uppercase', color:'#191c1d' }}>{p.title}</span>
              <span style={{ background: p.status==='completed'?'#d1fae5':p.status==='in-progress'?'#fff3cd':'#e6e8e9', color: p.status==='completed'?'#065f46':p.status==='in-progress'?'#92400e':'#586062', fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', fontWeight:700, padding:'2px 6px', textTransform:'uppercase' }}>
                {p.status||'—'}
              </span>
            </div>
          ))}
        </div>

        {/* Blogs */}
        <div style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderTop:'3px solid #191c1d' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid #e6e8e9', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#191c1d' }}>RECENT_BLOGS</span>
            <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100' }}>[{counts.blogs} TOTAL]</span>
          </div>
          {blogs.map(b => (
            <div key={b._id} style={{ padding:'10px 16px', borderBottom:'1px solid #f2f4f5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:600, fontSize:'0.82rem', textTransform:'uppercase', color:'#191c1d', flex:1, marginRight:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.title}</span>
              <span style={{ background: b.published?'#d1fae5':'#f2f4f5', color: b.published?'#065f46':'#586062', fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', fontWeight:700, padding:'2px 6px', textTransform:'uppercase', flexShrink:0 }}>
                {b.published ? 'LIVE' : 'DRAFT'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System log */}
      <div style={{ marginTop:16, background:'#f2f4f5', border:'1px solid #e6e8e9', borderTop:'3px solid #e6e8e9', padding:'16px' }}>
        <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:'#191c1d', marginBottom:12 }}>SYSTEM_LOG</p>
        {[
          { type:'AUTH_SUCCESS', msg:'Admin session active.', border:'#ff6b00' },
          { type:'DB_CONNECTED', msg:'MongoDB Atlas connected.', border:'#e6e8e9' },
          { type:'NODE_STABLE', msg:'All API routes responding.', border:'#e6e8e9' },
        ].map((log,i) => (
          <div key={i} style={{ borderLeft:`2px solid ${log.border}`, padding:'5px 10px', marginBottom:6, background:'white' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', fontWeight:700, color:'#191c1d' }}>{log.type}</span>
              <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2' }}>NOW</span>
            </div>
            <p style={{ fontSize:'11px', color:'#586062', marginTop:2 }}>{log.msg}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
