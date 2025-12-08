import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useApp } from "../context/AppContext";

export default function NovoTreino() {
    const { pacienteSelecionado } = useApp();

    const [exercicios, setExercicios] = useState([
        { id: 1, nome: "Supino Reto", series: 4, reps: 12, carga: "20kg", descanso: "60s" },
    ]);

    const adicionar = () => {
        setExercicios([
            ...exercicios,
            {
                id: Date.now(),
                nome: "Novo Exercício",
                series: 3,
                reps: 10,
                carga: "10kg",
                descanso: "45s",
            },
        ]);
    };

    const remover = (id: number) => {
        setExercicios(exercicios.filter((e) => e.id !== id));
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-6">Novo Treino</h2>

                {pacienteSelecionado ? (
                    <p className="mb-4">
                        Criando treino para: <b>{pacienteSelecionado.nome}</b>
                    </p>
                ) : (
                    <p className="mb-4 text-red-500">Nenhum paciente selecionado.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="card">
                        <h3 className="font-bold mb-3">Configuração</h3>

                        <input className="w-full p-2 border rounded mb-3" placeholder="Data Início" />
                        <input className="w-full p-2 border rounded mb-3" placeholder="Data Fim" />

                        <select className="w-full p-2 border rounded mb-3">
                            <option>Hipertrofia</option>
                            <option>Resistência</option>
                            <option>Força</option>
                        </select>
                    </div>

                    <div className="card">
                        <h3 className="font-bold mb-3">Lista de Exercícios</h3>

                        <div className="flex flex-col gap-3">
                            {exercicios.map((e) => (
                                <div key={e.id} className="border p-3 rounded">
                                    <div className="font-bold mb-1">{e.nome}</div>

                                    <div className="text-sm">
                                        Séries: {e.series} | Reps: {e.reps} | Carga: {e.carga} | Descanso: {e.descanso}
                                    </div>

                                    <button
                                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                                        onClick={() => remover(e.id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="mt-4 px-4 py-2 bg-primary text-white rounded"
                            onClick={adicionar}
                        >
                            + Adicionar Exercício
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}