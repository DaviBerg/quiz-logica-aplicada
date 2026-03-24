import { useState, useCallback } from 'react'
import { searchAnimals } from '../api'

const EMPTY_FILTERS = {
  kingdom: '',
  phylum:  '',
  class:   '',
  order:   '',
  family:  '',
  genus:   '',
  species: '',
  name:    '',
}

export function useSearch() {
  const [filters, setFilters]   = useState({ ...EMPTY_FILTERS })
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState(null)
  const [searched, setSearched] = useState(false)
  const [sortBy,  setSortBy]    = useState('name')

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const res = await searchAnimals(filters)
      setResults(res.results || [])
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Erro desconhecido')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const clearAll = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS })
    setResults([])
    setSearched(false)
    setError(null)
  }, [])

  const sortedResults = [...results].sort((a, b) => {
    const va = (a[sortBy] || '').toLowerCase()
    const vb = (b[sortBy] || '').toLowerCase()
    return va.localeCompare(vb)
  })

  return {
    filters, updateFilter,
    results: sortedResults, rawCount: results.length,
    loading, error, searched,
    sortBy, setSortBy,
    runSearch, clearAll,
  }
}
