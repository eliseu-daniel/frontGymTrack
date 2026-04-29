import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setServerError("");
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Informe o nome completo.";
    if (!form.email.trim()) newErrors.email = "Informe o e-mail.";
    if (!form.phone.trim()) newErrors.phone = "Informe o telefone.";
    if (!form.password) newErrors.password = "Informe a senha.";
    if (!form.password_confirmation) {
      newErrors.password_confirmation = "Confirme a senha.";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (
      form.password &&
      form.password_confirmation &&
      form.password !== form.password_confirmation
    ) {
      newErrors.password_confirmation = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.password_confirmation,
      };

      await api.post("/register", payload);

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      const responseErrors = error.response?.data?.errors;

      if (responseErrors) {
        const formattedErrors = {};
        Object.keys(responseErrors).forEach((key) => {
          formattedErrors[key] = responseErrors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        setServerError(
          error.response?.data?.message || "Não foi possível realizar o cadastro."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#D8D8D8] lg:flex-row">
      <aside className="w-full bg-[#D8D8D8] px-6 py-8 lg:min-h-screen lg:w-[16.666%] lg:px-8 lg:pt-10">
        <h1 className="font-serif text-3xl tracking-[0.18em] text-white sm:text-4xl">
          SYNCHRO FIT
        </h1>
      </aside>

      <main className="flex w-full flex-1 bg-[#28A745B3] px-5 py-8 sm:px-8 md:px-10 lg:min-h-screen lg:w-[66.666%] lg:px-10 lg:py-12 xl:px-14">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
          <h2 className="mb-10 text-center font-serif text-4xl tracking-[0.2em] text-white sm:mb-12 sm:text-5xl">
            CADASTRO
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-10"
          >
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="mb-2 block font-serif text-xl text-white sm:text-2xl">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="h-11 w-full rounded-md border border-white/20 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/30 sm:h-12 sm:text-lg"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-100">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-serif text-xl text-white sm:text-2xl">
                  E-mail:
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="h-11 w-full rounded-md border border-white/20 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/30 sm:h-12 sm:text-lg"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-100">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-serif text-xl text-white sm:text-2xl">
                  Telefone:
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="h-11 w-full rounded-md border border-white/20 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/30 sm:h-12 sm:text-lg"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-100">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
                <div>
                  <label className="mb-2 block font-serif text-xl text-white sm:text-2xl">
                    Senha:
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    className="h-11 w-full rounded-md border border-white/20 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/30 sm:h-12 sm:text-lg"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-100">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-serif text-xl text-white sm:text-2xl">
                    Confirmar Senha:
                  </label>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) =>
                      setField("password_confirmation", e.target.value)
                    }
                    className="h-11 w-full rounded-md border border-white/20 bg-white px-4 text-base text-slate-800 outline-none transition focus:border-[#008CFF] focus:ring-2 focus:ring-[#008CFF]/30 sm:h-12 sm:text-lg"
                  />
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-100">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {serverError && (
                <p className="text-base text-red-100">{serverError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 rounded-md border border-[#008CFF] bg-transparent px-6 font-serif text-xl text-white transition hover:bg-[#008CFF]/10 sm:h-12 sm:text-2xl"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-md bg-[#008CFF] px-6 font-serif text-xl text-white transition hover:brightness-110 disabled:opacity-70 sm:h-12 sm:text-2xl"
              >
                {loading ? "Cadastrando..." : "CADASTRAR"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <aside className="hidden bg-[#D8D8D8] lg:block lg:min-h-screen lg:w-[16.666%]" />
    </div>
  );
}
