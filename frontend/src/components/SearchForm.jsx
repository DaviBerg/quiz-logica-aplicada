import React from 'react'

const FIELDS = [
  { key: 'kingdom', label: 'Reino',         placeholder: 'ex: Animalia' },
  { key: 'phylum',  label: 'Filo',          placeholder: 'ex: Chordata' },
  { key: 'class',   label: 'Classe',        placeholder: 'ex: Mammalia' },
  { key: 'order',   label: 'Ordem',         placeholder: 'ex: Carnivora' },
  { key: 'family',  label: 'Família',       placeholder: 'ex: Felidae' },
  { key: 'genus',   label: 'Gênero',        placeholder: 'ex: Panthera' },
  { key: 'species', label: 'Espécie',       placeholder: 'ex: Panthera leo' },
  { key: 'name',    label: 'Nome Comum',    placeholder: 'ex: Lion' },
]

export default function SearchForm({ filters, onUpdate, onSearch, onClear, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="relative bg-surface border border-border rounded overflow-hidden mb-12">
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent2 to-transparent" />

      <div className="p-8">
        <p className="font-display italic text-muted text-lg mb-6">
          Filtrar por nível taxonômico
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted">
                {label}
              </label>
              <input
                type="text"
                value={filters[key]}
                placeholder={placeholder}
                onChange={(e) => onUpdate(key, e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                  bg-card border border-border text-sm text-white
                  px-3 py-2.5 rounded-sm outline-none
                  placeholder:text-muted font-sans
                  transition-all duration-200
                  focus:border-accent focus:ring-2 focus:ring-accent/10
                "
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onSearch}
            disabled={loading}
            className="
              bg-accent text-bg font-mono text-xs tracking-widest uppercase
              px-7 py-3 rounded-sm cursor-pointer
              transition-all duration-200
              hover:bg-accent2 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>

          <button
            onClick={onClear}
            disabled={loading}
            className="
              bg-transparent text-muted border border-border
              font-mono text-xs tracking-widest uppercase
              px-5 py-3 rounded-sm cursor-pointer
              transition-all duration-200
              hover:text-white hover:border-muted
              disabled:opacity-50
            "
          >
            Limpar
          </button>

          <span className="ml-auto font-mono text-[11px] text-muted hidden sm:block">
            Deixe em branco para ignorar o campo
          </span>
        </div>
      </div>
    </div>
  )
}
