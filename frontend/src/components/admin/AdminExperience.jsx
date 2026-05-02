import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { AdminShell, Field, Modal, SaveBtn, CancelBtn, TagInput, TechStackInput } from './FormHelpers';

const inp = { className:'input' };

/* ── EXPERIENCE ─────────────────────────────────── */
export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [techList, setTechList] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [iconFile, setIconFile] = useState(null);

  const load = () => api.get('/experience').then(r => setItems(r.data)).catch(()=>{});
  useEffect(() => { load(); api.get('/tech').then(r=>setTechList(r.data||[])).catch(()=>{}); }, []);

  const blank = { company:'',role:'',duration:'',description:'',link:'',techStack:[],points:[],order:0 };

  const openNew = () => { setForm(blank); setIconFile(null); setModal('new'); };
  const openEdit = item => { setForm({...item, techStack:item.techStack||[], points:item.points||[]}); setIconFile(null); setModal(item); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => {
        if (k === 'techStack' || k === 'points') fd.append(k, JSON.stringify(v));
        else if (k !== '_id' && k !== '__v' && k !== 'companyIcon') fd.append(k, v ?? '');
      });
      if (iconFile) fd.append('companyIcon', iconFile);
      if (modal === 'new') await api.post('/experience', fd);
      else await api.put(`/experience/${form._id}`, fd);
      toast.success('RECORD_SAVED'); setModal(null); load();
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const del = async id => { if (!confirm('DELETE_RECORD?')) return; await api.delete(`/experience/${id}`); toast.success('DELETED'); load(); };

  const s = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <AdminShell title="EXPERIENCE_MODULE" subtitle="WORK_HISTORY_RECORDS"
      action={<button onClick={openNew} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}><Plus size={12}/>ADD_RECORD</button>}>

      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {items.length === 0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', padding:'20px 0' }}>NO_RECORDS_FOUND</p>}
        {items.map(item => (
          <div key={item._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:'4px solid #ff6b00', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            {item.companyIcon && <img src={item.companyIcon} alt={item.company} style={{ width:36, height:36, objectFit:'contain', border:'1px solid #e6e8e9', padding:3, background:'white', flexShrink:0 }} />}
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.9rem', textTransform:'uppercase', color:'#191c1d' }}>{item.company}</p>
              <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#a04100', marginTop:1 }}>{item.role} // {item.duration}</p>
            </div>
            <div style={{ display:'flex', gap:4, flexShrink:0 }}>
              <button onClick={()=>openEdit(item)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex', transition:'all 0.15s' }} onMouseOver={e=>e.currentTarget.style.background='#ff6b00'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Pencil size={12}/></button>
              <button onClick={()=>del(item._id)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex', transition:'all 0.15s' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <Modal title={modal==='new'?'NEW_EXPERIENCE':'EDIT_EXPERIENCE'} onClose={()=>setModal(null)} wide>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="COMPANY_NAME"><input {...inp} value={form.company||''} onChange={e=>s('company',e.target.value)} required /></Field>
              <Field label="ROLE"><input {...inp} value={form.role||''} onChange={e=>s('role',e.target.value)} required /></Field>
              <Field label="DURATION"><input {...inp} value={form.duration||''} onChange={e=>s('duration',e.target.value)} placeholder="Feb 2026 - Mar 2026" /></Field>
              <Field label="COMPANY_URL"><input type="url" {...inp} value={form.link||''} onChange={e=>s('link',e.target.value)} /></Field>
            </div>
            <Field label="DESCRIPTION"><textarea {...inp} value={form.description||''} onChange={e=>s('description',e.target.value)} rows={3} style={{ resize:'vertical', width:'100%', padding:'8px 10px', background:'#f2f4f5', border:'1px solid #e6e8e9' }} /></Field>
            <Field label="COMPANY_ICON">
              <input type="file" accept="image/*" onChange={e=>setIconFile(e.target.files[0])} style={{ fontFamily:'"Inter",sans-serif', fontSize:'12px' }} />
            </Field>
            <Field label="TECH_STACK"><TechStackInput value={form.techStack||[]} onChange={v=>s('techStack',v)} techList={techList} /></Field>
            <Field label="WORK_POINTS"><TagInput value={form.points||[]} onChange={v=>s('points',v)} placeholder="Add work point..." /></Field>
            <Field label="ORDER"><input type="number" {...inp} value={form.order||0} onChange={e=>s('order',parseInt(e.target.value))} style={{ width:100 }} /></Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:8, borderTop:'1px solid #e6e8e9' }}>
              <CancelBtn onClick={()=>setModal(null)} />
              <SaveBtn saving={saving} />
            </div>
          </form>
        </Modal>
      )}
    </AdminShell>
  );
}
