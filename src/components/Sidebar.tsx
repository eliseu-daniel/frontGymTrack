import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Sidebar() {
    const { user } = useApp();


    return (
        <aside className="w-64 h-screen bg-secondary text-white p-4 flex flex-col gap-4">
            <h1 className="text-xl font-bold mb-6">SynchroFit</h1>


            <Link to="/" className="sidebar-item">Dashboard</Link>
            <Link to="/pacientes" className="sidebar-item">Pacientes</Link>
            <Link to="/novo-treino" className="sidebar-item">Novo Treino</Link>


            <div className="mt-auto opacity-70 text-sm">
                Logado como: {user?.nome}
            </div>
        </aside>
    );
}