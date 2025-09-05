import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const OrgContext = createContext();

export const useOrg = () => useContext(OrgContext);

export const OrgProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]); // all orgs
  const [currentOrg, setCurrentOrg] = useState(null);      // logged-in user's org
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set token once on mount
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ----------------------------
  // Fetch logged-in user's org
  // ----------------------------
  const fetchLoggedUserOrg = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/organization/my");
      // Assuming API returns a single object:
      setCurrentOrg(response.data || null);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch organization");
      setCurrentOrg(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch all organizations
  // ----------------------------
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/organization");
      setOrganizations(response.data || []);
      return response.data;
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to fetch organizations";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch organization by ID
  // ----------------------------
  const fetchOrganization = async (org_id) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/organization/${org_id}`);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch organization");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Create organization
  // ----------------------------
  const createOrganization = async (formData) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/organization/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentOrg(response.data);
      setOrganizations((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Update organization
  // ----------------------------
  const updateOrganization = async (org_id, formData) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.put(`/organization/${org_id}`, formData);
      setCurrentOrg(response.data);
      setOrganizations((prev) =>
        prev.map((org) => (org.org_id === org_id ? response.data : org))
      );
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };



  // ----------------------------
  // Delete organization
  // ----------------------------
  const deleteOrganization = async (org_id) => {
    try {
      setLoading(true);
      setError("");
      await api.delete(`/organization/${org_id}`);
      if (currentOrg?.org_id === org_id) setCurrentOrg(null);
      setOrganizations((prev) => prev.filter((org) => org.org_id !== org_id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Load user's org once on mount
  // ----------------------------
  useEffect(() => {
    fetchLoggedUserOrg();
  }, []);

  return (
    <OrgContext.Provider
      value={{
        organizations,
        currentOrg,
        loading,
        error,
        createOrganization,
        fetchLoggedUserOrg,
        fetchOrganizations,
        fetchOrganization,
        updateOrganization,
        deleteOrganization,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};
