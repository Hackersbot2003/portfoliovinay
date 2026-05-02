import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { AdminShell, Field, Modal, SaveBtn, CancelBtn, TagInput, TechStackInput } from './FormHelpers';

const inp = { className: 'input' };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [techList, setTechList] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);

  const load = () => api.get('/projects').then(r => setItems(r.data || [])).catch(() => {});
  useEffect(() => { load(); api.get('/tech').then(r=>setTechList(r.data||[])).catch(()=>{}); }, []);

  const blank = { title:'',description:'',features:[],topic:'',status:'completed',featured:false,techStack:[],deployedLink:'',githubLink:'',extraLinks:[],order:0 };
  const openNew = () => { setForm(blank); setPhotoFiles([]); setModal('new'); };
  const openEdit = item => { setForm({...item, techStack:item.techStack||[], features:item.features||[], extraLinks:item.extraLinks||[]}); setPhotoFiles([]); setModal(item); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      ['title','description','topic','status','deployedLink','githubLink','order'].forEach(k=>fd.append(k,form[k]??''));
      fd.append('featured', form.featured?'true':'false');
      fd.append('features', JSON.stringify(form.features||[]));
      fd.append('techStack', JSON.stringify(form.techStack||[]));
      fd.append('extraLinks', JSON.stringify(form.extraLinks||[]));
      photoFiles.forEach(f => fd.append('photos', f));
      if (modal==='new') await api.post('/projects', fd);
      else await api.put(`/projects/${form._id}`, fd);
      toast.success('RECORD_SAVED'); setModal(null); load();
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const del = async id => { if (!confirm('DELETE_DEPLOYMENT?')) return; await api.delete(`/projects/${id}`); toast.success('DELETED'); load(); };
  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  const statusColors = { completed:'#d1fae5', 'in-progress':'#fff3cd', archived:'#f2f4f5' };
  const statusText = { completed:'#065f46', 'in-progress':'#92400e', archived:'#586062' };

  return (
    <AdminShell title="PROJECTS_MODULE" subtitle="DEPLOYMENT_RECORDS"
      action={<button onClick={openNew} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}><Plus size={12}/>NEW_DEPLOYMENT</button>}>

      {/* Filter bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:4, marginBottom:12 }}>
        {items.map(item => (
          <div key={item._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:`4px solid ${item.status==='completed'?'#22c55e':item.status==='in-progress'?'#f59e0b':'#aab0b2'}`, padding:'12px 14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.85rem', textTransform:'uppercase', color:'#191c1d', lineHeight:1.2 }}>{item.title}</p>
              <div style={{ display:'flex', gap:3, flexShrink:0, marginLeft:6 }}>
                <button onClick={()=>openEdit(item)} style={{ padding:'4px 7px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#ff6b00'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Pencil size={11}/></button>
                <button onClick={()=>del(item._id)} style={{ padding:'4px 7px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Trash2 size={11}/></button>
              </div>
            </div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {item.topic && <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', padding:'2px 6px', background:statusColors[item.status]||'#f2f4f5', color:statusText[item.status]||'#586062', textTransform:'uppercase' }}>{item.status}</span>}
              {item.topic && <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', padding:'2px 6px', background:'#e6e8e9', color:'#586062', textTransform:'uppercase' }}>{item.topic}</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', padding:'20px 0' }}>NO_DEPLOYMENTS_FOUND</p>}
      </div>

      {modal !== null && (
        <Modal title={modal==='new'?'NEW_DEPLOYMENT':'EDIT_DEPLOYMENT'} onClose={()=>setModal(null)} wide>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="PROJECT_TITLE"><input {...inp} value={form.title||''} onChange={e=>s('title',e.target.value)} required /></Field>
              <Field label="TOPIC">
                <input {...inp} value={form.topic||''} onChange={e=>s('topic',e.target.value)} placeholder="Web, IoT, Mobile..." />
              </Field>
              <Field label="STATUS">
                <select {...inp} value={form.status||'completed'} onChange={e=>s('status',e.target.value)}>
                  <option value="completed">COMPLETED</option>
                  <option value="in-progress">IN_PROGRESS</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </Field>
              <Field label="ORDER"><input type="number" {...inp} value={form.order||0} onChange={e=>s('order',parseInt(e.target.value))} /></Field>
            </div>
            <Field label="DESCRIPTION"><textarea {...inp} value={form.description||''} onChange={e=>s('description',e.target.value)} rows={3} style={{ resize:'vertical', width:'100%', padding:'8px 10px', background:'#f2f4f5', border:'1px solid #e6e8e9' }} /></Field>
            <Field label="FEATURES"><TagInput value={form.features||[]} onChange={v=>s('features',v)} placeholder="Add feature..." /></Field>
            <Field label="TECH_STACK"><TechStackInput value={form.techStack||[]} onChange={v=>s('techStack',v)} techList={techList} /></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="GITHUB_URL"><input type="url" {...inp} value={form.githubLink||''} onChange={e=>s('githubLink',e.target.value)} /></Field>
              <Field label="LIVE_URL"><input type="url" {...inp} value={form.deployedLink||''} onChange={e=>s('deployedLink',e.target.value)} /></Field>
            </div>
            <Field label="PROJECT_PHOTOS">
              <input type="file" accept="image/*" multiple onChange={e=>setPhotoFiles(Array.from(e.target.files))} style={{ fontFamily:'"Inter",sans-serif', fontSize:'12px' }} />
              {form.photos?.length > 0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', marginTop:4 }}>EXISTING: {form.photos.length} FRAME(S)</p>}
            </Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:8, borderTop:'1px solid #e6e8e9' }}>
              <CancelBtn onClick={()=>setModal(null)} /><SaveBtn saving={saving} />
            </div>
          </form>
        </Modal>
      )}
    </AdminShell>
  );
}
