import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/app.css";

export default function Sidebar() {
    const { user } = useApp();

    return (
        <aside className="siderbar">
            <div className="sidebar-header">
                <Link to="/" className="logo-link">
                    <h1 className="text-xl font-bold mb-6">
                        <img src="/logo.jpeg" alt="SynchroFit Logo" className="logo" />
                        SynchroFit
                    </h1>
                </Link>
            </div>

            <Link to="/" className="sidebar-item">
                <img src="/icons/dashboard.png" className="icon-sidebar" />
                Dashboard</Link>
            <Link to="/pacientes" className="sidebar-item">
                <img src="/icons/paciente.png" className="icon-sidebar" />
                Pacientes</Link>
            <Link to="/treinos" className="sidebar-item">
                <img src="/icons/treino.png" className="icon-sidebar" />
                Treinos</Link>
            <Link to="/dietas" className="sidebar-item">
                <img src="/icons/dieta.png" className="icon-sidebar" />
                Dietas</Link>
            <Link to="/antropometrias" className="sidebar-item">
                <img src="/icons/antropometria.png" className="icon-sidebar" />
                Antropometrias</Link>
            <Link to="/feedbacks" className="sidebar-item">
                <img src="/icons/feedback.png" className="icon-sidebar" />
                Feedbacks</Link>
            <Link to="/relatorios" className="sidebar-item">
                <img src="/icons/relatorio.png" className="icon-sidebar" />
                Relatórios</Link>

        </aside>

    );
}