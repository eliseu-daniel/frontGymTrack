import React from "react";
import './LoginForm.css'

export function LoginForm() {
    return (
        <div className="namePrincipal">
            <h1>GYMTRACK</h1>
            <div className="form">
                <div className="form form-inputs">
                    <h1>LOGIN</h1>
                    <label htmlFor="e-mail">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="E-mail" />
                    <label htmlFor="senha">Senha</label>
                    <input type="password" name="senha" id="senha" placeholder="Senha" />
                    <input type="submit" value="ENTRAR" />
                    <a href="Cadastre.jsx">Cadastre-se</a>
                </div>
            </div>
        </div>
    )
}