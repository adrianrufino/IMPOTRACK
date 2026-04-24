'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { AppUser, Role } from '@/lib/types'
import { useRouter } from 'next/navigation'

const ROLES: Role[] = ['admin', 'empleado']

export default function MaestroPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [pendingRoles, setPendingRoles] = useState<Record<string, Role>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (profile?.role !== 'maestro') { router.push('/dashboard'); return }
    setCurrentUser(profile)
    const { data: allUsers } = await supabase.from('profiles').select('*').neq('role', 'maestro').order('created_at')
    setUsers(allUsers || [])
    setLoading(false)
  }, [supabase, router])

  useEffect(() => { loadData() }, [loadData])

  async function saveRole(userId: string) {
    const newRole = pendingRoles[userId]
    if (!newRole) return
    setSaving(userId)
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setPendingRoles(prev => { const n = { ...prev }; delete n[userId]; return n })
    setSaving(null)
  }

  async function deleteUser(userId: string) {
    if (!confirm('Eliminar este usuario?')) return
    await supabase.from('profiles').delete().eq('id', userId)
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  if (loading) return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)'}}>Cargando...</div>

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)'}}>
      <nav style={{background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 16px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <button onClick={() => router.push('/dashboard')} style={{background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontSize:20, lineHeight:1, padding:4}}>←</button>
          <span style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17}}>Usuarios</span>
          <span style={{padding:'2px 8px', borderRadius:20, background:'rgba(139,92,246,0.2)', color:'#a78bfa', fontSize:11, fontWeight:600}}>MAESTRO</span>
        </div>
        <button onClick={() => setShowAdd(true)} style={{padding:'6px 14px', borderRadius:8, border:'none', background:'var(--accent)', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer'}}>
          + Nuevo
        </button>
      </nav>

      <div style={{padding:'16px', maxWidth:700, margin:'0 auto'}}>
        <p style={{fontSize:13, color:'var(--text2)', marginBottom:16}}>
          Administrá quién puede ver y modificar las importaciones.
        </p>

        {users.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 0', color:'var(--text2)'}}>
            <div style={{fontSize:40, marginBottom:12}}>👥</div>
            <p>Sin usuarios creados.</p>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {users.map(u => {
              const currentRole = pendingRoles[u.id] ?? u.role
              const hasChange = pendingRoles[u.id] !== undefined
              return (
                <div key={u.id} style={{background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:12, marginBottom: hasChange ? 10 : 0}}>
                    <div style={{width:38, height:38, borderRadius:'50%', flexShrink:0, background:u.role==='admin'?'rgba(79,142,247,0.15)':'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>
                      {u.role === 'admin' ? '🛡️' : '👷'}
                    </div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:14, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{u.name}</div>
                      <div style={{fontSize:12, color:'var(--text2)'}}>{u.email}</div>
                    </div>
                    <select
                      value={currentRole}
                      onChange={e => setPendingRoles(prev => ({ ...prev, [u.id]: e.target.value as Role }))}
                      style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text)', fontSize:12, cursor:'pointer'}}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r === 'admin' ? '🛡️ Admin' : '👷 Empleado'}</option>)}
                    </select>
                    <button onClick={() => deleteUser(u.id)} style={{padding:'6px 10px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'transparent', color:'#f87171', fontSize:12, cursor:'pointer', flexShrink:0}}>
                      Borrar
                    </button>
                  </div>
                  {hasChange && (
                    <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                      <button onClick={() => setPendingRoles(prev => { const n = {...prev}; delete n[u.id]; return n })} style={{padding:'7px 14px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:12, cursor:'pointer'}}>
                        Cancelar
                      </button>
                      <button onClick={() => saveRole(u.id)} disabled={saving === u.id} style={{padding:'7px 16px', borderRadius:8, border:'none', background:'var(--accent)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer'}}>
                        {saving === u.id ? 'Guardando...' : '✓ Guardar rol'}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); loadData() }} supabase={supabase}/>
      )}
    </div>
  )
}

function AddUserModal({ onClose, onSaved, supabase }: { onClose: () => void; onSaved: () => void; supabase: ReturnType<typeof createClient> }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('empleado')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!name || !email || !password) return setError('Completa todos los campos')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    setSaving(true); setError('')
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { name, role } } })
    if (signUpError) { setError(signUpError.message); setSaving(false); return }
    if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, email, name, role })
    onSaved()
  }

  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16}}>
      <div onClick={e => e.stopPropagation()} style={{background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, width:'100%', maxWidth:400, padding:'24px 20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:600}}>Nuevo usuario</h2>
          <button onClick={onClose} style={{background:'none', border:'none', color:'var(--text2)', fontSize:22, cursor:'pointer'}}>×</button>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <div><label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:5}}>Nombre</label><input className="input" placeholder="Juan Perez" value={name} onChange={e => setName(e.target.value)}/></div>
          <div><label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:5}}>Email</label><input className="input" type="email" placeholder="juan@empresa.com" value={email} onChange={e => setEmail(e.target.value)}/></div>
          <div><label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:5}}>Contraseña</label><input className="input" type="password" placeholder="Minimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)}/></div>
          <div>
            <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:5}}>Rol</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value as Role)}>
              <option value="admin">🛡️ Admin — puede modificar estados</option>
              <option value="empleado">👷 Empleado — solo puede ver</option>
            </select>
          </div>
          {error && <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#f87171'}}>{error}</div>}
          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:4}}>
            <button onClick={onClose} style={{padding:'10px 16px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:13, cursor:'pointer'}}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving} style={{width:'auto', padding:'10px 20px'}}>{saving ? 'Creando...' : 'Crear'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
