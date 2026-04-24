'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { STAGES, Import, ImportItem, AppUser } from '@/lib/types'
import { StageIcon } from '@/components/StageIcon'
import { useRouter } from 'next/navigation'

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function leadTime(purchase?: string, arrival?: string): number | null {
  if (!purchase || !arrival) return null
  const diff = new Date(arrival).getTime() - new Date(purchase).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function SeaTimeline({ imp }: { imp: Import }) {
  if (imp.stage < 3 || imp.stage > 4) return null
  const days = daysUntil(imp.estimated_arrival)
  const lt = leadTime(imp.purchase_date, imp.estimated_arrival)
  const purchaseDate = new Date(imp.purchase_date)
  const arrivalDate = imp.estimated_arrival ? new Date(imp.estimated_arrival) : null
  const now = new Date()
  const total = arrivalDate ? arrivalDate.getTime() - purchaseDate.getTime() : 0
  const elapsed = now.getTime() - purchaseDate.getTime()
  const pct = total > 0 ? Math.min(95, Math.max(5, (elapsed / total) * 100)) : 50

  return (
    <div style={{background:'rgba(6,182,212,0.06)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:16}}>
      <div style={{fontSize:12, color:'#67e8f9', fontWeight:600, marginBottom:12, textTransform:'uppercase' as const, letterSpacing:'0.5px'}}>
        🌊 Travesía marítima {imp.vessel_name && `· ${imp.vessel_name}`}
      </div>
      <div style={{position:'relative', height:44, marginBottom:8}}>
        <div style={{position:'absolute', top:20, left:20, right:20, height:4, background:'rgba(6,182,212,0.15)', borderRadius:2}}/>
        <div style={{position:'absolute', top:20, left:20, width:`calc(${pct}% - 20px)`, height:4, background:'linear-gradient(90deg,#0891b2,#06b6d4)', borderRadius:2}}/>
        <div style={{position:'absolute', top:4, left:`calc(${pct}% - 12px)`, fontSize:26, filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'}}>🚢</div>
        <div style={{position:'absolute', top:10, left:0, fontSize:20}}>🇨🇳</div>
        <div style={{position:'absolute', top:6, right:0, display:'flex', gap:1}}>
          <span style={{fontSize:18}}>🚩</span>
          <span style={{fontSize:18}}>🚩</span>
          <span style={{fontSize:20}}>🇦🇷</span>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text2)'}}>
        <span>China</span>
        <span style={{color:'#67e8f9', fontWeight:600}}>
          {days !== null
            ? days > 0 ? `📍 Usted está aquí · Llega en ${days} días`
            : days === 0 ? '🎯 ¡Llega hoy!'
            : `✅ Llegó hace ${Math.abs(days)} días`
            : '📍 En tránsito'}
        </span>
        <span>Argentina</span>
      </div>
      {imp.container_number && (
        <div style={{marginTop:8, fontSize:11, color:'var(--text2)', textAlign:'center'}}>
          🗃 Contenedor: <span style={{color:'var(--text)', fontFamily:'monospace'}}>{imp.container_number}</span>
        </div>
      )}
      {lt && <div style={{textAlign:'center', fontSize:11, color:'var(--text2)', marginTop:4}}>Lead time total: {lt} días</div>}
    </div>
  )
}

function ItemsList({ items, canEdit, importId, onRefresh, supabase }: {
  items: ImportItem[]
  canEdit: boolean
  importId: string
  onRefresh: () => void
  supabase: ReturnType<typeof createClient>
}) {
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [code, setCode] = useState('')
  const [desc, setDesc] = useState('')
  const [qty, setQty] = useState('1')
  const [saving, setSaving] = useState(false)

  async function addItem() {
    if (!code || !desc) return
    setSaving(true)
    await supabase.from('import_items').insert({ import_id: importId, code, description: desc, quantity: parseInt(qty) || 1 })
    setCode(''); setDesc(''); setQty('1'); setAdding(false); setSaving(false)
    onRefresh()
  }

  async function removeItem(id: string) {
    await supabase.from('import_items').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div style={{marginBottom:16}}>
      <button onClick={() => setOpen(!open)} style={{width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text)', fontSize:13, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', minHeight:44}}>
        <span>📦 Items ({items.length})</span>
        <span style={{fontSize:16, transition:'transform .2s', display:'inline-block', transform:open?'rotate(180deg)':'rotate(0deg)'}}>▾</span>
      </button>
      {open && (
        <div style={{border:'1px solid var(--border)', borderTop:'none', borderRadius:'0 0 10px 10px', padding:12, background:'var(--bg3)'}}>
          {items.length === 0 && <p style={{fontSize:12, color:'var(--text2)', textAlign:'center', padding:'8px 0'}}>Sin items cargados</p>}
          {items.map(item => (
            <div key={item.id} style={{display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:11, padding:'2px 7px', borderRadius:6, background:'rgba(79,142,247,0.15)', color:'#93c5fd', fontFamily:'monospace', flexShrink:0}}>{item.code}</span>
              <span style={{fontSize:13, color:'var(--text)', flex:1}}>{item.description}</span>
              <span style={{fontSize:12, color:'var(--text2)', flexShrink:0}}>×{item.quantity}</span>
              {canEdit && <button onClick={() => removeItem(item.id)} style={{background:'none', border:'none', color:'#f87171', cursor:'pointer', fontSize:18, padding:2, flexShrink:0, lineHeight:1}}>×</button>}
            </div>
          ))}
          {canEdit && !adding && (
            <button onClick={() => setAdding(true)} style={{width:'100%', marginTop:8, padding:'8px', borderRadius:8, border:'1px dashed var(--border)', background:'transparent', color:'var(--text2)', fontSize:12, cursor:'pointer', minHeight:36}}>
              + Agregar item
            </button>
          )}
          {adding && (
            <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:8}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 60px', gap:6}}>
                <input className="input" placeholder="Código" value={code} onChange={e => setCode(e.target.value)} style={{fontSize:12, padding:'8px'}}/>
                <input className="input" placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} style={{fontSize:12, padding:'8px'}}/>
                <input className="input" placeholder="Cant" value={qty} onChange={e => setQty(e.target.value)} style={{fontSize:12, padding:'8px'}} type="number" min="1"/>
              </div>
              <div style={{display:'flex', gap:6}}>
                <button onClick={() => setAdding(false)} style={{flex:1, padding:'8px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:12, cursor:'pointer'}}>Cancelar</button>
                <button onClick={addItem} disabled={saving} style={{flex:2, padding:'8px', borderRadius:8, border:'none', background:'var(--accent)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer'}}>
                  {saving ? '...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [imports, setImports] = useState<Import[]>([])
  const [selected, setSelected] = useState<Import | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    setUser(profile)
    const { data: imps } = await supabase.from('imports').select('*, items:import_items(*)').order('created_at', { ascending: false })
    setImports(imps || [])
    setLoading(false)
  }, [supabase, router])

  useEffect(() => { loadData() }, [loadData])

  async function signOut() { await supabase.auth.signOut(); router.push('/login') }

  async function updateStage(imp: Import, stage: number) {
    if (user?.role === 'empleado') return
    setSaving(true)
    await supabase.from('imports').update({ stage }).eq('id', imp.id)
    setImports(prev => prev.map(i => i.id === imp.id ? { ...i, stage } : i))
    setSelected(prev => prev?.id === imp.id ? { ...prev, stage } : prev)
    setSaving(false)
  }

  async function deleteImport(id: string) {
    if (!confirm('Borrar esta importacion?')) return
    await supabase.from('imports').delete().eq('id', id)
    setImports(prev => prev.filter(i => i.id !== id))
    setSelected(null)
  }

  const refreshSelected = useCallback(async () => {
    if (!selected) return
    const { data } = await supabase.from('imports').select('*, items:import_items(*)').eq('id', selected.id).single()
    if (data) { setSelected(data); setImports(prev => prev.map(i => i.id === data.id ? data : i)) }
  }, [selected, supabase])

  const canEdit = user?.role === 'admin' || user?.role === 'maestro'
  const isMaestro = user?.role === 'maestro'

  if (loading) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, color:'var(--text2)'}}>
      <div style={{fontSize:36}}>🚢</div><span>Cargando...</span>
    </div>
  )

  return (
    <div style={{minHeight:'100vh', background:'var(--bg)', paddingBottom:20}}>
      <nav className="nav-safe" style={{background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'0 16px', minHeight:52, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <span style={{fontSize:20}}>🚢</span>
          <span className="nav-title" style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17}}>ImportTrack</span>
          <span style={{padding:'2px 7px', borderRadius:20, background:user?.role==='maestro'?'rgba(139,92,246,0.2)':user?.role==='admin'?'rgba(79,142,247,0.2)':'rgba(34,197,94,0.15)', color:user?.role==='maestro'?'#a78bfa':user?.role==='admin'?'#93c5fd':'#86efac', fontSize:10, fontWeight:700, textTransform:'uppercase' as const}}>{user?.role}</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {isMaestro && <button className="nav-btn touch-target" onClick={() => router.push('/maestro')} style={{padding:'6px 12px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:13, cursor:'pointer'}}>Usuarios</button>}
          {canEdit && <button className="nav-btn touch-target" onClick={() => setShowAdd(true)} style={{padding:'6px 14px', borderRadius:8, border:'none', background:'var(--accent)', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer'}}>+ Nueva</button>}
          <button className="nav-btn touch-target" onClick={signOut} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:13, cursor:'pointer'}}>Salir</button>
        </div>
      </nav>

      <div style={{padding:'16px', maxWidth:1100, margin:'0 auto'}}>
        <div style={{marginBottom:16}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:600}}>Importaciones activas</h2>
          <p style={{fontSize:13, color:'var(--text2)', marginTop:3}}>Hola, {user?.name} · {imports.length} en seguimiento</p>
        </div>

        {imports.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 0', color:'var(--text2)'}}>
            <div style={{fontSize:48, marginBottom:12}}>📭</div>
            <p>No hay importaciones.</p>
            {canEdit && <p style={{fontSize:13, marginTop:6}}>Toca + Nueva para agregar.</p>}
          </div>
        ) : (
          <div className="imports-grid">
            {imports.map(imp => {
              const st = STAGES[imp.stage]
              const days = daysUntil(imp.estimated_arrival)
              const lt = leadTime(imp.purchase_date, imp.estimated_arrival)
              return (
                <div key={imp.id} onClick={() => setSelected(imp)}
                  style={{background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:14, cursor:'pointer', transition:'border-color .15s'}}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = st.color}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
                >
                  <div style={{display:'flex', justifyContent:'center', marginBottom:10}}>
                    <StageIcon stage={imp.stage} size={64}/>
                  </div>
                  <div style={{fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:3, lineHeight:1.3}}>{imp.name}</div>
                  <div style={{fontSize:11, color:'var(--text2)', marginBottom:6}}>{imp.supplier}</div>
                  {imp.vessel_name && <div style={{fontSize:10, color:'var(--text2)', marginBottom:4}}>🚢 {imp.vessel_name}</div>}
                  {imp.container_number && <div style={{fontSize:10, color:'var(--text2)', marginBottom:6, fontFamily:'monospace'}}>🗃 {imp.container_number}</div>}
                  <div style={{display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:20, fontSize:10, fontWeight:600, background:st.color+'22', color:st.color, border:`1px solid ${st.color}44`}}>
                    {st.label}
                  </div>
                  {days !== null && (
                    <div style={{fontSize:11, marginTop:6, color:days <= 7 && days >= 0 ? '#fbbf24' : 'var(--text2)', fontWeight:days <= 7 && days >= 0 ? 600 : 400}}>
                      {days > 0 ? `🗓 Llega en ${days}d` : days === 0 ? '🎯 ¡Hoy!' : `✅ Hace ${Math.abs(days)}d`}
                    </div>
                  )}
                  {lt && <div style={{fontSize:10, color:'var(--text2)', marginTop:2}}>Lead time: {lt}d</div>}
                  {imp.items && imp.items.length > 0 && <div style={{fontSize:10, color:'var(--text2)', marginTop:4}}>📦 {imp.items.length} items</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-wrap" onClick={() => setSelected(null)}>
          <div className="modal-box safe-bottom" onClick={e => e.stopPropagation()}>
            <div style={{width:40, height:4, background:'var(--border)', borderRadius:2, margin:'12px auto 0'}}/>
            <div style={{padding:'16px 20px 24px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4}}>
                <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600}}>{selected.name}</h2>
                <button onClick={() => setSelected(null)} style={{background:'none', border:'none', color:'var(--text2)', fontSize:24, cursor:'pointer', padding:4}}>×</button>
              </div>
              <p style={{fontSize:13, color:'var(--text2)', marginBottom:16}}>{selected.supplier}</p>

              <SeaTimeline imp={selected}/>

              <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
                <StageIcon stage={selected.stage} size={80}/>
              </div>

              {/* Info grid */}
              {(selected.estimated_arrival || selected.vessel_name || selected.container_number) && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16}}>
                  {selected.estimated_arrival && (
                    <div style={{background:'var(--bg3)', borderRadius:10, padding:'10px 12px'}}>
                      <div style={{fontSize:10, color:'var(--text2)', marginBottom:3}}>ARRIBO EST.</div>
                      <div style={{fontSize:13, fontWeight:600}}>{new Date(selected.estimated_arrival).toLocaleDateString('es-AR')}</div>
                    </div>
                  )}
                  {selected.estimated_arrival && (
                    <div style={{background:'var(--bg3)', borderRadius:10, padding:'10px 12px'}}>
                      <div style={{fontSize:10, color:'var(--text2)', marginBottom:3}}>LEAD TIME</div>
                      <div style={{fontSize:13, fontWeight:600}}>{leadTime(selected.purchase_date, selected.estimated_arrival) ?? '–'} días</div>
                    </div>
                  )}
                  {selected.vessel_name && (
                    <div style={{background:'var(--bg3)', borderRadius:10, padding:'10px 12px'}}>
                      <div style={{fontSize:10, color:'var(--text2)', marginBottom:3}}>MADRE</div>
                      <div style={{fontSize:13, fontWeight:600}}>{selected.vessel_name}</div>
                    </div>
                  )}
                  {selected.container_number && (
                    <div style={{background:'var(--bg3)', borderRadius:10, padding:'10px 12px'}}>
                      <div style={{fontSize:10, color:'var(--text2)', marginBottom:3}}>CONTENEDOR</div>
                      <div style={{fontSize:13, fontWeight:600, fontFamily:'monospace'}}>{selected.container_number}</div>
                    </div>
                  )}
                </div>
              )}

              <ItemsList items={selected.items || []} canEdit={canEdit} importId={selected.id} onRefresh={refreshSelected} supabase={supabase}/>

              {canEdit && (
                <>
                  <p style={{fontSize:11, color:'var(--text2)', fontWeight:600, marginBottom:10, textTransform:'uppercase' as const, letterSpacing:'0.5px'}}>Cambiar estado</p>
                  <div className="stage-grid">
                    {STAGES.map(st => (
                      <button key={st.id} onClick={() => updateStage(selected, st.id)} disabled={saving}
                        style={{padding:'10px 8px', borderRadius:10, border:`1px solid ${selected.stage===st.id?st.color:'var(--border)'}`, background:selected.stage===st.id?st.color+'22':'var(--bg3)', color:selected.stage===st.id?st.color:'var(--text2)', fontSize:11, fontWeight:selected.stage===st.id?600:400, cursor:'pointer', textAlign:'left' as const, display:'flex', alignItems:'center', gap:6, minHeight:44}}>
                        <StageIcon stage={st.id} size={20}/>
                        <span style={{lineHeight:1.2}}>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p style={{fontSize:11, color:'var(--text2)', fontWeight:600, margin:'16px 0 10px', textTransform:'uppercase' as const, letterSpacing:'0.5px'}}>Progreso</p>
              <div style={{display:'flex', flexDirection:'column'}}>
                {STAGES.map((st, i) => {
                  const done = i < selected.stage
                  const curr = i === selected.stage
                  const pend = i > selected.stage
                  return (
                    <div key={i} style={{display:'flex', alignItems:'flex-start', gap:10, paddingBottom:10, position:'relative'}}>
                      {i < STAGES.length-1 && <div style={{position:'absolute', left:7, top:18, width:2, height:'calc(100% - 8px)', background:done?st.color:'var(--border)'}}/>}
                      <div style={{width:16, height:16, borderRadius:'50%', flexShrink:0, marginTop:2, background:curr?st.color:done?'#4b5563':'transparent', border:`2px solid ${curr?st.color:done?'#4b5563':'var(--border)'}`, boxShadow:curr?`0 0 0 3px ${st.color}33`:'none', zIndex:1}}/>
                      <span style={{fontSize:13, color:pend?'var(--text2)':'var(--text)', fontWeight:curr?600:400}}>
                        {st.label} {curr && <span style={{fontSize:11, color:st.color}}>← actual</span>}
                      </span>
                    </div>
                  )
                })}
              </div>

              {isMaestro && (
                <div style={{marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)'}}>
                  <button onClick={() => deleteImport(selected.id)} style={{padding:'10px 16px', borderRadius:8, border:'1px solid rgba(239,68,68,0.4)', background:'rgba(239,68,68,0.08)', color:'#f87171', fontSize:13, cursor:'pointer', minHeight:44}}>
                    Borrar importacion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAdd && canEdit && (
        <AddImportModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); loadData() }} supabase={supabase}/>
      )}
    </div>
  )
}

function AddImportModal({ onClose, onSaved, supabase }: { onClose: () => void; onSaved: () => void; supabase: ReturnType<typeof createClient> }) {
  const [name, setName] = useState('')
  const [supplier, setSupplier] = useState('')
  const [stage, setStage] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [arrival, setArrival] = useState('')
  const [vessel, setVessel] = useState('')
  const [container, setContainer] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!name || !supplier) return alert('Completa producto y proveedor')
    setSaving(true)
    await supabase.from('imports').insert({
      name, supplier, stage,
      purchase_date: date,
      estimated_arrival: arrival || null,
      vessel_name: vessel || null,
      container_number: container || null,
      notes: notes || null
    })
    onSaved()
  }

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-box safe-bottom" onClick={e => e.stopPropagation()}>
        <div style={{width:40, height:4, background:'var(--border)', borderRadius:2, margin:'12px auto 0'}}/>
        <div style={{padding:'16px 20px 24px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
            <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600}}>Nueva importacion</h2>
            <button onClick={onClose} style={{background:'none', border:'none', color:'var(--text2)', fontSize:24, cursor:'pointer', padding:4}}>×</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Producto *</label>
                <input className="input" placeholder="Camaras de seguridad" value={name} onChange={e => setName(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Proveedor *</label>
                <input className="input" placeholder="Hikvision Co." value={supplier} onChange={e => setSupplier(e.target.value)}/>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Fecha compra</label>
                <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Arribo estimado</label>
                <input className="input" type="date" value={arrival} onChange={e => setArrival(e.target.value)}/>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Madre (buque)</label>
                <input className="input" placeholder="MSC Pamela" value={vessel} onChange={e => setVessel(e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>N° contenedor</label>
                <input className="input" placeholder="MSCU1234567" value={container} onChange={e => setContainer(e.target.value)} style={{fontFamily:'monospace'}}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Estado inicial</label>
              <select className="input" value={stage} onChange={e => setStage(Number(e.target.value))}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12, color:'var(--text2)', display:'block', marginBottom:6}}>Notas</label>
              <textarea className="input" rows={2} placeholder="Orden de compra, contacto..." value={notes} onChange={e => setNotes(e.target.value)} style={{resize:'none'}}/>
            </div>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:4}}>
              <button onClick={onClose} style={{padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', color:'var(--text2)', fontSize:14, cursor:'pointer', minHeight:48}}>Cancelar</button>
              <button className="btn-primary" onClick={save} disabled={saving} style={{width:'auto', padding:'12px 24px', minHeight:48}}>
                {saving ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
