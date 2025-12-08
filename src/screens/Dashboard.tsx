import Sidebar from "../components/Sidebar";


export default function Dashboard() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="card"><p>Total Pacientes</p><h3 className="text-3xl font-bold">42</h3></div>
                    <div className="card"><p>Feedbacks Treino</p><h3 className="text-3xl font-bold">5</h3></div>
                    <div className="card"><p>Feedbacks Dieta</p><h3 className="text-3xl font-bold">3</h3></div>
                </div>


                <h3 className="text-lg font-semibold mb-3">Últimas Atividades</h3>
                <div className="card flex flex-col gap-3">
                    <div>João Silva enviou feedback do Treino A</div>
                    <div>Maria Souza completou a Dieta (Almoço)</div>
                    <div>Novo aluno matriculado: Pedro H</div>
                </div>
            </main>
        </div>
    );
}