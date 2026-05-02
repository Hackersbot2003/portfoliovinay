import { useEffect, useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { AdminShell, Field, SaveBtn } from './FormHelpers';

export default function AdminProfile() {
  const [form, setForm] = useState({ name:'',title:'',bio:'',location:'',email:'',resume:'',institution:'',institutionIcon:'',avatar:'', socials:{ github:'',linkedin:'',leetcode:'',twitter:'',discord:'',codeforces:'',hackerrank:'',hackerearth:'' }, skills:[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setForm(f => ({ ...f, ...data, socials:{ ...f.socials, ...data.socials } }));
      setAvatarPreview(data.avatar || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      let avatarUrl = form.avatar || '';
      if (avatarFile) {
        const fd = new FormData(); fd.append('image', avatarFile);
        const { data } = await api.post('/profile/avatar', fd);
        avatarUrl = data.avatar;
        setAvatarPreview(avatarUrl); setAvatarFile(null);
      }
      await api.put('/profile', { ...form, avatar: avatarUrl });
      setForm(f => ({ ...f, avatar: avatarUrl }));
      toast.success('PROFILE_UPDATED');
    } catch { toast.error('SAVE_FAILED'); } finally { setSaving(false); }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSocial = (key, val) => setForm(f => ({ ...f, socials:{ ...f.socials, [key]:val } }));
  const addGroup = () => set('skills', [...form.skills, { category:'NEW_CATEGORY', items:[] }]);
  const removeGroup = i => set('skills', form.skills.filter((_,idx)=>idx!==i));
  const updateGroup = (i, val) => { const s=[...form.skills]; s[i]={...s[i],category:val}; set('skills',s); };
  const addItem = gi => { const s=JSON.parse(JSON.stringify(form.skills)); s[gi].items.push({name:'',icon:''}); set('skills',s); };
  const updateItem = (gi,ii,k,v) => { const s=JSON.parse(JSON.stringify(form.skills)); s[gi].items[ii][k]=v; set('skills',s); };
  const removeItem = (gi,ii) => { const s=JSON.parse(JSON.stringify(form.skills)); s[gi].items.splice(ii,1); set('skills',s); };

  if (loading) return <div style={{ padding:'2rem', fontFamily:'"JetBrains Mono",monospace', fontSize:'11px', color:'#aab0b2' }}>LOADING...</div>;

  const inp = { className:'input', style:{ fontFamily:'"Inter",sans-serif', fontSize:'13px' } };

  return (
    <AdminShell title="PROFILE_EDITOR" subtitle="PUBLIC_IDENTITY_MODULE"
      action={<SaveBtn saving={saving} onClick={handleSave} />}>
      <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:'4px solid #ff6b00' }}>
          {avatarPreview ? <img src={avatarPreview} alt="avatar" style={{ width:72, height:72, objectFit:'cover', border:'2px solid #ff6b00', flexShrink:0 }} />
            : <div style={{ width:72, height:72, background:'#ff6b00', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'1.8rem', color:'#572000', flexShrink:0 }}>{form.name?.charAt(0)||'?'}</div>}
          <label style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#e6e8e9', border:'1px solid #d8dadb', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', transition:'all 0.15s' }}
            onMouseOver={e=>e.currentTarget.style.background='#ff6b00'}
            onMouseOut={e=>e.currentTarget.style.background='#e6e8e9'}>
            <Upload size={12} /> UPLOAD_PHOTO
            <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f=e.target.files[0]; if(f){setAvatarFile(f);setAvatarPreview(URL.createObjectURL(f));} }} />
          </label>
        </div>

        {/* Basic */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['NAME','name','text'],['TITLE','title','text'],['LOCATION','location','text'],['EMAIL','email','email'],['INSTITUTION','institution','text'],['INSTITUTION_ICON_URL','institutionIcon','text']].map(([label,key,type]) => (
            <Field key={key} label={label}><input type={type} {...inp} value={form[key]||''} onChange={e=>set(key,e.target.value)} /></Field>
          ))}
        </div>

        <Field label="BIO"><textarea {...inp} value={form.bio||''} onChange={e=>set('bio',e.target.value)} rows={4} style={{ ...inp.style, resize:'vertical', width:'100%', padding:'10px 12px', background:'#f2f4f5', border:'1px solid #e6e8e9' }} /></Field>
        <Field label="RESUME_URL"><input type="url" {...inp} value={form.resume||''} onChange={e=>set('resume',e.target.value)} /></Field>

        {/* Socials */}
        <div>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:10, borderBottom:'1px solid #e6e8e9', paddingBottom:6 }}>SOCIAL_LINKS</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {Object.keys(form.socials).map(key => (
              <Field key={key} label={key.toUpperCase()}>
                <input type="url" {...inp} value={form.socials[key]||''} onChange={e=>setSocial(key,e.target.value)} placeholder={`https://${key}.com/...`} />
              </Field>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em' }}>SKILL_GROUPS</p>
            <button type="button" onClick={addGroup} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 12px', background:'#191c1d', color:'white', border:'none', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', fontWeight:700, textTransform:'uppercase' }}>
              <Plus size={11} /> ADD_GROUP
            </button>
          </div>
          {form.skills.map((group, gi) => (
            <div key={gi} style={{ background:'#f2f4f5', border:'1px solid #e6e8e9', borderLeft:'4px solid #191c1d', padding:14, marginBottom:10 }}>
              <div style={{ display:'flex', gap:8, marginBottom:10, alignItems:'center' }}>
                <input {...inp} value={group.category} onChange={e=>updateGroup(gi,e.target.value)} placeholder="CATEGORY_NAME" style={{ flex:1, ...inp.style }} />
                <button type="button" onClick={()=>removeGroup(gi)} style={{ padding:'6px 10px', background:'#dc2626', color:'white', border:'none', cursor:'pointer', display:'flex' }}><Trash2 size={12}/></button>
              </div>
              {group.items.map((item,ii) => (
                <div key={ii} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:6 }}>
                  <input {...inp} value={item.name} onChange={e=>updateItem(gi,ii,'name',e.target.value)} placeholder="Tech name" />
                  <input {...inp} value={item.icon} onChange={e=>updateItem(gi,ii,'icon',e.target.value)} placeholder="Icon URL" />
                  <button type="button" onClick={()=>removeItem(gi,ii)} style={{ padding:'6px 8px', background:'#e6e8e9', border:'none', cursor:'pointer', display:'flex' }}><X size={11}/></button>
                </div>
              ))}
              <button type="button" onClick={()=>addItem(gi)} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', background:'white', border:'1px dashed #d8dadb', cursor:'pointer', fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', marginTop:4 }}>
                <Plus size={10} /> ADD_ITEM
              </button>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid #e6e8e9' }}>
          <SaveBtn saving={saving} />
        </div>
      </form>
    </AdminShell>
  );
}

function X({ size }) { return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
