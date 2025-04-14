import React from "react";
import './LoginForm.css'

export function LoginForm() {
    return (
        <div className="namePrincipal">
            <h1 className="titulo">GYMTRACK</h1>
            <main className="form">
                <div className="form form-inputs">
                    <div className="sub-titulo">
                        <h1 className="sub">LOGIN</h1>
                    </div>
                    <label htmlFor="e-mail">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="E-mail" />
                    <label htmlFor="senha">Senha</label>
                    <input type="password" name="senha" id="senha" placeholder="Senha" />
                    <input type="submit" value="ENTRAR" />
                    <a className="sub" href="Cadastre.jsx">Cadastre-se</a>
                </div>
            </main>
        </div>
    )
}