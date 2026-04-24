'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="login-page">
      <div style={{width:'100%', maxWidth:380, padding:'0 16px'}}>
        {/* Logo */}
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#4f8ef7,#7c3aed)',
            marginBottom:14, fontSize:26
          }}>🚢</div>
          <h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'var(--text)', letterSpacing:'-0.5px'}}>
            ImportTrack
          </h1>
          <p style={{fontSize:13, color:'var(--text2)', marginTop:4}}>China → Argentina · Seguimiento en tiempo real</p>
        </div>

        {/* Card */}
        <div className="card" style={{padding:'28px 24px'}}>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:16}}>
            <div>
              <label style={{fontSize:13, color:'var(--text2)', display:'block', marginBottom:6}}>Email</label>
              <input className="input" type="email" placeholder="tu@empresa.com" value={email}
                onChange={e => setEmail(e.target.value)} required/>
            </div>
            <div>
              <label style={{fontSize:13, color:'var(--text2)', display:'block', marginBottom:6}}>Contraseña</label>
              <input className="input" type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required/>
            </div>
            {error && (
              <div style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#f87171'}}>
                {error}
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{textAlign:'center', fontSize:12, color:'var(--text2)', marginTop:20}}>
          ¿No tenés acceso? Contactá al administrador maestro.
        </p>
      </div>
    </div>
  )
}
