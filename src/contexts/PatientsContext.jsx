import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const PatientsContext = createContext(null);

function getToken() {
  return localStorage.getItem("token") || "";
}

export function PatientsProvider({ children }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPatients() {
    const token = getToken();

    if (!token) {
      setPatients([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/educators/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data =
        response.data?.patients ??
        response.data?.PatientsData ??
        response.data?.data ??
        response.data ??
        [];

      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  async function createPatient(payload) {
    const token = getToken();

    if (!token) throw new Error("Usuário não autenticado.");

    try {
      const response = await api.post("/educators/patients", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      await fetchPatients();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function updatePatient(id, payload) {
    const token = getToken();

    if (!token) throw new Error("Usuário não autenticado.");

    try {
      const response = await api.patch(`/educators/patients/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      await fetchPatients();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function deletePatient(id) {
    const token = getToken();

    if (!token) throw new Error("Usuário não autenticado.");

    try {
      const response = await api.delete(`/educators/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      await fetchPatients();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    if (user) {
      fetchPatients();
    } else {
      setPatients([]);
    }
  }, [user]);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        loading,
        fetchPatients,
        createPatient,
        updatePatient,
        deletePatient,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientsContext);

  if (!context) {
    throw new Error("usePatients deve ser usado dentro de PatientsProvider");
  }

  return context;
}