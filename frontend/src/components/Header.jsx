import React, { useEffect, useState } from 'react'
import { getStats } from '../api'

export default function Header() {
  const [totalAnimals, setTotalAnimals] = useState(null)

  useEffect(() => {
    getStats()
      .then(data => setTotalAnimals(data.totalAnimals))
      .catch(() => setTotalAnimals('1787+'))
  }, [])

  return (
    <header className="border-b border-border mb-12 pb-10 pt-14">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent mb-2">
            // Taxonomic Database
          </p>
          <h1 className="font-display font-bold leading-[1.05] text-5xl lg:text-6xl">
            Animal <em className="italic text-accent not-italic">Explorer</em>
          </h1>
          <p className="font-mono text-xs text-muted mt-2">
            Search · Classify · Discover
          </p>
        </div>

        <div className="border border-border px-5 py-3 rounded-sm text-right">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-1">
            Animais no banco
          </p>
          <p className="font-mono text-2xl font-medium text-accent">
            {totalAnimals ?? '…'}
          </p>
        </div>
      </div>
    </header>
  )
}
