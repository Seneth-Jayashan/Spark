import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [form, setForm] = useState({
    org_name: "",
    org_description: "",
    org_type: "Other",
    industry: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    address: { street: "", city: "", state: "", postal_code: "", country: "" },
    social_links: { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" },
    org_logo: null,
  });

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/organization");
      const list = res.data?.organizations || [];
      setOrgs(list);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch organizations";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleDelete = async (org_id) => {
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) return;
    try {
      await api.delete(`/organization/${org_id}`);
      setOrgs((prev) => prev.filter((o) => o.org_id !== org_id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete organization");
    }
  };

  const openCreate = () => {
    setEditingOrg(null);
    setForm({
      org_name: "",
      org_description: "",
      org_type: "Other",
      industry: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      address: { street: "", city: "", state: "", postal_code: "", country: "" },
      social_links: { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" },
      org_logo: null,
    });
    setShowForm(true);
  };

  const openEdit = (o) => {
    setEditingOrg(o);
    setForm({
      org_name: o.org_name || "",
      org_description: o.org_description || "",
      org_type: o.org_type || "Other",
      industry: o.industry || "",
      contact_email: o.contact_email || "",
      contact_phone: o.contact_phone || "",
      website: o.website || "",
      address: o.address || { street: "", city: "", state: "", postal_code: "", country: "" },
      social_links: o.social_links || { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" },
      org_logo: null,
    });
    setShowForm(true);
  };

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));
    } else if (name.startsWith("social_links.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, social_links: { ...f.social_links, [key]: value } }));
    } else if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("org_name", form.org_name);
      fd.append("org_description", form.org_description);
      fd.append("org_type", form.org_type);
      fd.append("industry", form.industry);
      fd.append("contact_email", form.contact_email);
      fd.append("contact_phone", form.contact_phone);
      fd.append("website", form.website);
      fd.append("address", JSON.stringify(form.address));
      fd.append("social_links", JSON.stringify(form.social_links));
      if (form.org_logo) fd.append("org_logo", form.org_logo);

      if (editingOrg) {
        await api.put(`/organization/${editingOrg.org_id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post(`/organization/create`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setShowForm(false);
      await fetchOrgs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const downloadCsv = () => {
    const base = import.meta.env.VITE_API_URL;
    window.open(`${base}/organization/export`, "_blank");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-amber-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organizations</h2>
          <p className="text-gray-600 mt-1">Manage and organize all partner organizations</p>
        </div>
        <div className="flex flex-wrap gap-3">
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
            onClick={fetchOrgs} 
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
            <span>Loading organizations...</span>
          </div>
        </div>
      ) : (
        /* Organizations Table */
        <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orgs.map((o, idx) => (
                <tr 
                  key={o.org_id} 
                  className={`transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-blue-50/80 group`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{o.org_id}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-semibold group-hover:text-blue-900 transition-colors">
                      {o.org_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{o.org_type}</td>
                  <td className="px-6 py-4 text-gray-700">{o.industry}</td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${o.contact_email}`} className="text-blue-900 hover:text-blue-700 transition-colors">
                      {o.contact_email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{o.contact_phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      o.org_status
                        ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                        : "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        o.org_status ? "bg-green-500" : "bg-amber-500"
                      }`}></span>
                      {o.org_status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEdit(o)} 
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg transition-all duration-200 flex items-center gap-1 text-xs font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(o.org_id)} 
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
          {orgs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-gray-500 font-medium mb-1">No organizations found</h3>
              <p className="text-gray-400 text-sm mb-4">Get started by adding your first organization</p>
              <button 
                onClick={openCreate} 
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add Organization
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingOrg ? "Edit Organization" : "Add New Organization"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h4>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="org_name" 
                    placeholder="Enter organization name" 
                    value={form.org_name} 
                    onChange={onChange} 
                    required 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all resize-none" 
                    name="org_description" 
                    placeholder="Enter organization description" 
                    rows={3}
                    value={form.org_description} 
                    onChange={onChange} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="org_type" 
                    placeholder="Organization type" 
                    value={form.org_type} 
                    onChange={onChange} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="industry" 
                    placeholder="Industry" 
                    value={form.industry} 
                    onChange={onChange} 
                  />
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="contact_email" 
                    type="email" 
                    placeholder="contact@organization.com" 
                    value={form.contact_email} 
                    onChange={onChange} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="contact_phone" 
                    placeholder="+1 (555) 123-4567" 
                    value={form.contact_phone} 
                    onChange={onChange} 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="website" 
                    placeholder="https://example.com" 
                    value={form.website} 
                    onChange={onChange} 
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Address</h4>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="address.street" 
                    placeholder="Street address" 
                    value={form.address.street} 
                    onChange={onChange} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="address.city" 
                    placeholder="City" 
                    value={form.address.city} 
                    onChange={onChange} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="address.state" 
                    placeholder="State" 
                    value={form.address.state} 
                    onChange={onChange} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="address.postal_code" 
                    placeholder="Postal code" 
                    value={form.address.postal_code} 
                    onChange={onChange} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                    name="address.country" 
                    placeholder="Country" 
                    value={form.address.country} 
                    onChange={onChange} 
                  />
                </div>

                {/* Social Links */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Social Media</h4>
                </div>
                
                {Object.entries(form.social_links).map(([platform, value]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {platform}
                    </label>
                    <input 
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all" 
                      name={`social_links.${platform}`}
                      placeholder={`${platform} URL`}
                      value={value} 
                      onChange={onChange} 
                    />
                  </div>
                ))}

                {/* Logo Upload */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Logo</h4>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                  <input 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100" 
                    name="org_logo" 
                    type="file" 
                    accept="image/*" 
                    onChange={onChange} 
                  />
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
                  {editingOrg ? "Update Organization" : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}