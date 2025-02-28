// Função existente para o sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    sidebar.classList.toggle('active');
    toggleBtn.classList.toggle('sidebar-active');
}

// Dados simulados para usuários e pacientes
const usuarios = [
    { id: 1, nome: "Carlos Admin", email: "admin@gytrack.com", tipo: "admin", plano: "pago", pagamento: "sim" },
    { id: 2, nome: "Ana Educadora", email: "ana@gytrack.com", tipo: "educador", plano: "pago", pagamento: "sim" }
];

const pacientes = [
    { id: 1, nome: "João Silva", email: "joao@gytrack.com", telefone: "11987654321", nascimento: "1990-05-15", sexo: "M", plano: "mensal", pagamento: "pix", alergias: "Nenhuma", emailVerificado: true },
    { id: 2, nome: "Maria Oliveira", email: "maria@gytrack.com", telefone: "11976543210", nascimento: "1985-08-20", sexo: "F", plano: "trimestral", pagamento: "cartao", alergias: "Lactose", emailVerificado: true }
];

// Dados simulados para antropometria, dietas, treinos, feedbacks e progresso
const antropometrias = [
    { pacienteId: 1, peso: 80, altura: 175, gordura: 15, nivelAtividade: "moderado", objetivo: "perda", tmb: 1800, get: 2200, lesoes: "Nenhuma", dataAtualizacao: "2025-01-01" },
    { pacienteId: 2, peso: 65, altura: 165, gordura: 20, nivelAtividade: "leve", objetivo: "manutencao", tmb: 1400, get: 1700, lesoes: "Torção no joelho", dataAtualizacao: "2025-01-01" }
];

const dietas = [
    { pacienteId: 1, tipo: "Baixa Caloria", inicio: "2025-01-01", horario: "08:00", refeicao: "Café da Manhã", descricao: "Ovos e frutas", calorias: 500, proteinas: 20, carboidratos: 50, gorduras: 15, dataAtualizacao: "2025-01-01" },
    { pacienteId: 2, tipo: "Equilibrada", inicio: "2025-01-01", horario: "12:00", refeicao: "Almoço", descricao: "Arroz, feijão, carne", calorias: 600, proteinas: 25, carboidratos: 70, gorduras: 10, dataAtualizacao: "2025-01-01" }
];

const treinos = [
    { pacienteId: 1, inicio: "2025-01-01", tipo: "Musculação", grupo: "Peito", series: 4, repeticoes: 12, cargaInicial: 50, cargaAtual: 50, descanso: "60s", diaSemana: "Segunda", link: "https://youtube.com/treino-peito", dataAtualizacao: "2025-01-01" },
    { pacienteId: 2, inicio: "2025-01-01", tipo: "Cardio", grupo: "Aeróbico", series: 3, repeticoes: 20, cargaInicial: 30, cargaAtual: 30, descanso: "30s", diaSemana: "Quarta", link: "https://youtube.com/cardio", dataAtualizacao: "2025-01-01" }
];

const feedbacks = [
    { pacienteId: 1, treinoId: 1, comentario: "Treino intenso, mas eficaz!", data: "2025-02-01" },
    { pacienteId: 2, dietaId: 2, comentario: "Gostei da dieta, mas senti fome à tarde.", data: "2025-02-01" }
];

const progresso = [
    // João Silva (pacienteId: 1)
    { pacienteId: 1, tipo: "peso", valor: 80, data: "2025-01-01" },
    { pacienteId: 1, tipo: "peso", valor: 79.5, data: "2025-01-15" },
    { pacienteId: 1, tipo: "peso", valor: 78.8, data: "2025-02-01" },
    { pacienteId: 1, tipo: "peso", valor: 78, data: "2025-02-15" },
    { pacienteId: 1, tipo: "peso", valor: 77.5, data: "2025-02-27" },

    { pacienteId: 1, tipo: "carga", valor: 50, data: "2025-01-01" },
    { pacienteId: 1, tipo: "carga", valor: 52, data: "2025-01-15" },
    { pacienteId: 1, tipo: "carga", valor: 55, data: "2025-02-01" },
    { pacienteId: 1, tipo: "carga", valor: 58, data: "2025-02-15" },
    { pacienteId: 1, tipo: "carga", valor: 60, data: "2025-02-27" },

    // Maria Oliveira (pacienteId: 2)
    { pacienteId: 2, tipo: "peso", valor: 65, data: "2025-01-01" },
    { pacienteId: 2, tipo: "peso", valor: 64.8, data: "2025-01-15" },
    { pacienteId: 2, tipo: "peso", valor: 64.2, data: "2025-02-01" },
    { pacienteId: 2, tipo: "peso", valor: 63.5, data: "2025-02-15" },
    { pacienteId: 2, tipo: "peso", valor: 63, data: "2025-02-27" },

    { pacienteId: 2, tipo: "carga", valor: 30, data: "2025-01-01" },
    { pacienteId: 2, tipo: "carga", valor: 31, data: "2025-01-15" },
    { pacienteId: 2, tipo: "carga", valor: 33, data: "2025-02-01" },
    { pacienteId: 2, tipo: "carga", valor: 34, data: "2025-02-15" },
    { pacienteId: 2, tipo: "carga", valor: 35, data: "2025-02-27" }
];

// Simular usuário logado (baseado no login)
let usuarioLogado = null;

function getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('/admin/')) return 'admin';
    if (path.includes('/educador/')) return 'educador';
    if (path.includes('/paciente/')) return 'paciente';
    return null;
}

function getLoggedUser() {
    // Simulação: verifica o tipo de usuário com base no login (ajuste conforme necessário)
    const tipoUsuario = localStorage.getItem('tipoUsuario') || 'paciente'; // Padrão para paciente
    const email = localStorage.getItem('email') || 'joao@gytrack.com'; // Padrão para João Silva

    if (tipoUsuario === 'admin') {
        return usuarios.find(u => u.tipo === 'admin');
    } else if (tipoUsuario === 'educador') {
        return usuarios.find(u => u.tipo === 'educador');
    } else {
        return pacientes.find(p => p.email === email);
    }
}

// Função para preencher selects dinamicamente
function populateSelect(selectId, data, valueKey, textKey, filter = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Selecione</option>';
    const filteredData = filter ? data.filter(filter) : data;
    filteredData.forEach(item => {
        const option = document.createElement("option");
        option.value = item[valueKey];
        option.textContent = item[textKey];
        select.appendChild(option);
    });
}

// Validação de formulários genérica
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value && input.required) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    return isValid;
}

// Função para simular envio de formulário (salvar nos arrays simulados)
function saveFormData(form, dataArray, fields) {
    if (!validateForm(form)) return;
    const formData = {};
    fields.forEach(field => {
        formData[field] = form.querySelector(`#${field}`).value;
    });
    const pageType = getCurrentPageType();
    if (pageType === 'educador') {
        formData.pacienteId = form.querySelector('#paciente')?.value || 1; // Padrão para paciente 1
    } else if (pageType === 'paciente') {
        formData.pacienteId = usuarioLogado?.id || 1; // Usuário logado
    }
    formData.dataAtualizacao = new Date().toISOString().split('T')[0];
    dataArray.push(formData);
    alert("Dados salvos com sucesso!");
    form.reset();
    updateLists(); // Atualizar listas após salvar
}

// Aplicar a validação e simulação de envio em todos os formulários
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pageType = getCurrentPageType();
        if (form.id === 'select-patient-form') return; // Ignorar o formulário de seleção de paciente
        if (form.id === 'loginForm') {
            handleLogin(e);
            return;
        }

        if (pageType === 'educador') {
            if (form.closest('.main-content').querySelector('h1').textContent.includes('Antropometria')) {
                saveFormData(form, antropometrias, ['peso', 'altura', 'gordura', 'nivelAtividade', 'objetivo', 'tmb', 'get', 'lesoes', 'dataAtualizacao']);
            } else if (form.closest('.main-content').querySelector('h1').textContent.includes('Dietas')) {
                saveFormData(form, dietas, ['paciente', 'tipo', 'inicio', 'horario', 'refeicao', 'pesoMeta', 'descricao', 'calorias', 'proteinas', 'carboidratos', 'gorduras', 'dataAtualizacao']);
            } else if (form.closest('.main-content').querySelector('h1').textContent.includes('Treinos')) {
                saveFormData(form, treinos, ['paciente', 'inicio', 'tipo', 'grupo', 'series', 'repeticoes', 'cargaInicial', 'cargaAtual', 'descanso', 'diaSemana', 'link', 'dataAtualizacao']);
            } else if (form.closest('.main-content').querySelector('h1').textContent.includes('Pacientes')) {
                saveFormData(form, pacientes, ['nome', 'email', 'telefone', 'nascimento', 'sexo', 'plano', 'pagamento', 'alergias', 'emailVerificado']);
            }
        } else if (pageType === 'paciente') {
            if (form.id === 'progressForm') {
                const tipo = form.querySelector('#tipoProgresso').value;
                const valor = parseFloat(form.querySelector('#valor').value);
                const data = form.querySelector('#data').value;
                progresso.push({ pacienteId: usuarioLogado.id, tipo, valor, data });
                alert("Progresso registrado com sucesso!");
                form.reset();
                loadProgressCharts(); // Atualizar gráficos
            } else if (form.id === 'feedbackForm') {
                const tipo = form.querySelector('#tipoFeedback').value;
                const itemId = parseInt(form.querySelector('#itemId').value);
                const comentario = form.querySelector('#comentario').value;
                const data = new Date().toISOString().split('T')[0];
                feedbacks.push({ pacienteId: usuarioLogado.id, [tipo + 'Id']: itemId, comentario, data });
                alert("Feedback enviado com sucesso!");
                form.reset();
                updateFeedbacks();
            }
        }
    });
});

// Função de login ajustada para setar o usuário logado
function handleLogin(event) {
    event.preventDefault();
    const tipoUsuario = document.getElementById('tipoUsuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password && tipoUsuario) {
        if (tipoUsuario === "admin") {
            usuarioLogado = usuarios.find(u => u.tipo === 'admin');
            localStorage.setItem('tipoUsuario', 'admin');
            localStorage.setItem('email', email);
            window.location.href = "./pages/admin/dashboard.html";
        } else if (tipoUsuario === "educador") {
            usuarioLogado = usuarios.find(u => u.tipo === 'educador');
            localStorage.setItem('tipoUsuario', 'educador');
            localStorage.setItem('email', email);
            window.location.href = "./pages/educador/dashboard.html";
        } else if (tipoUsuario === "paciente") {
            usuarioLogado = pacientes.find(p => p.email === email);
            if (!usuarioLogado) {
                alert("Paciente não encontrado!");
                return;
            }
            localStorage.setItem('tipoUsuario', 'paciente');
            localStorage.setItem('email', email);
            window.location.href = "./pages/paciente/index.html";
        }
    } else {
        alert("Por favor, preencha todos os campos!");
    }
}

// Função para carregar relatórios apenas na página de relatórios do educador
function loadReport() {
    const select = document.getElementById("paciente");
    const pageType = getCurrentPageType();
    if (pageType !== 'educador' || !select) return;

    const patientId = select.value;
    const reportSection = document.getElementById("report-section");

    if (!patientId) {
        reportSection.style.display = "none";
        return;
    }

    const paciente = pacientes.find(p => p.id == patientId);
    const antropometria = antropometrias.find(a => a.pacienteId == patientId);
    const pesoProgresso = progresso.filter(p => p.pacienteId == patientId && p.tipo === "peso").map(p => p.valor);
    const cargaProgresso = progresso.filter(p => p.pacienteId == patientId && p.tipo === "carga").map(p => p.valor);
    const datas = progresso.filter(p => p.pacienteId == patientId).map(p => p.data).sort();

    reportSection.style.display = "block";

    // Gráfico de Peso
    const weightCtx = document.getElementById("weightChart").getContext("2d");
    new Chart(weightCtx, {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Peso (kg)",
                data: pesoProgresso,
                borderColor: "#2c3e50",
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: false } } }
    });

    // Gráfico de Calorias (Dieta)
    const dieta = dietas.find(d => d.pacienteId == patientId);
    const caloriesCtx = document.getElementById("caloriesChart").getContext("2d");
    new Chart(caloriesCtx, {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Calorias (kcal)",
                data: Array(datas.length).fill(dieta?.calorias || 0),
                borderColor: "#34495e",
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: false } } }
    });

    // Gráfico de Carga (Treino)
    const treino = treinos.find(t => t.pacienteId == patientId);
    const loadCtx = document.getElementById("loadChart").getContext("2d");
    new Chart(loadCtx, {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Carga (kg)",
                data: cargaProgresso,
                borderColor: "#e74c3c",
                fill: false
            }]
        },
        options: { scales: { y: { beginAtZero: false } } }
    });
}

// Função para carregar gráficos de progresso apenas na página do paciente
function loadProgressCharts() {
    const pageType = getCurrentPageType();
    if (pageType !== 'paciente' || !window.location.pathname.includes('/progresso.html')) return;

    const pacienteId = usuarioLogado?.id || 1;
    const pesoProgresso = progresso.filter(p => p.pacienteId === pacienteId && p.tipo === "peso");
    const cargaProgresso = progresso.filter(p => p.pacienteId === pacienteId && p.tipo === "carga");
    const datas = [...pesoProgresso, ...cargaProgresso].map(p => p.data).sort();

    const weightCtx = document.getElementById("weightProgressChart")?.getContext("2d");
    if (weightCtx) {
        new Chart(weightCtx, {
            type: "line",
            data: {
                labels: datas,
                datasets: [{
                    label: "Peso (kg)",
                    data: pesoProgresso.map(p => p.valor),
                    borderColor: "#2c3e50",
                    fill: false
                }]
            },
            options: { scales: { y: { beginAtZero: false } } }
        });
    }

    const loadCtx = document.getElementById("loadProgressChart")?.getContext("2d");
    if (loadCtx) {
        new Chart(loadCtx, {
            type: "line",
            data: {
                labels: datas,
                datasets: [{
                    label: "Carga (kg)",
                    data: cargaProgresso.map(p => p.valor),
                    borderColor: "#e74c3c",
                    fill: false
                }]
            },
            options: { scales: { y: { beginAtZero: false } } }
        });
    }
}

// Função para atualizar feedbacks apenas na página de feedbacks do paciente
function updateFeedbacks() {
    const pageType = getCurrentPageType();
    if (pageType !== 'paciente' || !window.location.pathname.includes('/feedbacks.html')) return;

    const pacienteId = usuarioLogado?.id || 1;
    const feedbacksList = document.getElementById('feedbacksList');
    if (!feedbacksList) return;
    feedbacksList.innerHTML = '';
    feedbacks.filter(f => f.pacienteId === pacienteId).forEach(feedback => {
        feedbacksList.innerHTML += `
            <div class="feedback-item">
                <p><strong>${feedback.comentario}</strong></p>
                <p>Data: ${feedback.data}</p>
            </div>
        `;
    });
}

// Função para atualizar listas (treinos, dietas, etc.) apenas nas páginas relevantes
function updateLists() {
    const pageType = getCurrentPageType();
    if (pageType !== 'paciente') return;

    const pacienteId = usuarioLogado?.id || 1;
    const page = window.location.pathname.split('/').pop().split('.')[0];

    if (page === 'treinos') {
        const treinosList = document.getElementById('treinosList');
        if (treinosList) {
            treinosList.innerHTML = '';
            treinos.filter(t => t.pacienteId === pacienteId).forEach(treino => {
                treinosList.innerHTML += `<p>Treino: ${treino.tipo} (${treino.grupo}) - Carga: ${treino.cargaAtual}kg, Dia: ${treino.diaSemana}</p>`;
            });
        }
    } else if (page === 'dietas') {
        const dietasList = document.getElementById('dietasList');
        if (dietasList) {
            dietasList.innerHTML = '';
            dietas.filter(d => d.pacienteId === pacienteId).forEach(dieta => {
                dietasList.innerHTML += `<p>Dieta: ${dieta.tipo} - ${dieta.refeicao} (${dieta.calorias}kcal), Horário: ${dieta.horario}</p>`;
            });
        }
    }

    loadProgressCharts();
    updateFeedbacks();
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    usuarioLogado = getLoggedUser();
    const pageType = getCurrentPageType();

    // Preencher selects de pacientes apenas em páginas de educador
    if (pageType === 'educador') {
        ['paciente'].forEach(id => {
            populateSelect(id, pacientes, 'id', 'nome');
        });
    }

    // Preencher tabelas de usuários no admin
    if (pageType === 'admin') {
        const adminTable = document.createElement('table');
        adminTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Tipo</th>
                    <th>Plano</th>
                    <th>Pagamento</th>
                </tr>
            </thead>
            <tbody id="usuariosTable"></tbody>
        `;
        const adminSection = document.querySelector('.main-content section');
        if (adminSection) {
            adminSection.innerHTML = '';
            adminSection.appendChild(adminTable);
            const tbody = document.getElementById('usuariosTable');
            usuarios.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.tipo}</td>
                    <td>${user.plano}</td>
                    <td>${user.pagamento}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Preencher tabela de pacientes no educador
    if (pageType === 'educador' && window.location.pathname.includes('/pacientes.html')) {
        const pacientesTable = document.createElement('table');
        pacientesTable.innerHTML = `
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Plano</th>
                    <th>Pagamento</th>
                    <th>Alergias</th>
                    <th>E-mail Verificado</th>
                </tr>
            </thead>
            <tbody id="pacientesTable"></tbody>
        `;
        const pacientesSection = document.querySelector('.main-content section');
        if (pacientesSection) {
            pacientesSection.innerHTML = '';
            pacientesSection.appendChild(pacientesTable);
            const tbody = document.getElementById('pacientesTable');
            pacientes.forEach(paciente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${paciente.nome}</td>
                    <td>${paciente.email}</td>
                    <td>${paciente.telefone}</td>
                    <td>${paciente.plano}</td>
                    <td>${paciente.pagamento}</td>
                    <td>${paciente.alergias}</td>
                    <td>${paciente.emailVerificado ? 'Sim' : 'Não'}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Inicializar funcionalidades do paciente
    if (pageType === 'paciente') {
        updateLists();
    }

    // Carregar relatórios apenas na página de relatórios
    if (window.location.pathname.includes('/relatorios.html')) {
        loadReport();
    }
});