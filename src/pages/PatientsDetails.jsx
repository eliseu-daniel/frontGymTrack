import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePatients } from "../contexts/PatientsContext";
import { api } from "../services/api";

export default function PatientsDetails() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients } = usePatients();
  const [patient, setPatient] = useState(null);
  const [nome, setNome] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);
  const [anthropometries, setAnthropometries] = useState([]);

  const patientId = searchParams.get("id");

  useEffect(() => {
    if (patientId && patients.length > 0) {
      const found = patients.find(
        (p) => String(p.id ?? p.patient_id) === String(patientId)
      );
      if (found) {
        setPatient(found);
        setNome(found.nome ?? found.name ?? "");
      }
    }
  }, [patientId, patients]);

  useEffect(() => {
    if (!patientId) return;

    async function fetchData() {
      try {
        const [workoutRes, dietRes, anthropometryRes] = await Promise.all([
          api.get("/educators/workouts"),
          api.get("/educators/diets"),
          api.get("/educators/anthropometrys"),
        ]);

        const patientIdStr = String(patientId);

        const patientWorkouts = (
          workoutRes.data?.WorkoutData ?? workoutRes.data ?? []
        ).filter((w) => String(w.patient_id ?? "") === patientIdStr);

        const patientDiets = (dietRes.data?.diets ?? dietRes.data ?? []).filter(
          (d) => String(d.patient_id ?? "") === patientIdStr
        );

        const patientAnthropometries = (
          anthropometryRes.data?.data ?? anthropometryRes.data ?? []
        ).filter((a) => String(a.patient_id ?? "") === patientIdStr);

        setWorkouts(patientWorkouts);
        setDiets(patientDiets);
        setAnthropometries(patientAnthropometries);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, [patientId]);

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Ficha do paciente
      </h1>

      <div className="bg-sf-panel rounded-md shadow-soft p-6">
        <label className="mb-1 block text-base font-serif">Nome</label>
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="mb-1 block text-base font-serif">
                Treino
              </label>
              <div className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 overflow-y-auto">
                {workouts.length > 0 ? (
                  <div className="space-y-2">
                    {workouts.map((w) => (
                      <div
                        key={w.workout_id ?? w.id}
                        onClick={() => nav(`/treinos/editar/${w.workout_id ?? w.id}`)}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        
                        <p className="text-xs text-gray-600">
                          {w.workout_type_name ?? "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum treino cadastrado</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label className="mb-1 block text-base font-serif">
                Dieta
              </label>
              <div className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 overflow-y-auto">
                {diets.length > 0 ? (
                  <div className="space-y-2">
                    {diets.map((d) => (
                      <div
                        key={d.diet_id ?? d.id}
                        onClick={() => nav(`/dietas/${d.diet_id ?? d.id}/editar`)}
                        className="p-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        
                        <p className="text-xs text-gray-600">
                          {d.objective ? d.objective.substring(0, 50) : "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhuma dieta cadastrada</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-1 block text-base font-serif">
              Antropometria
            </label>
            <div className="min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 overflow-y-auto">
              {anthropometries.length > 0 ? (
                <div className="space-y-2">
                  {anthropometries.map((a) => (
                    <div
                      key={a.anthropometry_id ?? a.id}
                      onClick={() => nav(`/antropometria/${a.anthropometry_id ?? a.id}/editar`)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      
                      <p className="text-xs text-gray-600">
                        Peso: {a.weights_initial ?? "-"} | Altura: {a.height ?? "-"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum registro antropométrico</p>
              )}
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}