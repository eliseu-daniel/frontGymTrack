import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";

export default function AnthropometryEdit() {
  const nav = useNavigate();
  const { id } = useParams();
  const { registrations = [], loading } = useRegistrations();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    weights_initial: "",
    height: "",
    body_fat: "",
    body_muscle: "",
    physical_activity_level: "",
    TMB: "",
    GET: "",
    lesions: "",
    active: true,
  });

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function normalizeDecimalInput(value) {
    return String(value ?? "")
      .replace(",", ".")
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
  }

  function formatDecimalForApi(value) {
    const normalized = String(value ?? "").replace(",", ".").trim();

    if (!normalized) return null;

    const numberValue = Number(normalized);

    if (Number.isNaN(numberValue)) return null;

    return Number(numberValue.toFixed(2));
  }

  function formatIntegerForApi(value) {
    const normalized = String(value ?? "").trim();

    if (!normalized) return null;

    const numberValue = Number(normalized);

    if (Number.isNaN(numberValue)) return null;

    return Math.trunc(numberValue);
  }

  function formatValueForInput(value) {
    if (value === null || value === undefined) return "";
    return String(value);
  }

  const registeredPatients = useMemo(() => {
    const normalized = (registrations ?? [])
      .map((item) => {
        const patientId =
          item.patient_id ??
          item.patient?.id ??
          item.id_patient ??
          null;

        const patientName =
          item.patient_name ??
          item.patient?.name ??
          item.name ??
          "Paciente sem nome";

        return {
          patient_id: patientId,
          patient_name: patientName,
        };
      })
      .filter((item) => item.patient_id);

    return normalized.filter(
      (item, index, self) =>
        index === self.findIndex((p) => p.patient_id === item.patient_id)
    );
  }, [registrations]);

  useEffect(() => {
    async function fetchAnthropometry() {
      try {
        setLoadingPage(true);

        const response = await api.get(`/educators/anthropometrys/${id}`);
        const data = response.data?.data;

        setForm({
          patient_id: formatValueForInput(
            data?.patient_id ?? data?.patient?.id ?? ""
          ),
          weights_initial: formatValueForInput(data?.weights_initial),
          height: formatValueForInput(data?.height),
          body_fat: formatValueForInput(data?.body_fat),
          body_muscle: formatValueForInput(data?.body_muscle),
          physical_activity_level: data?.physical_activity_level ?? "",
          TMB: formatValueForInput(data?.TMB),
          GET: formatValueForInput(data?.GET),
          lesions: data?.lesions ?? "",
          active:
            data?.is_active === undefined || data?.is_active === null
              ? true
              : Boolean(data?.is_active),
        });
      } catch (error) {
        alert("Não foi possível carregar os dados da antropometria.");
        nav("/antropometria");
      } finally {
        setLoadingPage(false);
      }
    }

    if (id) {
      fetchAnthropometry();
    }
  }, [id, nav]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      patient_id: formatIntegerForApi(form.patient_id),
      weights_initial: formatDecimalForApi(form.weights_initial),
      height: formatDecimalForApi(form.height),
      body_fat: formatDecimalForApi(form.body_fat),
      body_muscle: formatDecimalForApi(form.body_muscle),
      physical_activity_level: form.physical_activity_level,
      TMB: formatIntegerForApi(form.TMB),
      GET: formatIntegerForApi(form.GET),
      lesions: form.lesions?.trim() ? form.lesions.trim() : null,
    };

    try {
      setSaving(true);

      await api.post("/educators/anthropometrys", payload);
      await api.delete(`/educators/anthropometrys/${id}`);

      alert("Antropometria atualizada com sucesso.");
      nav("/antropometria");
    } catch (error) {
      alert("Não foi possível salvar a antropometria.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    nav("/antropometria");
  }

  if (loadingPage) {
    return (
      <div>
        <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
          Editar Antropometria
        </h1>

        <div className="bg-sf-panel rounded-md shadow-soft p-6 text-center text-base font-serif">
          Carregando dados...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Editar Antropometria
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-base font-serif">
              Nome Paciente
            </label>

            <select
              value={form.patient_id}
              onChange={(e) => setField("patient_id", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              required
            >
              <option value="">
                {loading
                  ? "Carregando pacientes matriculados..."
                  : "Selecione um paciente"}
              </option>

              {registeredPatients.map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.patient_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-base font-serif">Altura</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.height}
                onChange={(e) =>
                  setField("height", normalizeDecimalInput(e.target.value))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Peso Inicial
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.weights_initial}
                onChange={(e) =>
                  setField("weights_initial", normalizeDecimalInput(e.target.value))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Gordura Corporal
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.body_fat}
                onChange={(e) =>
                  setField("body_fat", normalizeDecimalInput(e.target.value))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Músculo Corporal
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.body_muscle}
                onChange={(e) =>
                  setField("body_muscle", normalizeDecimalInput(e.target.value))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-base font-serif">
                Nível de Atv. Física
              </label>
              <select
                value={form.physical_activity_level}
                onChange={(e) =>
                  setField("physical_activity_level", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              >
                <option value="">Selecione</option>
                <option value="light">Leve</option>
                <option value="moderate">Moderado</option>
                <option value="vigorous">Vigoroso</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Taxa Metabólica Basal
              </label>
              <input
                type="number"
                value={form.TMB}
                onChange={(e) => setField("TMB", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Gasto Energético Total
              </label>
              <input
                type="number"
                value={form.GET}
                onChange={(e) => setField("GET", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-base font-serif">Lesões</label>
            <textarea
              value={form.lesions}
              onChange={(e) => setField("lesions", e.target.value)}
              className="min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          <div className="flex flex-col justify-center gap-3 pt-3 md:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-sf-greenDark text-white px-6 py-2 text-base hover:bg-sf-green disabled:opacity-60 md:w-80"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}