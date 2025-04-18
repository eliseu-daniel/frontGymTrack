import React from "react";
import './Menu.css'

export function Menu() {
   return(
        <div className="menu">
            <div className="buttonSidebar">
                <a className="iconSidebar" href="sidebar">
                    <img src="././public/icon/menu-bar.svg" alt="menu bar" />   
                </a>
                <h1 className="buttonSidebar h1">MENU</h1>
            </div>
            <div className="nav">
                <ul>
                    <li>
                        <a href="#dashboard">DASHBOARD</a>
                    </li>
                    <li>
                        <a href="#antropometria">ANTROPOMETIA</a>
                    </li>
                    <li>
                        <a href="#dieta">DIETAS</a>
                    </li>
                    <li>
                        <a href="#paciente">PACIENTES</a>
                    </li>
                    <li>
                        <a href="#treino">TREINOS</a>
                    </li>
                    <li>
                        <a href="#relatorio">RELATÓRIOS</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}