import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../screens/Dashboard";
import Pacientes from "../screens/Pacientes";
import NovoTreino from "../screens/NovoTreino";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/novo-treino" element={<NovoTreino />} />
            </Routes>
        </BrowserRouter>
    );
}