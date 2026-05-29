import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function WorkoutCreate() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [patients, setPatients] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    workout_type_id: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const EMPTY_EXERCISE = {
    exercise_id: "",
    series: "",
    repetitions: "",
    weight_load: "",
    rest_time: "",
    duration_time: "",
    send_notification: false,
  };

  const [items, setItems] = useState([
    {
      day_of_week: "1",
      exercises: [{ ...EMPTY_EXERCISE }],
    },
  ]);

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  }

  function updateExercise(itemIndex, exerciseIndex, field, value) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? {
            ...item,
            exercises: item.exercises.map((exercise, j) =>
              j === exerciseIndex
                ? { ...exercise, [field]: value }
                : exercise
            ),
          }
          : item
      )
    );
  }

  function addExerciseToItem(index) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            exercises: [...item.exercises, { ...EMPTY_EXERCISE }],
          }
          : item
      )
    );
  }

  function removeExercise(itemIndex, exerciseIndex) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === itemIndex
          ? {
            ...item,
            exercises: item.exercises.filter((_, j) => j !== exerciseIndex),
          }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        day_of_week: "1",
        send_notification: false,
        exercises: [{ ...EMPTY_EXERCISE }],
      },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function loadOptions() {
    try {
      setLoadingOptions(true);

      const [patientsResponse, workoutTypesResponse, exercisesResponse] =
        await Promise.all([
          api.get("/educators/patient/for-educator").catch(() => null),
          api.get("/educators/workout-type").catch(() => null),
          api.get("/educators/exercises").catch(() => null),
        ]);

      const patientsData =
        patientsResponse?.data?.patients ??
        patientsResponse?.data?.Patients ??
        patientsResponse?.data?.data ??
        patientsResponse?.data ??
        [];

      const workoutTypesData =
        workoutTypesResponse?.data?.WorkoutTypeData ??
        workoutTypesResponse?.data?.data ??
        workoutTypesResponse?.data ??
        [];

      const exercisesData =
        exercisesResponse?.data?.Exercises ??
        exercisesResponse?.data?.ExerciseData ??
        exercisesResponse?.data?.data ??
        exercisesResponse?.data ??
        [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setWorkoutTypes(Array.isArray(workoutTypesData) ? workoutTypesData : []);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
    } catch (error) {
      setPatients([]);
      setWorkoutTypes([]);
      setExercises([]);
      alert("Erro ao carregar pacientes, tipos de treino ou exercícios.");
    } finally {
      setLoadingOptions(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  function validateForm() {
    if (!form.patient_id) {
      alert("Selecione o paciente.");
      return false;
    }

    if (!form.start_date) {
      alert("Preencha a data de início do treino.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.day_of_week) {
        alert(`Selecione o dia da semana do item ${i + 1}.`);
        return false;
      }

      if (!item.exercises || item.exercises.length === 0) {
        alert(`Adicione pelo menos um exercício no item ${i + 1}.`);
        return false;
      }

      for (let j = 0; j < item.exercises.length; j++) {
        const exercise = item.exercises[j];
        if (!exercise.exercise_id) {
          alert(`Selecione o exercício ${j + 1} do item ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const workoutPayload = {
        patient_id: Number(form.patient_id),
        workout_type_id: form.workout_type_id
          ? Number(form.workout_type_id)
          : null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        finalized_at: form.finalized_at || null,
      };

      const workoutResponse = await api.post("/educators/workouts", workoutPayload);

      const createdWorkout =
        workoutResponse?.data?.workout ||
        workoutResponse?.data?.data ||
        workoutResponse?.data;

      const workoutId =
        createdWorkout?.id ||
        createdWorkout?.workout_id ||
        workoutResponse?.data?.id ||
        workoutResponse?.data?.workout_id;

      if (!workoutId) {
        throw new Error("Não foi possível obter o ID do treino criado.");
      }

      const allExerciseRequests = [];
      items.forEach((item) => {
        item.exercises.forEach((exercise) => {
          const workoutItemPayload = {
            workout_id: Number(workoutId),
            exercise_id: Number(exercise.exercise_id),
            day_of_week: Number(item.day_of_week),
            series: exercise.series ? Number(exercise.series) : null,
            repetitions: exercise.repetitions ? Number(exercise.repetitions) : null,
            weight_load: exercise.weight_load ? Number(exercise.weight_load) : null,
            duration_time: exercise.duration_time ? Number(exercise.duration_time) : null,
            rest_time: exercise.rest_time ? Number(exercise.rest_time) : null,
            send_notification: item.send_notification,
          };
          allExerciseRequests.push(api.post("/educators/workout-items", workoutItemPayload));
        });
      });

      await Promise.all(allExerciseRequests);

      alert("Treino cadastrado com sucesso!");
      nav("/treinos");
    } catch (error) {

      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Não foi possível cadastrar o treino.";

      alert(apiMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    nav("/treinos");
  }

  function getPatientId(patient) {
    return patient.id ?? patient.patient_id;
  }

  function getPatientName(patient) {
    return patient.name ?? patient.nome ?? "Paciente";
  }

  function getWorkoutTypeId(type) {
    return type.id ?? type.workout_type_id;
  }

  function getWorkoutTypeName(type) {
    return type.workout_type ?? type.name ?? "Tipo";
  }

  function getExerciseId(exercise) {
    return exercise.exercise_id ?? exercise.id;
  }

  function getExerciseName(exercise) {
    return exercise.exercise ?? exercise.name ?? "Exercício";
  }

  function getExerciseById(exerciseId) {
    return exercises.find(
      (exercise) => String(getExerciseId(exercise)) === String(exerciseId)
    );
  }

  if (loadingOptions) {
    return (
      <div className="bg-sf-panel rounded-md shadow-soft p-6 text-center text-base font-serif">
        Carregando...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Cadastro de Treinos
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-sf-panel rounded-md shadow-soft p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Paciente">
              <select
                value={form.patient_id}
                onChange={(e) => setField("patient_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Carregando..." : "Selecione"}
                </option>
                {patients.map((patient) => (
                  <option
                    key={getPatientId(patient)}
                    value={getPatientId(patient)}
                  >
                    {getPatientName(patient)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo de Treino">
              <select
                value={form.workout_type_id}
                onChange={(e) => setField("workout_type_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Carregando..." : "Selecione"}
                </option>
                {workoutTypes.map((type) => (
                  <option
                    key={getWorkoutTypeId(type)}
                    value={getWorkoutTypeId(type)}
                  >
                    {getWorkoutTypeName(type)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">
            <Field label="Início do Treino">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </Field>

            <Field label="Fim do Treino">
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setField("end_date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="Finalização do Treino">
              <input
                type="date"
                value={form.finalized_at}
                onChange={(e) => setField("finalized_at", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </Field>
          </div>
        </div>

        <div className="bg-sf-panel rounded-md shadow-soft p-6">
          <div className="space-y-6">
            {items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="border-b border-gray-300 pb-6 last:border-b-0"
              >
                <div className="mb-4">
                  <h2 className="font-serif text-xl">
                    Dia {itemIndex + 1}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                  <Field label="Dia da Semana">
                    <select
                      value={item.day_of_week}
                      onChange={(e) =>
                        updateItem(itemIndex, "day_of_week", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="1">Segunda</option>
                      <option value="2">Terça</option>
                      <option value="3">Quarta</option>
                      <option value="4">Quinta</option>
                      <option value="5">Sexta</option>
                      <option value="6">Sábado</option>
                      <option value="7">Domingo</option>
                    </select>
                  </Field>

                  <div>
                    <label className="text-base font-serif block mb-1">
                      <input
                        type="checkbox"
                        checked={item.send_notification}
                        onChange={(e) =>
                          updateItem(
                            itemIndex,
                            "send_notification",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      Enviar notificação ao paciente (para todos os exercícios)
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.exercises.map((exercise, exerciseIndex) => {
                    const selectedExercise = getExerciseById(exercise.exercise_id);
                    const exerciseLink = selectedExercise?.link_exercise ?? "";
                    const muscleGroupName =
                      selectedExercise?.muscle_group_name ??
                      selectedExercise?.muscle_group?.name ??
                      "";

                    return (
                      <div
                        key={exerciseIndex}
                        className="bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        <div className="mb-4 flex justify-between items-center">
                          <h3 className="font-serif text-lg">
                            Exercício {exerciseIndex + 1}
                          </h3>
                          {item.exercises.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExercise(itemIndex, exerciseIndex)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              ✕ Remover
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Field label="Exercício">
                            <select
                              value={exercise.exercise_id}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "exercise_id", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                              required
                            >
                              <option value="">Selecione</option>
                              {exercises.map((ex) => (
                                <option
                                  key={getExerciseId(ex)}
                                  value={getExerciseId(ex)}
                                >
                                  {getExerciseName(ex)}
                                </option>
                              ))}
                            </select>
                          </Field>

                          <Field label="Séries">
                            <input
                              type="number"
                              min="1"
                              value={exercise.series}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "series", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                            />
                          </Field>

                          <Field label="Repetições">
                            <input
                              type="number"
                              min="1"
                              value={exercise.repetitions}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "repetitions", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                            />
                          </Field>

                          <Field label="Carga">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={exercise.weight_load}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "weight_load", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                              placeholder="Ex: 20"
                            />
                          </Field>

                          <Field label="Tempo de Descanso">
                            <input
                              type="number"
                              min="0"
                              value={exercise.rest_time}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "rest_time", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                              placeholder="Em segundos"
                            />
                          </Field>

                          <Field label="Grupo Muscular">
                            <input
                              type="text"
                              value={muscleGroupName}
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                              readOnly
                              placeholder="Será preenchido pelo exercício"
                            />
                          </Field>

                          <Field label="Duração / Tempo">
                            <input
                              type="number"
                              min="0"
                              value={exercise.duration_time}
                              onChange={(e) =>
                                updateExercise(itemIndex, exerciseIndex, "duration_time", e.target.value)
                              }
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                              placeholder="Em minutos"
                            />
                          </Field>

                          <div className="md:col-span-2">
                            <Field label="Link">
                              <input
                                type="text"
                                value={exerciseLink}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                                readOnly
                                placeholder="Link do exercício"
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => addExerciseToItem(itemIndex)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-sf-greenDark text-xl text-white hover:bg-sf-green"
                    title="Adicionar exercício neste dia"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(itemIndex)}
                    className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Remover dia
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-sf-greenDark text-xl text-white hover:bg-sf-green"
            title="Adicionar item"
          >
            +
          </button>

          <div className="flex flex-col justify-center gap-3 pt-8 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading || loadingOptions}
              className="w-full rounded-xl bg-sf-greenDark text-white px-6 py-2 text-base hover:bg-sf-green disabled:cursor-not-allowed disabled:opacity-60 md:w-80"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-serif">{label}</span>
      {children}
    </label>
  );
}