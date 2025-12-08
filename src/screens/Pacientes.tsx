import Sidebar from "../components/Sidebar";
import { useApp } from "../context/AppContext";


const patients = [
    { id: 1, nome: "João Silva", email: "joao@email.com", plano: "Mensal", status: "Ativo" },
    { id: 2, nome: "Maria Souza", email: "maria@email.com", plano: "Mensal", status: "Ativo" },
    { id: 3, nome: "Pedro Henrique", email: "pedro@email.com", plano: "Trimestral", status: "Ativo" },
];


export default function Pacientes() {
    const { setPacienteSelecionado } = useApp();


    return (
        <div className="flex min-h-screen">
            <Sidebar />


            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-6">Pacientes</h2>


                <div className="card overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nome</th>
                                <th className="p-2">E-mail</th>
                                <th className="p-2">Plano</th>
                                <th className="p-2">Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{p.nome}</td>
                                    <td className="p-2">{p.email}</td>
                                    <td className="p-2">{p.plano}</td>
                                    <td className="p-2">{p.status}</td>
                                    <td className="p-2">
                                        <button
                                            className="px-3 py-1 bg-primary text-white rounded"
                                            onClick={() => setPacienteSelecionado(p)}
                                        >
                                            Selecionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}