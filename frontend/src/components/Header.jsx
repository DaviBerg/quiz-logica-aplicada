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
            // Base de Dados Taxonômica
          </p>
          <h1 className="font-display font-bold leading-[1.05] text-5xl lg:text-6xl">
            Ferramenta de Pesquisa <em className="italic text-accent not-italic">Taxonômica</em>
          </h1>
        </div>
      </div>
    </header>
  )
}
