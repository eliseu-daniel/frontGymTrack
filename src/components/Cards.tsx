

export default function Cards() {
    return (
        <div className="card-principal">
            <div className="card">
                <p className="card-text">Total Pacientes Ativos</p>
                <h3 className="card-text card-text-number">42</h3>
            </div>
            <div className="card">
                <p className="card-text">Feedbacks de Treino</p>
                <h3 className="card-text card-text-number">5</h3>
            </div>
            <div className="card">
                <p className="card-text">Feedbacks de Dieta</p>
                <h3 className="card-text card-text-number">3</h3>
            </div>
        </div>
    );
}