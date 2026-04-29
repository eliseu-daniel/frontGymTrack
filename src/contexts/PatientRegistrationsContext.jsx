import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const PatientRegistrationsContext = createContext();

function getToken() {
  return localStorage.getItem("token") || "";
}

export function PatientRegistrationsProvider({ children }) {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchRegistrations() {
    const token = getToken();

    if (!token) {
      setRegistrations([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/educators/patient-registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });


      const normalized = Array.isArray(response.data?.["Matrículas:"])
        ? response.data["Matrículas:"]
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      if (Array.isArray(normalized) && normalized.length > 0) {
        const keySet = Array.from(
          new Set(normalized.flatMap((r) => Object.keys(r || {})))
        );
      }

      setRegistrations(normalized);
    } catch (error) {
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [user]);

  return (
    <PatientRegistrationsContext.Provider
      value={{
        registrations,
        loading,
        fetchRegistrations,
      }}
    >
      {children}
    </PatientRegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  return useContext(PatientRegistrationsContext);
}