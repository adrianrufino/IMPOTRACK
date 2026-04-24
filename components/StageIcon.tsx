'use client'
import React from 'react'

const SIZE = 72

export function StageIcon({ stage, size = SIZE }: { stage: number; size?: number }) {
  const s = size
  const style: React.CSSProperties = { width: s, height: s, display: 'block' }

  switch (stage) {
    // 0 — Fábrica con humo y engranaje
    case 0: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* smoke */}
        <ellipse cx="28" cy="14" rx="4" ry="5" fill="#94a3b8" style={{animation:'smoke 2s ease-in-out infinite'}}/>
        <ellipse cx="44" cy="10" rx="3" ry="4" fill="#94a3b8" style={{animation:'smoke 2s ease-in-out infinite .5s'}}/>
        {/* building */}
        <rect x="10" y="28" width="52" height="30" rx="2" fill="#334155"/>
        <rect x="14" y="22" width="10" height="36" rx="1" fill="#475569"/>
        <rect x="30" y="18" width="10" height="40" rx="1" fill="#475569"/>
        {/* windows */}
        <rect x="16" y="32" width="6" height="6" rx="1" fill="#f59e0b" style={{animation:'shelf-glow 2s infinite'}}/>
        <rect x="50" y="32" width="6" height="6" rx="1" fill="#f59e0b" style={{animation:'shelf-glow 2s infinite .4s'}}/>
        {/* gear */}
        <g style={{transformOrigin:'54px 46px', animation:'gear-spin 3s linear infinite'}}>
          <circle cx="54" cy="46" r="7" fill="none" stroke="#f59e0b" strokeWidth="2.5"/>
          <line x1="54" y1="37" x2="54" y2="55" stroke="#f59e0b" strokeWidth="2.5"/>
          <line x1="45" y1="46" x2="63" y2="46" stroke="#f59e0b" strokeWidth="2.5"/>
          <line x1="47.6" y1="38.6" x2="60.4" y2="53.4" stroke="#f59e0b" strokeWidth="2.5"/>
          <line x1="60.4" y1="38.6" x2="47.6" y2="53.4" stroke="#f59e0b" strokeWidth="2.5"/>
          <circle cx="54" cy="46" r="3" fill="#f59e0b"/>
        </g>
        {/* ground */}
        <rect x="8" y="58" width="56" height="3" rx="1.5" fill="#1e293b"/>
      </svg>
    )

    // 1 — Pallet con cajas embaladas
    case 1: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* pallet */}
        <rect x="10" y="55" width="52" height="6" rx="2" fill="#92400e"/>
        <rect x="14" y="53" width="5" height="10" rx="1" fill="#78350f"/>
        <rect x="33" y="53" width="5" height="10" rx="1" fill="#78350f"/>
        <rect x="52" y="53" width="5" height="10" rx="1" fill="#78350f"/>
        {/* boxes bounce */}
        <g style={{animation:'pack-bounce 1.8s ease-in-out infinite'}}>
          <rect x="12" y="36" width="20" height="17" rx="2" fill="#3b82f6"/>
          <rect x="35" y="36" width="24" height="17" rx="2" fill="#2563eb"/>
          <rect x="20" y="22" width="28" height="15" rx="2" fill="#60a5fa"/>
          {/* straps */}
          <line x1="22" y1="36" x2="22" y2="53" stroke="#1d4ed8" strokeWidth="1.5"/>
          <line x1="48" y1="36" x2="48" y2="53" stroke="#1d4ed8" strokeWidth="1.5"/>
          <line x1="12" y1="44" x2="59" y2="44" stroke="#1d4ed8" strokeWidth="1.5"/>
        </g>
      </svg>
    )

    // 2 — Mula con carga
    case 2: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        <g style={{animation:'mule-walk 1.2s ease-in-out infinite'}}>
          {/* body */}
          <ellipse cx="36" cy="44" rx="20" ry="10" fill="#92400e"/>
          {/* head */}
          <ellipse cx="55" cy="36" rx="8" ry="6" fill="#a16207"/>
          {/* ears */}
          <rect x="54" y="29" width="3" height="6" rx="1.5" fill="#92400e"/>
          <rect x="59" y="30" width="3" height="5" rx="1.5" fill="#92400e"/>
          {/* eye */}
          <circle cx="57" cy="35" r="1.5" fill="#1c1917"/>
          {/* legs */}
          <rect x="18" y="52" width="5" height="12" rx="2" fill="#78350f"/>
          <rect x="26" y="54" width="5" height="10" rx="2" fill="#78350f"/>
          <rect x="42" y="54" width="5" height="10" rx="2" fill="#78350f"/>
          <rect x="50" y="52" width="5" height="12" rx="2" fill="#78350f"/>
          {/* load/box on back */}
          <rect x="22" y="30" width="26" height="14" rx="3" fill="#f59e0b"/>
          <line x1="35" y1="30" x2="35" y2="44" stroke="#d97706" strokeWidth="1.5"/>
          <line x1="22" y1="37" x2="48" y2="37" stroke="#d97706" strokeWidth="1.5"/>
          {/* tail */}
          <path d="M16 42 Q10 38 12 32" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </g>
        {/* ground */}
        <rect x="4" y="64" width="64" height="2" rx="1" fill="#374151"/>
      </svg>
    )

    // 3 — Barco en el mar
    case 3: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* waves */}
        <g style={{animation:'wave 2s ease-in-out infinite'}}>
          <path d="M4 54 Q12 50 20 54 Q28 58 36 54 Q44 50 52 54 Q60 58 68 54" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
        <g style={{animation:'wave 2s ease-in-out infinite .5s'}}>
          <path d="M4 60 Q12 56 20 60 Q28 64 36 60 Q44 56 52 60 Q60 64 68 60" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
        {/* ship body */}
        <g style={{animation:'ship-sail 3s ease-in-out infinite'}}>
          <path d="M14 46 L16 56 L56 56 L58 46 Z" fill="#1e40af"/>
          <rect x="22" y="34" width="28" height="12" rx="1" fill="#1d4ed8"/>
          {/* containers */}
          <rect x="24" y="36" width="7" height="8" rx="1" fill="#ef4444"/>
          <rect x="33" y="36" width="7" height="8" rx="1" fill="#f59e0b"/>
          <rect x="42" y="36" width="7" height="8" rx="1" fill="#22c55e"/>
          {/* mast + flag */}
          <line x1="36" y1="16" x2="36" y2="36" stroke="#94a3b8" strokeWidth="2"/>
          <polygon points="36,16 50,22 36,28" fill="#ef4444"/>
        </g>
      </svg>
    )

    // 4 — Barco llegando al puerto
    case 4: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* lighthouse beacon */}
        <g style={{transformOrigin:'60px 28px', animation:'beacon 1.5s ease-in-out infinite'}}>
          <circle cx="60" cy="28" r="6" fill="rgba(251,191,36,0.3)"/>
          <circle cx="60" cy="28" r="3" fill="#fbbf24"/>
        </g>
        {/* dock */}
        <rect x="52" y="38" width="16" height="20" rx="1" fill="#374151"/>
        <rect x="54" y="35" width="3" height="26" rx="1" fill="#4b5563"/>
        <rect x="60" y="32" width="3" height="4" rx="1" fill="#6b7280"/>
        {/* ship arriving */}
        <g style={{animation:'arrive 3s ease-in-out infinite alternate'}}>
          <path d="M6 46 L8 54 L44 54 L46 46 Z" fill="#1e40af"/>
          <rect x="12" y="36" width="26" height="10" rx="1" fill="#1d4ed8"/>
          <rect x="14" y="38" width="6" height="6" rx="1" fill="#ef4444"/>
          <rect x="22" y="38" width="6" height="6" rx="1" fill="#22c55e"/>
          <rect x="30" y="38" width="6" height="6" rx="1" fill="#f59e0b"/>
          <line x1="25" y1="22" x2="25" y2="36" stroke="#94a3b8" strokeWidth="2"/>
          <polygon points="25,22 36,27 25,32" fill="#ef4444"/>
        </g>
        {/* waves */}
        <path d="M4 58 Q14 55 24 58 Q34 61 44 58" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeLinecap="round" style={{animation:'wave 2s infinite'}}/>
      </svg>
    )

    // 5 — Aduana: hombre con planilla
    case 5: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* warehouse bg */}
        <rect x="6" y="20" width="60" height="46" rx="3" fill="#1e293b"/>
        <rect x="6" y="20" width="60" height="8" rx="3" fill="#334155"/>
        {/* boxes */}
        <rect x="10" y="42" width="14" height="12" rx="2" fill="#3b82f6"/>
        <rect x="12" y="56" width="18" height="8" rx="2" fill="#2563eb"/>
        {/* person */}
        <circle cx="50" cy="30" r="6" fill="#fbbf24"/>
        <rect x="44" y="38" width="12" height="16" rx="3" fill="#475569"/>
        <rect x="42" y="42" width="5" height="10" rx="2" fill="#475569"/>
        <rect x="54" y="42" width="5" height="10" rx="2" fill="#475569"/>
        <rect x="46" y="54" width="4" height="8" rx="2" fill="#374151"/>
        <rect x="51" y="54" width="4" height="8" rx="2" fill="#374151"/>
        {/* clipboard */}
        <g style={{animation:'stamp 2s ease-in-out infinite'}}>
          <rect x="55" y="38" width="10" height="13" rx="2" fill="#f8fafc"/>
          <rect x="59" y="36" width="4" height="4" rx="1" fill="#94a3b8"/>
          <line x1="57" y1="44" x2="63" y2="44" stroke="#94a3b8" strokeWidth="1.5"/>
          <line x1="57" y1="47" x2="63" y2="47" stroke="#94a3b8" strokeWidth="1.5"/>
        </g>
        {/* stamp mark */}
        <g style={{animation:'check 2s ease-in-out infinite'}}>
          <circle cx="16" cy="52" r="5" fill="none" stroke="#22c55e" strokeWidth="2"/>
          <path d="M13 52 L15 54 L19 50" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </g>
      </svg>
    )

    // 6 — Camión en ruta
    case 6: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        <g style={{animation:'truck-move 1.5s ease-in-out infinite'}}>
          {/* trailer */}
          <rect x="4" y="32" width="40" height="22" rx="3" fill="#334155"/>
          <rect x="6" y="34" width="36" height="18" rx="2" fill="#1e40af"/>
          {/* cab */}
          <rect x="44" y="38" width="22" height="16" rx="3" fill="#374151"/>
          <path d="M44 46 L54 38 L66 38 L66 46 Z" fill="#4b5563"/>
          {/* window */}
          <rect x="54" y="40" width="10" height="8" rx="2" fill="#7dd3fc"/>
          {/* light */}
          <circle cx="65" cy="52" r="2" fill="#fbbf24"/>
          {/* cargo text on trailer */}
          <rect x="8" y="38" width="10" height="7" rx="1" fill="#ef4444"/>
          <rect x="20" y="38" width="10" height="7" rx="1" fill="#f59e0b"/>
          <rect x="32" y="38" width="8" height="7" rx="1" fill="#22c55e"/>
        </g>
        {/* wheels */}
        <g style={{transformOrigin:'18px 57px', animation:'wheel-spin 1s linear infinite'}}>
          <circle cx="18" cy="57" r="7" fill="#1c1917" stroke="#4b5563" strokeWidth="2"/>
          <line x1="18" y1="50" x2="18" y2="64" stroke="#6b7280" strokeWidth="1.5"/>
          <line x1="11" y1="57" x2="25" y2="57" stroke="#6b7280" strokeWidth="1.5"/>
        </g>
        <g style={{transformOrigin:'48px 57px', animation:'wheel-spin 1s linear infinite'}}>
          <circle cx="48" cy="57" r="7" fill="#1c1917" stroke="#4b5563" strokeWidth="2"/>
          <line x1="48" y1="50" x2="48" y2="64" stroke="#6b7280" strokeWidth="1.5"/>
          <line x1="41" y1="57" x2="55" y2="57" stroke="#6b7280" strokeWidth="1.5"/>
        </g>
        <g style={{transformOrigin:'60px 57px', animation:'wheel-spin 1s linear infinite'}}>
          <circle cx="60" cy="57" r="7" fill="#1c1917" stroke="#4b5563" strokeWidth="2"/>
          <line x1="60" y1="50" x2="60" y2="64" stroke="#6b7280" strokeWidth="1.5"/>
          <line x1="53" y1="57" x2="67" y2="57" stroke="#6b7280" strokeWidth="1.5"/>
        </g>
        {/* road */}
        <rect x="0" y="64" width="72" height="4" rx="0" fill="#374151"/>
        <rect x="10" y="65" width="8" height="2" rx="1" fill="#fbbf24"/>
        <rect x="32" y="65" width="8" height="2" rx="1" fill="#fbbf24"/>
        <rect x="54" y="65" width="8" height="2" rx="1" fill="#fbbf24"/>
      </svg>
    )

    // 7 — Depósito con tilde animado
    case 7: return (
      <svg style={style} viewBox="0 0 72 72" fill="none">
        {/* building */}
        <path d="M6 28 L36 12 L66 28 L66 64 L6 64 Z" fill="#1e293b"/>
        <path d="M6 28 L36 12 L66 28 Z" fill="#334155"/>
        {/* door */}
        <rect x="28" y="46" width="16" height="18" rx="2" fill="#374151"/>
        <circle cx="38" cy="55" r="1.5" fill="#6b7280"/>
        {/* shelves */}
        <rect x="10" y="36" width="14" height="10" rx="1" fill="#2d3748"/>
        <rect x="48" y="36" width="14" height="10" rx="1" fill="#2d3748"/>
        {/* boxes on shelves */}
        <rect x="11" y="38" width="5" height="6" rx="1" fill="#3b82f6" style={{animation:'shelf-glow 2s infinite'}}/>
        <rect x="17" y="38" width="5" height="6" rx="1" fill="#ef4444" style={{animation:'shelf-glow 2s infinite .3s'}}/>
        <rect x="49" y="38" width="5" height="6" rx="1" fill="#f59e0b" style={{animation:'shelf-glow 2s infinite .6s'}}/>
        <rect x="55" y="38" width="5" height="6" rx="1" fill="#22c55e" style={{animation:'shelf-glow 2s infinite .9s'}}/>
        {/* big checkmark */}
        <circle cx="36" cy="36" r="12" fill="rgba(34,197,94,0.15)"/>
        <svg x="24" y="24" width="24" height="24" viewBox="0 0 24 24">
          <polyline
            points="4,12 10,18 20,6"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="30"
            style={{animation:'checkmark 1s ease forwards'}}
          />
        </svg>
      </svg>
    )

    default: return <div style={{...style, fontSize:36, display:'flex', alignItems:'center', justifyContent:'center'}}>📦</div>
  }
}
