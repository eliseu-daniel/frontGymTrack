import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const { login, authLoading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const ok = await login(email, senha);

    if (ok) {
      nav("/dashboard");
    } else {
      alert("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="text-white flex flex-col gap-40">
      <div className="text-center font-serif text-2xl mt-48 uppercase">
        Login
      </div>

      <div>
        <form onSubmit={onSubmit} className="p-0 m-0">
          <label className="block">
            <div className="text-lg mb-2">E-mail:</div>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                className="w-full h-9 rounded pl-8 pr-2 mb-5 text-black text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>
          </label>

          <label className="block">
            <div className="text-lg mb-2">Senha:</div>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute left-2 top-1/4 -translate-y-1/2 text-gray-500"
              />
              <input
                type="password"
                className="w-full h-9 rounded pl-8 pr-2 mb-8 text-black text-sm"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>
          </label>

          <button
            disabled={authLoading}
            className="w-full h-7 rounded bg-sf-greenDark mb-5 text-white text-sm shadow-soft disabled:opacity-60"
            type="submit"
          >
            {authLoading ? "ENTRANDO..." : "ENTRAR"}
          </button>

          <div className="text-center text-sm opacity-90">
            <Link to="/cadastro" className="underline">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}