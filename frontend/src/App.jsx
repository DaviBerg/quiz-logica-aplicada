import React from 'react'
import Header from './components/Header'
import SearchForm from './components/SearchForm'
import ResultsSection from './components/ResultsSection'
import { useSearch } from './hooks/useSearch'

export default function App() {
  const {
    filters, updateFilter,
    results, rawCount,
    loading, error, searched,
    sortBy, setSortBy,
    runSearch, clearAll,
  } = useSearch()

  return (
    <div className="min-h-screen bg-bg grid-bg relative">
      {/* subtle radial glow at top */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
        style={{
          background: 'radial-gradient(ellipse at center top, #7fff6e 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <Header />

        <SearchForm
          filters={filters}
          onUpdate={updateFilter}
          onSearch={runSearch}
          onClear={clearAll}
          loading={loading}
        />

        <ResultsSection
          results={results}
          count={rawCount}
          loading={loading}
          error={error}
          searched={searched}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
    </div>
  )
}
