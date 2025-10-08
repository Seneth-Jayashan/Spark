import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

function Organizations() {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const API_URL = import.meta.env.VITE_API_URL || ''
  let uploadsBase = ''
  try {
    const u = new URL(API_URL)
    uploadsBase = `${u.protocol}//${u.host}`
  } catch {
    uploadsBase = API_URL.split('/').slice(0, 3).join('/')
  }

  const buildLogoSrc = (raw) => {
    if (!raw) return ''
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
    let key = raw.replace(/^\/+/, '')
    key = key.replace(/^uploads\//, '')
    return `${uploadsBase}/uploads/${key}`
  }

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/organization')
        setOrgs(res.data?.organizations || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch organizations')
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  const availableTypes = useMemo(() => {
    const types = new Set()
    orgs.forEach((o) => {
      if (o?.org_type) types.add(o.org_type)
    })
    return Array.from(types)
  }, [orgs])

  const filteredOrgs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orgs.filter((o) => {
      const matchesType = typeFilter === 'all' || o.org_type === typeFilter
      if (!q) return matchesType
      const hay = [o.org_name, o.org_type, o.industry, o.org_description, o.website, o.contact_email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesType && hay.includes(q)
    })
  }, [orgs, search, typeFilter])

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto mt-8">
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900">Organizations</h1>
          <p className="text-gray-600 mt-2">Discover organizations registered on Spark</p>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, industry, or description"
              className="w-full rounded-xl border border-gray-300 bg-white/80 backdrop-blur px-4 py-2.5 pr-10 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              aria-label="Search organizations"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white/80 backdrop-blur px-4 py-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            aria-label="Filter by organization type"
          >
            <option value="all">All types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {!loading && !error && (
          <div className="mt-3 text-sm text-gray-600">{filteredOrgs.length} results</div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="mt-4 h-12 bg-gray-200 rounded" />
              <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">ℹ</div>
          <p className="text-gray-800 font-medium">No organizations match your filters.</p>
          <p className="text-gray-600 text-sm mt-1">Try adjusting your search or selecting a different type.</p>
          {(search || typeFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('all') }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((o) => {
            const Card = (
              <div
                key={o.org_id}
                className="group bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  {o.org_logo ? (
                    <img src={buildLogoSrc(o.org_logo)} alt={o.org_name} className="w-16 h-16 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-50 border flex items-center justify-center text-blue-900 font-bold">
                      {o.org_name?.[0] || 'O'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{o.org_name}</h3>
                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                      {o.org_type && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-900 border border-blue-100 text-xs">{o.org_type}</span>
                      )}
                      {o.industry && <span className="text-gray-400">•</span>}
                      {o.industry && <span>{o.industry}</span>}
                    </div>
                  </div>
                </div>
                {o.org_description && (
                  <p className="text-sm text-gray-700 mt-3 line-clamp-3">{o.org_description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  {o.contact_email && (
                    <a href={`mailto:${o.contact_email}`} className="hover:text-blue-900 truncate">{o.contact_email}</a>
                  )}
                  {o.contact_phone && (
                    <span className="ml-auto text-gray-700">{o.contact_phone}</span>
                  )}
                </div>
                {o.website && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 text-sm text-blue-900 group-hover:underline">
                      Visit website ↗
                    </span>
                  </div>
                )}
              </div>
            )
            return o.website ? (
              <a key={o.org_id} href={o.website} target="_blank" rel="noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-2xl">{Card}</a>
            ) : (
              <div key={o.org_id}>{Card}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Organizations
