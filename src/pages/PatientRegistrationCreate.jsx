import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../contexts/PatientsContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

function formatDateToInput(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateEndDate(startDate, planDescription) {
  if (!startDate || !planDescription) return "";

  const date = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  if (planDescription === "monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (planDescription === "quarterly") {
    date.setMonth(date.getMonth() + 3);
  } else if (planDescription === "semiannual") {
    date.setMonth(date.getMonth() + 6);
  } else {
    return "";
  }

  return formatDateToInput(date);
}

export default function PatientRegistrationCreate() {
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { patients, loading, fetchPatients } = usePatients();

  const patient = useMemo(
    () => (patients ?? []).find((p) => String(p.id ?? p.patient_id) === String(id)),
    [patients, id]
  );

  const [form, setForm] = useState({
    name: "",
    plan_description: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patients?.length) {
      fetchPatients();
    }
  }, [patients, fetchPatients]);

  useEffect(() => {
    if (!patient) return;

    setForm((prev) => ({
      ...prev,
      name: patient.name ?? patient.nome ?? "",
    }));
  }, [patient]);

  function setField(field, value) {
    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "start_date" || field === "plan_description") {
        const calculatedEndDate = calculateEndDate(
          field === "start_date" ? value : next.start_date,
          field === "plan_description" ? value : next.plan_description
        );

        next.end_date = calculatedEndDate;
        next.finalized_at = calculatedEndDate;
      }

      return next;
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setError("");

    const payload = {
      patient_id: Number(id),
      educator_id: user?.id ?? 1,
      plan_description: form.plan_description,
      start_date: form.start_date,
      end_date: form.end_date,
      finalized_at: form.finalized_at || null,
    };

    try {
      setSaving(true);
      await api.post("/educators/patient-registrations", payload);
      nav("/pacientes");
    } catch (err) {
      setError("Não foi possível cadastrar a matrícula.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Matrícula do Paciente
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        {error ? (
          <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading && !patient ? (
          <div className="text-[12px]">Carregando...</div>
        ) : (
          <form onSubmit={salvar} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-base font-serif">Nome</label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  value={form.name}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-serif">
                  Plano de Acompanhamento
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  value={form.plan_description}
                  onChange={(e) => setField("plan_description", e.target.value)}
                  required
                >
                  <option value="">Opções</option>
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="semiannual">Semestral</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-base font-serif">
                  Início do Acompanhamento
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  value={form.start_date}
                  onChange={(e) => setField("start_date", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-serif">
                  Fim do Acompanhamento
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  value={form.end_date}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-serif">
                  Finalização do Acompanhamento
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  value={form.finalized_at}
                  onChange={(e) => setField("finalized_at", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-4 md:flex-row">
              <button
                type="button"
                onClick={() => nav("/pacientes")}
                className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-sf-greenDark text-white px-6 py-2 text-base hover:bg-sf-green disabled:opacity-60 md:w-80"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}