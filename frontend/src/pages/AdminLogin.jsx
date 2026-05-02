import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); toast.success('AUTH_SUCCESS'); navigate('/admin'); }
    catch { toast.error('AUTH_FAILED // INVALID_CREDENTIALS'); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid-bg" style={{ minHeight:'100vh', background:'#f8fafb', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Header */}
        <div style={{ marginBottom:'2rem' }}>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:8 }}>
            LEDGER_OS_V1.0.4 // ADMIN_CONTROL
          </p>
          <h1 style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'2.5rem', textTransform:'uppercase', letterSpacing:'-0.03em', lineHeight:0.9, color:'#191c1d' }}>
            AUTHENTICATE<br /><span style={{ color:'#a04100' }}>OPERATOR</span>
          </h1>
        </div>

        {/* Form */}
        <div style={{ background:'#f2f4f5', borderTop:'4px solid #ff6b00', padding:'28px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[['IDENTIFIER_EMAIL','email','ENTER_EMAIL',email,setEmail],['ACCESS_KEY','password','ENTER_PASSWORD',password,setPassword]].map(([label,type,ph,val,set]) => (
              <div key={label}>
                <label style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.15em' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <input type={type} className="ledger-input" placeholder={ph} value={val} onChange={e=>set(e.target.value)} required />
                  <div style={{ position:'absolute', top:0, right:0, width:4, height:4, background:'#ff6b00' }} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ background: loading?'#aab0b2':'#191c1d', color:'white', fontFamily:'"JetBrains Mono",monospace', fontWeight:700, fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.15em', padding:'14px', border:'none', cursor:loading?'not-allowed':'pointer', clipPath:'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)', transition:'all 0.15s', marginTop:4 }}
              onMouseOver={e=>{ if(!loading) e.currentTarget.style.background='#ff6b00'; }}
              onMouseOut={e=>{ if(!loading) e.currentTarget.style.background='#191c1d'; }}>
              {loading ? 'AUTHENTICATING...' : 'INITIATE_ACCESS →'}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4">
            <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase' }}>// AUTHORIZED_ACCESS_ONLY //</p>
            <a href="/" style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textDecoration:'none', textTransform:'uppercase' }}>← EXIT</a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-4">
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase' }}>NODE_01</p>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase' }}>UPTIME: 99.9%</p>
        </div>
      </div>
    </div>
  );
}
