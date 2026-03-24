import React from 'react'

function Tag({ children, variant = 'default' }) {
  const base = 'font-mono text-[11px] px-2 py-1 rounded-sm border whitespace-nowrap'
  const variants = {
    default: 'bg-tagbg border-border text-white/80',
    diet:    'bg-tagbg border-accent/30 text-accent',
    life:    'bg-tagbg border-accent2/30 text-accent2 text-xs px-2.5 py-1.5',
  }
  return <span className={`${base} ${variants[variant]}`}>{children}</span>
}

function TaxonRow({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-widest uppercase text-muted mb-0.5">{label}</div>
      <div className="text-sm text-white/90">{value || '—'}</div>
    </div>
  )
}

export default function AnimalCard({ animal, index = 0 }) {
  const behaviors = (animal.behavior || '').split(',').map(t => t.trim()).filter(Boolean)
  const diets     = (animal.diet     || '').split(',').map(t => t.trim()).filter(Boolean)

  const delay = Math.min(index * 0.04, 0.5)

  return (
    <div
      className="
        relative bg-card border border-border rounded overflow-hidden
        transition-all duration-300
        hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/50
        animate-fade-up opacity-0
      "
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {/* left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-accent2 opacity-60" />

      <div className="p-5 pl-6">
        {/* header */}
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-white leading-tight mb-1">
            {animal.name}
          </h3>
          <p className="font-mono text-[11px] text-accent/80 italic">{animal.species}</p>
        </div>

        {/* taxonomy grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-white/[0.02] border border-border rounded-sm mb-4">
          <TaxonRow label="Reino"   value={animal.kingdom} />
          <TaxonRow label="Filo"    value={animal.phylum}  />
          <TaxonRow label="Classe"  value={animal.class}   />
          <TaxonRow label="Ordem"   value={animal.order}   />
          <TaxonRow label="Família" value={animal.family}  />
          <TaxonRow label="Gênero"  value={animal.genus}   />
        </div>

        {/* info rows */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-muted mb-1.5">
              Expectativa de vida
            </div>
            <Tag variant="life">{animal.lifespan}</Tag>
          </div>

          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-muted mb-1.5">
              Comportamento
            </div>
            <div className="flex flex-wrap gap-1.5">
              {behaviors.map((b, i) => <Tag key={i}>{b}</Tag>)}
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-muted mb-1.5">
              Dieta
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diets.map((d, i) => <Tag key={i} variant="diet">{d}</Tag>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
