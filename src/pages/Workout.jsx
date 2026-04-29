import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { api } from "../services/api";
import { usePatients } from "../contexts/PatientsContext.jsx";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

export default function Workout() {
  const nav = useNavigate();
  const { patients, fetchPatients } = usePatients();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenWorkoutIds, setHiddenWorkoutIds] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hiddenWorkouts") ?? "[]");
      if (Array.isArray(saved)) {
        setHiddenWorkoutIds(saved.map((id) => String(id)));
      }
    } catch {
      setHiddenWorkoutIds([]);
    }
  }, []);

  async function fetchWorkouts() {
    try {
      setLoading(true);

      const response = await api.get("/educators/workouts");
      const data = response.data?.WorkoutData ?? response.data ?? [];

      setWorkouts(Array.isArray(data) ? data : []);
    } catch (error) {
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function handleDelete(workout) {
    const workoutId = String(workout.workout_id ?? workout.id);

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este treino?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/educators/workouts/${workoutId}`);

      alert("Treino excluído com sucesso!");
      await fetchWorkouts();
    } catch (error) {
      alert("Não foi possível excluir o treino.");
    }
  }

  const patientsById = useMemo(() => {
    return (patients ?? []).reduce((acc, p) => {
      const id = String(p.id ?? p.patient_id ?? "");
      if (id) acc[id] = p;
      return acc;
    }, {});
  }, [patients]);

  const visibleWorkouts = useMemo(() => {
    return (workouts ?? [])
      .filter((w) => Number(w.is_active ?? 1) === 1)
      .filter((w) => !hiddenWorkoutIds.includes(String(w.workout_id ?? w.id)));
  }, [workouts, hiddenWorkoutIds]);

  const columns = [
    "NOME",
    "E-MAIL",
    "TELEFONE",
    "OBJETIVO",
    "INICIO ACOMP.",
    "AÇÕES",
  ];

  const rows = visibleWorkouts.map((w) => {
    const patient = patientsById[String(w.patient_id ?? "")] ?? {};

    return [
      w.name ?? patient.nome ?? patient.name ?? "-",
      w.email ?? patient.email ?? "-",
      w.phone ?? w.telefone ?? patient.telefone ?? patient.phone ?? "-",
      w.workout_type_name ?? "-",
      formatDateBR(w.start_date),
      <div
        key={`actions-${w.workout_id ?? w.id}`}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => nav(`/treinos/editar/${w.workout_id ?? w.id}`)}
          className="border border-green-600 text-green-600 px-2 py-[2px] rounded"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => handleDelete(w)}
          className="border border-red-600 text-red-600 px-2 py-[2px] rounded"
        >
          Excluir
        </button>
      </div>,
    ];
  });

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Treinos
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/treinos/cadastro")}
          className="bg-sf-greenDark text-white px-6 py-1 text-sm rounded-xl"
        >
          CADASTRE
        </button>
      </div>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        {loading ? (
          <div className="text-[12px]">Carregando...</div>
        ) : (
          <Table columns={columns} rows={rows} />
        )}
      </div>
    </div>
  );
}