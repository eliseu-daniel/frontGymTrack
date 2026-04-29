import { useMemo } from "react";
import { usePatients } from "../contexts/PatientsContext";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";
import { useAuth } from "../contexts/AuthContext.jsx";
import Table from "../components/Table";

function parseDateString(dateInput) {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  const s = String(dateInput).trim();

  const dmY = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/;
  const dm = /^\s*(\d{1,2})\/(\d{1,2})\s*$/;

  let m;

  if ((m = s.match(dmY))) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  if ((m = s.match(dm))) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const today = new Date();
    let year = today.getFullYear();

    let candidate = new Date(year, month - 1, day);
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (candidate < todayMidnight) {
      year += 1;
      candidate = new Date(year, month - 1, day);
    }

    return isNaN(candidate.getTime()) ? null : candidate;
  }

  const isoGuess = new Date(s);
  if (!isNaN(isoGuess.getTime())) return isoGuess;

  return null;
}

function formatDateBR(dateString) {
  const date = parseDateString(dateString);
  if (!date) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getDaysLeft(endDate) {
  const end = parseDateString(endDate);
  if (!end) return null;

  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  end.setHours(0, 0, 0, 0);

  const diff = end - todayMidnight;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatPlan(plan) {
  const plans = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    semiannual: "Semestral",
  };

  if (!plan) return "-";

  if (typeof plan === "object") {
    return plan?.description || plan?.name || plans[plan?.type] || "-";
  }

  return plans[plan] || String(plan) || "-";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { patients = [], loading: loadingPatients } = usePatients();
  const { registrations = [], loading: loadingRegistrations } =
    useRegistrations();

  const loading = loadingPatients || loadingRegistrations;

  const nearestPatients = useMemo(() => {
    const activePatients = (Array.isArray(patients) ? patients : []).filter(
      (patient) => (patient.is_active ?? patient.ativo ?? 1) == 1
    );

    const patientMap = new Map(
      activePatients.map((patient) => [
        String(patient.id ?? patient.patient_id),
        patient,
      ])
    );

    return (Array.isArray(registrations) ? registrations : [])
      .filter((registration) => {
        const educatorId =
          registration.educator_id ??
          registration.user_id ??
          registration.educator?.id;

        return String(educatorId) === String(user?.id);
      })
      .map((registration) => {
        const patientId =
          registration?.patient_id ??
          registration?.id_paciente ??
          registration?.patient?.id;

        const patient =
          patientMap.get(String(patientId)) || registration?.patient || {};

        const name = patient?.name || patient?.nome || "-";
        const email = patient?.email || "-";
        const phone = patient?.phone || patient?.telefone || "-";

        const plan =
          registration?.plan_description ??
          registration?.plan ??
          registration?.plano ??
          "-";

        const endDate =
          registration?.end_date ??
          registration?.data_fim ??
          registration?.expected_end_date ??
          registration?.fim_acompanhamento ??
          registration?.fimAcompanhamento;

        const daysLeft = getDaysLeft(endDate);

        return {
          id: patient?.id ?? patientId ?? registration?.id,
          name,
          email,
          phone,
          plan,
          endDate,
          daysLeft,
        };
      })
      .filter(
        (item) =>
          item.id &&
          item.endDate &&
          item.daysLeft !== null &&
          item.daysLeft >= 0
      )
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 10);
  }, [patients, registrations, user]);

  const columns = ["NOME", "E-MAIL", "TELEFONE", "PLANO", "DATA"];

  const rows = nearestPatients.map((patient) => [
    patient.name,
    patient.email,
    patient.phone,
    formatPlan(patient.plan),
    formatDateBR(patient.endDate),
  ]);

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Bem vindo ao seu gestor de pacientes.
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <h2 className="text-center text-lg font-normal mb-4 uppercase tracking-wide">
          Pacientes a vencer
        </h2>

        {loading ? (
          <div className="text-[12px]">Carregando...</div>
        ) : rows.length > 0 ? (
          <Table columns={columns} rows={rows} />
        ) : (
          <div className="text-sm text-gray-600 text-center">
            Nenhum paciente próximo do prazo final.
          </div>
        )}
      </div>
    </div>
  );
}