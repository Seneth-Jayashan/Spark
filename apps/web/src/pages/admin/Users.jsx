import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers({ role = "volunteer" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_address: "",
    user_phone_number: "",
    user_password: "",
    user_profile_picture: null,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/auth/all`, { params: { role } });
      setUsers(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch users";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const downloadCsv = () => {
    const base = import.meta.env.VITE_API_URL;
    const url = `${base}/auth/export${role ? `?role=${encodeURIComponent(role)}` : ""}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (user_id) => {
    if (!confirm(`Are you sure you want to delete this ${role}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/auth/delete`, { params: { id: user_id } });
      setUsers((prev) => prev.filter((u) => u.user_id !== user_id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({
      user_first_name: "",
      user_last_name: "",
      user_email: "",
      user_address: "",
      user_phone_number: "",
      user_password: "",
      user_profile_picture: null,
    });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      user_first_name: u.user_first_name || "",
      user_last_name: u.user_last_name || "",
      user_email: u.user_email || "",
      user_address: u.user_address || "",
      user_phone_number: u.user_phone_number || "",
      user_password: "",
      user_profile_picture: null,
    });
    setShowForm(true);
  };

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("user_first_name", form.user_first_name);
      fd.append("user_last_name", form.user_last_name);
      fd.append("user_email", form.user_email);
      fd.append("user_address", form.user_address);
      fd.append("user_phone_number", form.user_phone_number);
      if (!editingUser) {
        fd.append("user_password", form.user_password);
        fd.append("user_role", role);
      } else {
        fd.append("userId", String(editingUser.user_id));
      }
      if (form.user_profile_picture) {
        fd.append("user_profile_picture", form.user_profile_picture);
      }

      if (editingUser) {
        await api.put("/auth/update", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/auth/signup", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      volunteer: "Volunteer",
      admin: "Administrator",
      donor: "Donor",
      partner: "Partner"
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-amber-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{getRoleDisplayName(role)} Management</h2>
          <p className="text-gray-600 mt-1">Manage all {role.toLowerCase()} accounts and information</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={openCreate} 
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {getRoleDisplayName(role)}
          </button>
          <button 
            onClick={downloadCsv} 
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button 
            onClick={fetchUsers} 
            className="px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white/90 backdrop-blur rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-900 border-t-transparent"></div>
            <span>Loading {role.toLowerCase()}s...</span>
          </div>
        </div>
      ) : (
        /* Users Table */
        <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, idx) => (
                <tr 
                  key={u.user_id} 
                  className={`transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-blue-50/80 group`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{u.user_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-900 text-xs font-semibold">
                            {u.user_first_name?.[0]}{u.user_last_name?.[0]}
                          </span>
                        </div>
                      
                      <div>
                        <div className="text-gray-900 font-semibold group-hover:text-blue-900 transition-colors">
                          {u.user_first_name} {u.user_last_name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{u.user_role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={`mailto:${u.user_email}`} 
                      className="text-blue-900 hover:text-blue-700 transition-colors"
                    >
                      {u.user_email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {u.user_phone_number ? (
                      <a 
                        href={`tel:${u.user_phone_number}`}
                        className="hover:text-blue-900 transition-colors"
                      >
                        {u.user_phone_number}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      String(u.user_status).toLowerCase() === "active"
                        ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                        : String(u.user_status).toLowerCase() === "inactive"
                        ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                        : "bg-slate-100 text-slate-700 border-slate-200 shadow-sm"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        String(u.user_status).toLowerCase() === "active" 
                          ? "bg-green-500" 
                          : String(u.user_status).toLowerCase() === "inactive"
                          ? "bg-amber-500"
                          : "bg-slate-500"
                      }`}></span>
                      {u.user_status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEdit(u)} 
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg transition-all duration-200 flex items-center gap-1 text-xs font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(u.user_id)} 
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-xs font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-gray-500 font-medium mb-1">No {role.toLowerCase()}s found</h3>
              <p className="text-gray-400 text-sm mb-4">Get started by adding your first {role.toLowerCase()}</p>
              <button 
                onClick={openCreate} 
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add {getRoleDisplayName(role)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingUser ? `Edit ${getRoleDisplayName(role)}` : `Add New ${getRoleDisplayName(role)}`}
                </h3>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={submitForm} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input 
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                      name="user_first_name" 
                      placeholder="First name" 
                      value={form.user_first_name} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input 
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                      name="user_last_name" 
                      placeholder="Last name" 
                      value={form.user_last_name} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="user_email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={form.user_email} 
                    onChange={onChange} 
                    required 
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="user_address" 
                    placeholder="Full address" 
                    value={form.user_address} 
                    onChange={onChange} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="user_phone_number" 
                    placeholder="+1 (555) 123-4567" 
                    value={form.user_phone_number} 
                    onChange={onChange} 
                  />
                </div>

                {/* Security */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Security</h4>
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input 
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                      name="user_password" 
                      type="password" 
                      placeholder="Create a secure password" 
                      value={form.user_password} 
                      onChange={onChange} 
                      required 
                    />
                  </div>
                )}

                {/* Profile Picture */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Profile Picture</h4>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100" 
                    name="user_profile_picture" 
                    type="file" 
                    accept="image/*" 
                    onChange={onChange} 
                  />
                  <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 500x500 pixels or larger</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}