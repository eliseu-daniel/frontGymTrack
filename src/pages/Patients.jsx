import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { usePatients } from "../contexts/PatientsContext.jsx";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Patients() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { patients, loading, fetchPatients, deletePatient } = usePatients();
  const { registrations, fetchRegistrations, loading: registrationsLoading } =
    useRegistrations();

  useEffect(() => {
    if (!user) return;

    fetchPatients();
    fetchRegistrations();
  }, [user]);

  const handleDelete = async (p) => {
    const id = p.id ?? p.patient_id;

    const confirmDelete = window.confirm("Deseja excluir este paciente?");
    if (!confirmDelete) return;

    try {
      await deletePatient(id);
    } catch (error) {
      alert("Erro ao excluir paciente.");
    }
  };

  const columns = [
    "NOME",
    "E-MAIL",
    "TELEFONE",
    "PLANO",
    "INICIO ACOMP.",
    "FIM ACOMP.",
    "AÇÕES",
  ];

  const registrationsByPatientId = useMemo(() => {
    if (!Array.isArray(registrations)) return {};

    return registrations.reduce((acc, registration) => {
      const educatorId =
        registration.educator_id ??
        registration.user_id ??
        registration.educator?.id;

      const isMine = String(educatorId) === String(user?.id);
      if (!isMine) return acc;

      const patientId = String(
        registration.patient_id ?? registration.patient?.id ?? ""
      );

      if (patientId) {
        acc[patientId] = registration;
      }

      return acc;
    }, {});
  }, [registrations, user]);

  const orderedPatients = useMemo(() => {
    return (patients ?? [])
      .filter((p) => (p.is_active ?? p.ativo ?? 1) == 1)
      .sort((a, b) => {
        const aId = String(a.id ?? a.patient_id);
        const bId = String(b.id ?? b.patient_id);

        const aHasMyRegistration = !!registrationsByPatientId[aId];
        const bHasMyRegistration = !!registrationsByPatientId[bId];

        if (aHasMyRegistration && !bHasMyRegistration) return -1;
        if (!aHasMyRegistration && bHasMyRegistration) return 1;

        return 0;
      });
  }, [patients, registrationsByPatientId]);

  const patientIds = orderedPatients.map((p) => p.id ?? p.patient_id);

  const rows = orderedPatients.map((p) => {
    const patientId = p.id ?? p.patient_id;
    const registration = registrationsByPatientId[String(patientId)];

    return [
      p.nome ?? p.name ?? "-",
      p.email ?? "-",
      p.telefone ?? p.phone ?? "-",
      registration?.plan_description ?? p.plano ?? p.plan ?? "-",
      registration?.start_date ?? p.inicioAcomp ?? p.start_date ?? "-",
      registration?.end_date ?? p.fimAcomp ?? p.end_date ?? "-",
      <div key={`actions-${patientId}`} className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nav(`/pacientes/${patientId}/editar`);
          }}
          className="text-sf-green border border-green-600 px-2 py-[2px] rounded"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nav(`/pacientes/${patientId}/matricula`);
          }}
          className="border border-blue-600 text-blue-600 px-2 py-[2px] rounded"
        >
          Matrícula
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(p);
          }}
          className="border border-red-600 text-red-600 px-2 py-[2px] rounded"
        >
          Excluir
        </button>
      </div>,
    ];
  });

  const handleRowClick = (patientId) => {
    nav(`/pacientes/details?id=${patientId}`);
  };

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Pacientes
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/pacientes/cadastro")}
          className="bg-sf-greenDark text-white px-6 py-1 text-sm rounded-xl"
        >
          CADASTRE
        </button>
      </div>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        {loading || registrationsLoading ? (
          <div className="text-[12px]">Carregando...</div>
        ) : (
          <Table
            columns={columns}
            rows={rows}
            rowIds={patientIds}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
}