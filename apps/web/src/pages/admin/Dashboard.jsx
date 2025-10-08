import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    organizations: 0,
    volunteers: 0,
    orgAdmins: 0,
    usersTotal: 0,
  })

  const fetchCounts = async () => {
    try {
      setLoading(true)
      setError('')

      // Organizations
      let orgCount = 0
      try {
        const orgRes = await api.get('/organization')
        orgCount = Array.isArray(orgRes.data?.organizations) ? orgRes.data.organizations.length : 0
      } catch (e) {
        orgCount = 0
      }

      // Volunteers
      let volCount = 0
      try {
        const vRes = await api.get('/auth/all', { params: { role: 'volunteer' } })
        volCount = Array.isArray(vRes.data) ? vRes.data.length : 0
      } catch (e) {
        volCount = 0
      }

      // Org Admins (role = organizer)
      let orgAdminCount = 0
      try {
        const aRes = await api.get('/auth/all', { params: { role: 'organizer' } })
        orgAdminCount = Array.isArray(aRes.data) ? aRes.data.length : 0
      } catch (e) {
        orgAdminCount = 0
      }

      // Total users
      let usersTotal = 0
      try {
        const uRes = await api.get('/auth/all')
        usersTotal = Array.isArray(uRes.data) ? uRes.data.length : 0
      } catch (e) {
        usersTotal = volCount + orgAdminCount
      }

      setStats({
        organizations: orgCount,
        volunteers: volCount,
        orgAdmins: orgAdminCount,
        usersTotal,
      })
    } catch (err) {
      setError('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-amber-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview and quick actions</p>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white/90 backdrop-blur p-5 shadow border">
          <div className="text-gray-500">Organizations</div>
          <div className="text-3xl font-semibold">{loading ? '—' : stats.organizations}</div>
        </div>
        <div className="rounded-xl bg-white/90 backdrop-blur p-5 shadow border">
          <div className="text-gray-500">Volunteers</div>
          <div className="text-3xl font-semibold">{loading ? '—' : stats.volunteers}</div>
        </div>
        <div className="rounded-xl bg-white/90 backdrop-blur p-5 shadow border">
          <div className="text-gray-500">Org Admins</div>
          <div className="text-3xl font-semibold">{loading ? '—' : stats.orgAdmins}</div>
        </div>
        <div className="rounded-xl bg-white/90 backdrop-blur p-5 shadow border">
          <div className="text-gray-500">Users Total</div>
          <div className="text-3xl font-semibold">{loading ? '—' : stats.usersTotal}</div>
        </div>
      </div>

      <div className="rounded-xl bg-white/90 backdrop-blur p-5 shadow border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <button onClick={fetchCounts} className="px-3 py-2 bg-white border border-gray-200 rounded-lg">Refresh</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <a href="/dashboard/admin/organizations" className="block p-4 rounded-lg border hover:bg-blue-50">Manage Organizations</a>
          <a href="/dashboard/admin/users" className="block p-4 rounded-lg border hover:bg-blue-50">Manage Volunteers</a>
          <a href="/dashboard/admin/admins" className="block p-4 rounded-lg border hover:bg-blue-50">Manage Org Admins</a>
          <a href="/dashboard/admin/contactus" className="block p-4 rounded-lg border hover:bg-blue-50">Contact Messages</a>
        </div>
      </div>
    </div>
  )
}
