import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function AnthropometryWeightUpdate() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");

  const [form, setForm] = useState({
    weight: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    async function fetchAnthropometry() {
      try {
        setLoadingPage(true);

        const response = await api.get(`/educators/anthropometrys/${id}`);
        const data = response.data?.data ?? response.data ?? {};

        setPatientName(data.name ?? "Paciente");
        setPatientId(data.patient_id ?? "");
      } catch (error) {
        alert("Não foi possível carregar os dados.");
        nav("/antropometria");
      } finally {
        setLoadingPage(false);
      }
    }

    fetchAnthropometry();
  }, [id, nav]);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.weight) {
      alert("Informe o peso.");
      return;
    }

    if (!patientId) {
      alert("Paciente não encontrado.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/educators/patient-weights", {
        patient_id: Number(patientId),
        weight: Number(form.weight),
        current_date: form.date,
      });

      alert("Peso atualizado com sucesso.");
      nav("/antropometria");
    } catch (error) {
      alert("Não foi possível salvar o peso.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    nav("/antropometria");
  }

  if (loadingPage) {
    return <div className="text-[12px]">Carregando...</div>;
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Atualizar Peso
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-base font-serif">Paciente</label>
            <input
              type="text"
              value={patientName}
              disabled
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-base font-serif">
                Novo Peso
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.weight}
                onChange={(e) =>
                  setField("weight", normalizeDecimalInput(e.target.value))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Digite o peso"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Data da Medição
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>
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
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}