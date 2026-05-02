import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { AdminShell, Field, Modal, SaveBtn, CancelBtn } from './FormHelpers';

const inp = { className: 'input' };

/* ── PLATFORMS ── */
export function AdminPlatforms() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/platforms').then(r=>setItems(r.data||[])).catch(()=>{});
  useEffect(() => { load(); }, []);

  const blank = { name:'',username:'',url:'',color:'#a04100',showStats:true,showHeatmap:false,order:0 };
  const PRESETS = ['GitHub','LeetCode','Codeforces','HackerRank','HackerEarth','LinkedIn'];
  const presetUrls = { GitHub:'https://github.com/',LeetCode:'https://leetcode.com/',Codeforces:'https://codeforces.com/profile/',HackerRank:'https://hackerrank.com/',HackerEarth:'https://hackerearth.com/@',LinkedIn:'https://linkedin.com/in/' };

  const openNew = (name='') => {
    setForm({ ...blank, name, url: presetUrls[name]||'' });
    setModal('new');
  };
  const openEdit = item => { setForm({...item}); setModal(item); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const body = { ...form, showStats: !!form.showStats, showHeatmap: !!form.showHeatmap };
      if (modal==='new') await api.post('/platforms', body);
      else await api.put(`/platforms/${form._id}`, body);
      toast.success('RECORD_SAVED'); setModal(null); load();
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const del = async id => { if (!confirm('DELETE?')) return; await api.delete(`/platforms/${id}`); toast.success('DELETED'); load(); };
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <AdminShell title="PLATFORMS_MODULE" subtitle="NETWORK_MAP_RECORDS"
      action={<button onClick={()=>openNew()} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}><Plus size={12}/>ADD_NODE</button>}>
      
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
        {PRESETS.map(p => <button key={p} onClick={()=>openNew(p)} style={{ padding:'5px 12px', background:'#f2f4f5', border:'1px solid #e6e8e9', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', fontWeight:700, textTransform:'uppercase', transition:'all 0.15s' }} onMouseOver={e=>{e.currentTarget.style.background='#ff6b00';e.currentTarget.style.color='white';}} onMouseOut={e=>{e.currentTarget.style.background='#f2f4f5';e.currentTarget.style.color='inherit';}}>{p}</button>)}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {items.map(item => (
          <div key={item._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:`4px solid ${item.color||'#ff6b00'}`, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.9rem', textTransform:'uppercase', color:'#191c1d' }}>{item.name}</p>
              <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#a04100', marginTop:1 }}>@{item.username}</p>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              <button onClick={()=>openEdit(item)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#ff6b00'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Pencil size={12}/></button>
              <button onClick={()=>del(item._id)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', padding:'20px 0' }}>NO_NODES_REGISTERED</p>}
      </div>

      {modal !== null && (
        <Modal title={modal==='new'?'NEW_NODE':'EDIT_NODE'} onClose={()=>setModal(null)}>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="PLATFORM_NAME"><input {...inp} value={form.name||''} onChange={e=>s('name',e.target.value)} required /></Field>
              <Field label="USERNAME"><input {...inp} value={form.username||''} onChange={e=>s('username',e.target.value)} required /></Field>
            </div>
            <Field label="PROFILE_URL"><input type="url" {...inp} value={form.url||''} onChange={e=>s('url',e.target.value)} /></Field>
            <Field label="ACCENT_COLOR"><input type="color" value={form.color||'#a04100'} onChange={e=>s('color',e.target.value)} style={{ width:60, height:36, border:'1px solid #e6e8e9', cursor:'pointer', padding:2 }} /></Field>
            <div style={{ display:'flex', gap:16 }}>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', textTransform:'uppercase', cursor:'pointer' }}>
                <input type="checkbox" checked={!!form.showStats} onChange={e=>s('showStats',e.target.checked)} /> SHOW_STATS
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', textTransform:'uppercase', cursor:'pointer' }}>
                <input type="checkbox" checked={!!form.showHeatmap} onChange={e=>s('showHeatmap',e.target.checked)} /> SHOW_HEATMAP
              </label>
            </div>
            <Field label="ORDER"><input type="number" {...inp} value={form.order||0} onChange={e=>s('order',parseInt(e.target.value))} style={{ width:100 }} /></Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:8, borderTop:'1px solid #e6e8e9' }}>
              <CancelBtn onClick={()=>setModal(null)} /><SaveBtn saving={saving} />
            </div>
          </form>
        </Modal>
      )}
    </AdminShell>
  );
}

/* ── BLOGS ── */
export function AdminBlogs() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  const load = () => api.get('/blogs?all=true').then(r=>setItems(r.data||[])).catch(()=>{});
  useEffect(() => { load(); }, []);

  const blank = { title:'',description:'',topic:'',publishedAt:'',published:false,platforms:[],order:0 };
  const openNew = () => { setForm(blank); setCoverFile(null); setModal('new'); };
  const openEdit = item => { setForm({...item, platforms:item.platforms||[]}); setCoverFile(null); setModal(item); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      ['title','description','topic','publishedAt','order'].forEach(k=>fd.append(k,form[k]??''));
      fd.append('published', form.published?'true':'false');
      fd.append('platforms', JSON.stringify(form.platforms||[]));
      if (coverFile) fd.append('coverImage', coverFile);
      if (modal==='new') await api.post('/blogs', fd);
      else await api.put(`/blogs/${form._id}`, fd);
      toast.success('RECORD_SAVED'); setModal(null); load();
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const del = async id => { if (!confirm('DELETE?')) return; await api.delete(`/blogs/${id}`); toast.success('DELETED'); load(); };
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const addPlatform = () => s('platforms', [...(form.platforms||[]), { name:'', url:'' }]);
  const updPlatform = (i,k,v) => { const p=[...(form.platforms||[])]; p[i]={...p[i],[k]:v}; s('platforms',p); };
  const delPlatform = i => s('platforms', (form.platforms||[]).filter((_,ii)=>ii!==i));

  return (
    <AdminShell title="BLOGS_MODULE" subtitle="DATA_LOG_RECORDS"
      action={<button onClick={openNew} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}><Plus size={12}/>NEW_LOG</button>}>

      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {items.map(item => (
          <div key={item._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:`4px solid ${item.published?'#22c55e':'#aab0b2'}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.88rem', textTransform:'uppercase', color:'#191c1d', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</p>
              <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', marginTop:1 }}>{item.topic} // {item.publishedAt}</p>
            </div>
            <span style={{ background:item.published?'#d1fae5':'#f2f4f5', color:item.published?'#065f46':'#586062', fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', fontWeight:700, padding:'2px 6px', flexShrink:0, textTransform:'uppercase' }}>
              {item.published?'LIVE':'DRAFT'}
            </span>
            <div style={{ display:'flex', gap:4, flexShrink:0 }}>
              <button onClick={()=>openEdit(item)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#ff6b00'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Pencil size={12}/></button>
              <button onClick={()=>del(item._id)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', padding:'20px 0' }}>NO_LOG_ENTRIES</p>}
      </div>

      {modal !== null && (
        <Modal title={modal==='new'?'NEW_LOG':'EDIT_LOG'} onClose={()=>setModal(null)} wide>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Field label="TITLE"><input {...inp} value={form.title||''} onChange={e=>s('title',e.target.value)} required /></Field>
            <Field label="DESCRIPTION"><textarea {...inp} value={form.description||''} onChange={e=>s('description',e.target.value)} rows={3} style={{ resize:'vertical', width:'100%', padding:'8px 10px', background:'#f2f4f5', border:'1px solid #e6e8e9' }} /></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="TOPIC"><input {...inp} value={form.topic||''} onChange={e=>s('topic',e.target.value)} /></Field>
              <Field label="PUBLISHED_DATE"><input {...inp} value={form.publishedAt||''} onChange={e=>s('publishedAt',e.target.value)} placeholder="January 1, 2026" /></Field>
            </div>
            <Field label="COVER_IMAGE">
              <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files[0])} style={{ fontFamily:'"Inter",sans-serif', fontSize:'12px' }} />
            </Field>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em' }}>PLATFORM_LINKS</span>
                <button type="button" onClick={addPlatform} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', textTransform:'uppercase' }}><Plus size={10}/>ADD</button>
              </div>
              {(form.platforms||[]).map((pl,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:6 }}>
                  <input {...inp} value={pl.name||''} onChange={e=>updPlatform(i,'name',e.target.value)} placeholder="Medium" />
                  <input type="url" {...inp} value={pl.url||''} onChange={e=>updPlatform(i,'url',e.target.value)} placeholder="https://..." />
                  <button type="button" onClick={()=>delPlatform(i)} style={{ padding:'6px 8px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }}><Trash2 size={11}/></button>
                </div>
              ))}
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', textTransform:'uppercase', cursor:'pointer' }}>
              <input type="checkbox" checked={!!form.published} onChange={e=>s('published',e.target.checked)} />
              PUBLISH_LOG (LIVE_STATUS)
            </label>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:8, borderTop:'1px solid #e6e8e9' }}>
              <CancelBtn onClick={()=>setModal(null)} /><SaveBtn saving={saving} />
            </div>
          </form>
        </Modal>
      )}
    </AdminShell>
  );
}

/* ── TECH REGISTRY ── */
export function AdminTech() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');

  const PRESETS = ['React','Node.js','TypeScript','Python','MongoDB','Express','Firebase','Next.js','Tailwind CSS','PostgreSQL','Docker','AWS','Vue','Angular','GraphQL','Redis','Flutter','Rust','Go','Java','Swift','Kotlin','C++','TensorFlow','PyTorch','Prisma','Supabase','Vite'];
  const iconUrl = name => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name.toLowerCase().replace(/\./g,'').replace(/ /g,'')}/${name.toLowerCase().replace(/\./g,'').replace(/ /g,'')}-original.svg`;

  const load = () => api.get('/tech').then(r=>setItems(r.data||[])).catch(()=>{});
  useEffect(() => { load(); }, []);

  const addPreset = async name => {
    setSaving(true);
    try { await api.post('/tech', { name, icon: iconUrl(name) }); load(); } catch {}
    finally { setSaving(false); }
  };

  const addCustom = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try { await api.post('/tech', { name: newName.trim(), icon: newIcon.trim() }); setNewName(''); setNewIcon(''); load(); } catch {}
    finally { setSaving(false); }
  };

  const del = async id => { await api.delete(`/tech/${id}`); load(); };
  const filtered = q ? items.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <AdminShell title="TECH_REGISTRY" subtitle="GLOBAL_TECHNOLOGY_DATABASE">
      {/* Presets */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:8 }}>QUICK_ADD_PRESETS</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {PRESETS.filter(p=>!items.find(t=>t.name===p)).map(p => (
            <button key={p} onClick={()=>addPreset(p)} style={{ padding:'4px 10px', background:'#f2f4f5', border:'1px solid #e6e8e9', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', fontWeight:700, textTransform:'uppercase', transition:'all 0.15s' }} onMouseOver={e=>{e.currentTarget.style.background='#ff6b00';e.currentTarget.style.color='white';}} onMouseOut={e=>{e.currentTarget.style.background='#f2f4f5';e.currentTarget.style.color='inherit';}}>{p}</button>
          ))}
        </div>
      </div>

      {/* Add custom */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:20, padding:14, background:'#f2f4f5', border:'1px solid #e6e8e9', borderTop:'3px solid #191c1d' }}>
        <div>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase', marginBottom:4 }}>TECH_NAME</p>
          <input className="input" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="TechName" />
        </div>
        <div>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase', marginBottom:4 }}>ICON_URL</p>
          <input className="input" value={newIcon} onChange={e=>setNewIcon(e.target.value)} placeholder="https://..." />
        </div>
        <div style={{ display:'flex', alignItems:'flex-end' }}>
          <button onClick={addCustom} disabled={saving} style={{ padding:'9px 16px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase', display:'flex', alignItems:'center', gap:4 }}><Plus size={12}/>ADD</button>
        </div>
      </div>

      {/* Search + grid */}
      <input className="input" placeholder="SEARCH_REGISTRY..." value={q} onChange={e=>setQ(e.target.value)} style={{ marginBottom:12 }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:4 }}>
        {filtered.map(t => (
          <div key={t._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', padding:'10px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
              {t.icon && <img src={t.icon} alt={t.name} style={{ width:16, height:16, objectFit:'contain', flexShrink:0 }} onError={e=>e.target.style.display='none'} />}
              <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, color:'#191c1d', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</span>
            </div>
            <button onClick={()=>del(t._id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#aab0b2', display:'flex', flexShrink:0 }} onMouseOver={e=>e.currentTarget.style.color='#dc2626'} onMouseOut={e=>e.currentTarget.style.color='#aab0b2'}><Trash2 size={11}/></button>
          </div>
        ))}
      </div>
      {filtered.length===0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', paddingTop:12 }}>NO_ENTRIES_FOUND</p>}
    </AdminShell>
  );
}

export default AdminPlatforms;
