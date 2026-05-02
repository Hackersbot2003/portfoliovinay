import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProfile from '../components/admin/AdminProfile';
import AdminExperience from '../components/admin/AdminExperience';
import AdminAchievements from '../components/admin/AdminAchievements';
import AdminProjects from '../components/admin/AdminProjects';
import AdminPlatforms from '../components/admin/AdminPlatforms';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminTech from '../components/admin/AdminTech';
import { Menu, X, ExternalLink, LogOut,
  LayoutDashboard, User, Briefcase, Trophy,
  FolderOpen, Globe, BookOpen, Cpu } from 'lucide-react';

const NAV = [
  { to:'/admin',            icon:LayoutDashboard, label:'OVERVIEW',      end:true },
  { to:'/admin/profile',    icon:User,            label:'PROFILE'              },
  { to:'/admin/experience', icon:Briefcase,       label:'EXPERIENCE'           },
  { to:'/admin/achievements',icon:Trophy,         label:'ACHIEVEMENTS'         },
  { to:'/admin/projects',   icon:FolderOpen,      label:'PROJECTS'             },
  { to:'/admin/platforms',  icon:Globe,           label:'PLATFORMS'            },
  { to:'/admin/blogs',      icon:BookOpen,        label:'BLOGS'                },
  { to:'/admin/tech',       icon:Cpu,             label:'TECH_REGISTRY'        },
];

function AdminNav({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="admin-sidebar" style={{ paddingTop: 64 }}>
      <div>
        <div style={{ padding:'0 0 16px', marginBottom:16, borderBottom:'1px solid #e6e8e9' }}>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#a04100', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:4 }}>
            LEDGER_OS_V1.0.4
          </p>
          <p style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'1rem', textTransform:'uppercase', color:'#191c1d' }}>
            ADMIN_CONTROL
          </p>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', marginTop:2 }}>
            V1.0.4-STABLE // SYSTEM_READY
          </p>
        </div>
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, icon:Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={onClose}>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
          <ExternalLink size={13} /> VIEW_PORTFOLIO
        </a>
        <button onClick={() => { logout(); navigate('/admin/login'); }} className="admin-nav-link">
          <LogOut size={13} /> LOGOUT
        </button>
        <div style={{ marginTop:8, padding:'8px 12px', background:'#f2f4f5', border:'1px solid #e6e8e9' }}>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', color:'#aab0b2', textTransform:'uppercase' }}>UPTIME: 99.9%</p>
          <p style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'8px', color:'#aab0b2', textTransform:'uppercase' }}>NODE_01 // STABLE</p>
        </div>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f8fafb' }}>
      {/* Topbar */}
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:60, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px', background:'rgba(248,250,251,0.95)', backdropFilter:'blur(10px)', borderBottom:'1px solid #e6e8e9', borderTop:'3px solid #ff6b00' }}>
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setOpen(o=>!o)}
            style={{ padding:6, background:'#f2f4f5', border:'1px solid #e6e8e9', cursor:'pointer' }}>
            {open ? <X size={15}/> : <Menu size={15}/>}
          </button>
          <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:900, fontSize:'1rem', textTransform:'uppercase', letterSpacing:'-0.01em', color:'#191c1d' }}>
            LEDGER_OS // ADMIN_PANEL
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:6, height:6, background:'#22c55e', borderRadius:'50%', boxShadow:'0 0 6px #22c55e' }} />
          <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'9px', color:'#aab0b2', textTransform:'uppercase' }}>ONLINE</span>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(25,28,29,0.5)', zIndex:55 }} />}

      {/* Sidebar desktop */}
      <div className="hidden md:block" style={{ width:220, flexShrink:0 }}>
        <div style={{ position:'sticky', top:0, height:'100vh' }}>
          <AdminNav onClose={() => {}} />
        </div>
      </div>

      {/* Sidebar mobile */}
      <div style={{ position:'fixed', left: open?0:'-240px', top:0, bottom:0, width:220, zIndex:56, transition:'left 0.3s ease' }}>
        <AdminNav onClose={() => setOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ flex:1, minWidth:0, paddingTop:56, overflowY:'auto' }}>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="platforms" element={<AdminPlatforms />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="tech" element={<AdminTech />} />
        </Routes>
      </div>
    </div>
  );
}
