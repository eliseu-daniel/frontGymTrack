import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function PatientCreate() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    nascimento: "",
    sexo: "",
    telefone: "",
    alergias: "",
    ativo: true,
  });

  const [loading, setLoading] = useState(false);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function salvar(e) {
    e.preventDefault();

    const payload = {
      name: form.nome,
      email: form.email,
      phone: form.telefone,
      birth_date: form.nascimento || null,
      gender: form.sexo || null,
      allergies: form.alergias || null,
      is_active: form.ativo,
    };

    try {
      setLoading(true);

      await api.post("/educators/patients", payload);

      nav("/pacientes");
    } catch (error) {
      alert("Não foi possível cadastrar o paciente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Cadastro de Pacientes
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <form onSubmit={salvar} className="space-y-5">
          <div>
            <label className="mb-1 block text-base font-serif">Nome</label>
            <input
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              value={form.nome}
              onChange={(e) => setField("nome", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-base font-serif">E-mail</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-base font-serif">Nascimento</label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                value={form.nascimento}
                onChange={(e) => setField("nascimento", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">Sexo</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                value={form.sexo}
                onChange={(e) => setField("sexo", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">Telefone</label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-base font-serif">Alergias</label>
            <textarea
              className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              value={form.alergias}
              onChange={(e) => setField("alergias", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="text-base font-serif">Inativo / Ativo</label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setField("ativo", e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <div className="flex flex-col justify-center gap-3 pt-3 md:flex-row">
            <button
              type="button"
              onClick={() => nav("/pacientes")}
              className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sf-greenDark text-white px-6 py-2 text-base hover:bg-sf-green disabled:opacity-60 md:w-80"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}