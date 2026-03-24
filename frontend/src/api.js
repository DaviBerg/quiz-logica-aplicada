import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

/**
 * Search animals with optional taxonomic filters.
 * Empty string = wildcard (any).
 */
export async function searchAnimals(filters = {}) {
  const { data } = await api.post('/search', filters)
  return data
}

/**
 * Get all distinct values for a taxonomic rank.
 * @param {'kingdom'|'phylum'|'class'|'order'|'family'|'genus'|'species'} rank
 */
export async function getDistinctValues(rank) {
  const { data } = await api.get(`/distinct/${rank}`)
  return data
}

/**
 * Get overall stats (total animal count, etc.)
 */
export async function getStats() {
  const { data } = await api.get('/stats')
  return data
}
