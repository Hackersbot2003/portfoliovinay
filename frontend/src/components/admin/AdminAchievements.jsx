import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { AdminShell, Field, Modal, SaveBtn, CancelBtn } from './FormHelpers';

const inp = { className: 'input' };

export default function AdminAchievements() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [iconFile, setIconFile] = useState(null);

  const load = () => api.get('/achievements').then(r => setItems(r.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const blank = { title: '', description: '', link: '', date: '', order: 0 };
  const openNew = () => { setForm(blank); setIconFile(null); setModal('new'); };
  const openEdit = item => { setForm({ ...item }); setIconFile(null); setModal(item); };

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      ['title', 'description', 'link', 'date', 'order'].forEach(k => fd.append(k, form[k] ?? ''));
      if (iconFile) fd.append('icon', iconFile);
      if (modal === 'new') await api.post('/achievements', fd);
      else await api.put(`/achievements/${form._id}`, fd);
      toast.success('RECORD_SAVED'); setModal(null); load();
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const del = async id => { if (!confirm('DELETE?')) return; await api.delete(`/achievements/${id}`); toast.success('DELETED'); load(); };
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminShell title="ACHIEVEMENTS_MODULE" subtitle="MILESTONE_RECORDS"
      action={<button onClick={openNew} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', fontWeight:700, textTransform:'uppercase' }}><Plus size={12}/>ADD_MILESTONE</button>}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.length === 0 && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2', textTransform:'uppercase', padding:'20px 0' }}>NO_RECORDS_FOUND</p>}
        {items.map(item => (
          <div key={item._id} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:'4px solid #ff6b00', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            {item.icon && <img src={item.icon} alt="" style={{ width:32, height:32, objectFit:'contain', flexShrink:0, border:'1px solid #e6e8e9', padding:3, background:'white' }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.9rem', textTransform:'uppercase', color:'#191c1d' }}>{item.title}</p>
              <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#aab0b2', marginTop:1 }}>{item.date}</p>
            </div>
            <div style={{ display:'flex', gap:4, flexShrink:0 }}>
              <button onClick={()=>openEdit(item)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#ff6b00'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Pencil size={12}/></button>
              <button onClick={()=>del(item._id)} style={{ padding:'6px 10px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }} onMouseOver={e=>e.currentTarget.style.background='#dc2626'} onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <Modal title={modal==='new'?'NEW_MILESTONE':'EDIT_MILESTONE'} onClose={()=>setModal(null)}>
          <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Field label="TITLE"><input {...inp} value={form.title||''} onChange={e=>s('title',e.target.value)} required /></Field>
            <Field label="DESCRIPTION"><textarea {...inp} value={form.description||''} onChange={e=>s('description',e.target.value)} rows={3} style={{ resize:'vertical', width:'100%', padding:'8px 10px', background:'#f2f4f5', border:'1px solid #e6e8e9' }} /></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="LINK"><input type="url" {...inp} value={form.link||''} onChange={e=>s('link',e.target.value)} /></Field>
              <Field label="DATE"><input {...inp} value={form.date||''} onChange={e=>s('date',e.target.value)} placeholder="Mar 2026" /></Field>
            </div>
            <Field label="ICON_IMAGE">
              <input type="file" accept="image/*" onChange={e=>setIconFile(e.target.files[0])} style={{ fontFamily:'"Inter",sans-serif', fontSize:'12px' }} />
            </Field>
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
