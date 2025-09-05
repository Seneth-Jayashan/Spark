import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const OrgContext = createContext();

export const useOrg = () => useContext(OrgContext);

export const OrgProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create organization
  const createOrganization = async (formData) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/organization/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

// Create organization
  const fetchLoggedUserOrg = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/organization/my");
      setOrganizations(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch organization");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/organization");
      setOrganizations(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single organization by ID
  const fetchOrganization = async (org_id) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/organization/${org_id}`);
      setCurrentOrg(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch organization");
    } finally {
      setLoading(false);
    }
  };

  // Update organization
  const updateOrganization = async (org_id, formData) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.put(`/organization/${org_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOrganizations((prev) =>
        prev.map((org) => (org.org_id === org_id ? response.data : org))
      );
      setCurrentOrg(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete organization
  const deleteOrganization = async (org_id) => {
    try {
      setLoading(true);
      setError("");
      await api.delete(`/organization/${org_id}`);
      setOrganizations((prev) => prev.filter((org) => org.org_id !== org_id));
      if (currentOrg?.org_id === org_id) setCurrentOrg(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
