import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import api from '../../utils/api';

/* ── ADMIN SHELL ── */
export function AdminShell({ title, subtitle, action, children }) {
  return (
    <div style={{ padding:'2rem', maxWidth:820 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:4 }}>
            LEDGER_OS // ADMIN_CONTROL
          </p>
          <h1 style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'1.6rem', textTransform:'uppercase', letterSpacing:'-0.02em', color:'#191c1d' }}>
            {title}
          </h1>
          {subtitle && <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#aab0b2', marginTop:4, textTransform:'uppercase' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ── FIELD ── */
export function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.15em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── MODAL ── */
export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h); };
  }, [onClose]);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(25,28,29,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth: wide ? 720 : 560, maxHeight:'90vh', overflowY:'auto', background:'#f8fafb', borderTop:'4px solid #ff6b00', borderRadius:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', background:'#f2f4f5', borderBottom:'1px solid #e6e8e9' }}>
          <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:700, fontSize:'0.95rem', textTransform:'uppercase', letterSpacing:'-0.01em', color:'#191c1d' }}>{title}</span>
          <button onClick={onClose} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, background:'#e6e8e9', border:'1px solid #d8dadb', cursor:'pointer', transition:'all 0.15s' }}
            onMouseOver={e=>{ e.currentTarget.style.background='#ff6b00'; e.currentTarget.style.color='white'; }}
            onMouseOut={e=>{ e.currentTarget.style.background='#e6e8e9'; e.currentTarget.style.color='inherit'; }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── SAVE BTN ── */
export function SaveBtn({ saving, label = 'SAVE_RECORD', onClick, type = 'submit' }) {
  return (
    <button type={type} onClick={onClick} disabled={saving}
      style={{ background: saving?'#aab0b2':'#191c1d', color:'white', fontFamily:'"JetBrains Mono",monospace', fontWeight:700, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.12em', padding:'10px 22px', border:'none', cursor:saving?'not-allowed':'pointer', clipPath:'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)', transition:'all 0.15s', whiteSpace:'nowrap' }}
      onMouseOver={e=>{ if(!saving) e.currentTarget.style.background='#ff6b00'; }}
      onMouseOut={e=>{ if(!saving) e.currentTarget.style.background=saving?'#aab0b2':'#191c1d'; }}>
      {saving ? 'SAVING...' : label}
    </button>
  );
}

/* ── CANCEL BTN ── */
export function CancelBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ background:'transparent', color:'#586062', fontFamily:'"JetBrains Mono",monospace', fontWeight:700, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 22px', border:'1px solid #e6e8e9', cursor:'pointer', transition:'all 0.15s' }}
      onMouseOver={e=>{ e.currentTarget.style.borderColor='#191c1d'; e.currentTarget.style.color='#191c1d'; }}
      onMouseOut={e=>{ e.currentTarget.style.borderColor='#e6e8e9'; e.currentTarget.style.color='#586062'; }}>
      CANCEL
    </button>
  );
}

/* ── TAG INPUT ── */
export function TagInput({ value = [], onChange, placeholder = 'Add item...' }) {
  const [input, setInput] = useState('');
  const add = () => { const v = input.trim(); if (v && !value.includes(v)) { onChange([...value, v]); setInput(''); } };
  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom: value.length ? 8 : 0 }}>
        {value.map((tag,i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', background:'#f2f4f5', border:'1px solid #e6e8e9', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#191c1d' }}>
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_,ii)=>ii!==i))}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#aab0b2', padding:0, lineHeight:1, display:'flex' }}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <input className="input" placeholder={placeholder} value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();add();} }} />
        <button type="button" onClick={add}
          style={{ padding:'8px 14px', background:'#f2f4f5', border:'1px solid #e6e8e9', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:4, fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', transition:'all 0.15s' }}
          onMouseOver={e=>e.currentTarget.style.borderColor='#a04100'}
          onMouseOut={e=>e.currentTarget.style.borderColor='#e6e8e9'}>
          <Plus size={12} /> ADD
        </button>
      </div>
    </div>
  );
}

/* ── TECH STACK INPUT ── */
export function TechStackInput({ value = [], onChange, techList = [] }) {
  const [q, setQ] = useState('');
  const filtered = q.length > 0
    ? techList.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) && !value.find(v=>v.name===t.name))
    : [];

  const add = tech => { if (!value.find(v=>v.name===tech.name)) onChange([...value, tech]); setQ(''); };
  const remove = name => onChange(value.filter(v=>v.name!==name));

  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom: value.length ? 8 : 0 }}>
        {value.map((t,i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', background:'#f2f4f5', border:'1px solid #e6e8e9', fontFamily:'"JetBrains Mono",monospace', fontSize:'10px', color:'#191c1d' }}>
            {t.icon && <img src={t.icon} alt={t.name} style={{ width:12, height:12, objectFit:'contain' }} />}
            {t.name}
            <button type="button" onClick={() => remove(t.name)} style={{ background:'none', border:'none', cursor:'pointer', color:'#aab0b2', padding:0, display:'flex' }}><X size={10}/></button>
          </span>
        ))}
      </div>
      <div style={{ position:'relative' }}>
        <input className="input" placeholder="Search tech..." value={q} onChange={e=>setQ(e.target.value)} />
        {filtered.length > 0 && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'white', border:'1px solid #e6e8e9', zIndex:50, maxHeight:200, overflowY:'auto' }}>
            {filtered.map((t,i) => (
              <button key={i} type="button" onClick={() => add(t)}
                style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 12px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.1s' }}
                onMouseOver={e=>e.currentTarget.style.background='#f2f4f5'}
                onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                {t.icon && <img src={t.icon} alt={t.name} style={{ width:14, height:14, objectFit:'contain' }} />}
                <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'11px' }}>{t.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
