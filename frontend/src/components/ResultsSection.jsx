import React from 'react'
import AnimalCard from './AnimalCard'

const SORT_OPTIONS = [
  { value: 'name',     label: 'Nome' },
  { value: 'lifespan', label: 'Expectativa de vida' },
  { value: 'class',    label: 'Classe' },
  { value: 'family',   label: 'Família' },
  { value: 'order',    label: 'Ordem' },
]

function LoadingDots() {
  return (
    <div className="flex justify-center gap-2 py-20">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function ResultsSection({ results, count, loading, error, searched, sortBy, onSortChange }) {
  if (loading) return <LoadingDots />

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4 opacity-40">⚠️</div>
        <p className="font-display italic text-white/50 text-lg mb-2">Erro na busca</p>
        <p className="font-mono text-xs text-red-400/70">{error}</p>
      </div>
    )
  }

  if (!searched) {
    return (
      <div className="text-center py-20 text-muted">
        <div className="text-5xl mb-4 opacity-30">🔍</div>
        <p className="font-display italic text-white/40 text-xl mb-2">Nenhuma busca realizada</p>
        <p className="font-mono text-xs">Preencha ao menos um campo e clique em Pesquisar</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <div className="text-5xl mb-4 opacity-30">🐾</div>
        <p className="font-display italic text-white/40 text-xl mb-2">Nenhum animal encontrado</p>
        <p className="font-mono text-xs">Tente outros filtros ou deixe mais campos em branco</p>
      </div>
    )
  }

  return (
    <div>
      {/* status bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border flex-wrap gap-3">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent font-medium text-sm">{count}</span>{' '}
          animal{count !== 1 ? 'is' : ''} encontrado{count !== 1 ? 's' : ''}
        </p>

        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span>Ordenar por</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="
                bg-card border border-border text-white text-xs
                pl-3 pr-8 py-2 rounded-sm outline-none appearance-none
                font-mono cursor-pointer
                focus:border-accent
              "
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-[10px]">▾</span>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-16">
        {results.map((animal, i) => (
          <AnimalCard key={`${animal.name}-${i}`} animal={animal} index={i} />
        ))}
      </div>
    </div>
  )
}
