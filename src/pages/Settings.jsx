import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Settings() {
  const nav = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      password: "",
    });
  }, [user]);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };

      const passwordChanged = form.password.trim().length > 0;

      if (passwordChanged) {
        payload.password = form.password.trim();
      }

      const response = await api.put(`/educators/educators/${user.id}`, payload);

      const updatedUser = response.data?.educator || response.data;
      setUser(updatedUser);

      alert("Configurações atualizadas com sucesso.");

      if (passwordChanged) {
        logout();
        nav("/login");
      }
    } catch (error) {
      alert("Não foi possível atualizar as configurações.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    nav(-1);
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Configurações
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-base font-serif">
                Nome Completo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Telefone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Senha
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Digite apenas se quiser alterar"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
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
              className="w-full rounded-xl bg-blue-500 text-white px-6 py-2 text-base hover:bg-sf-green disabled:opacity-60 md:w-80"
            >
              {saving ? "Atualizando..." : "ATUALIZAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}