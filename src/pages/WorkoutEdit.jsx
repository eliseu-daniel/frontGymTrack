import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

const EMPTY_ITEM = {
  workout_item_id: null,
  exercise_id: "",
  series: "",
  repetitions: "",
  weight_load: "",
  rest_time: "",
  duration_time: "",
  day_of_week: "1",
  send_notification: false,
};

export default function WorkoutEdit() {
  const nav = useNavigate();
  const { id } = useParams();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [removedItems, setRemovedItems] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    workout_type_id: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  async function loadInitialData() {
    try {
      setLoadingPage(true);

      const [
        patientsResponse,
        workoutTypesResponse,
        exercisesResponse,
        workoutResponse,
        workoutItemsResponse,
      ] = await Promise.all([
        api.get("/educators/patient/for-educator").catch(() => null),
        api.get("/educators/workout-type").catch(() => null),
        api.get("/educators/exercises").catch(() => null),
        api.get(`/educators/workouts/${id}`),
        api.get("/educators/workout-items").catch(() => null),
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

      const workoutData =
        workoutResponse?.data?.workout ??
        workoutResponse?.data?.data ??
        workoutResponse?.data ??
        {};

      const workoutItemsData =
        workoutItemsResponse?.data?.ItemWorkoutData ??
        workoutItemsResponse?.data?.itemWorkoutData ??
        workoutItemsResponse?.data?.data ??
        workoutItemsResponse?.data ??
        [];

      const currentWorkoutItems = Array.isArray(workoutItemsData)
        ? workoutItemsData
            .filter(
              (item) =>
                String(item.workout_id ?? item.workout?.id) === String(id)
            )
            .filter((item) => isActiveItem(item))
        : [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setWorkoutTypes(Array.isArray(workoutTypesData) ? workoutTypesData : []);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);

      setForm({
        patient_id: String(workoutData.patient_id ?? ""),
        workout_type_id: String(workoutData.workout_type_id ?? ""),
        start_date: workoutData.start_date
          ? String(workoutData.start_date).slice(0, 10)
          : "",
        end_date: workoutData.end_date
          ? String(workoutData.end_date).slice(0, 10)
          : "",
        finalized_at: workoutData.finalized_at
          ? String(workoutData.finalized_at).slice(0, 10)
          : "",
      });

      if (currentWorkoutItems.length > 0) {
        setItems(
          currentWorkoutItems.map((item) => ({
            workout_item_id: item.workout_item_id ?? item.id ?? null,
            exercise_id: String(item.exercise_id ?? ""),
            series: item.series ?? "",
            repetitions: item.repetitions ?? "",
            weight_load: item.weight_load ?? "",
            rest_time: item.rest_time ?? "",
            duration_time: item.duration_time ?? "",
            day_of_week: String(item.day_of_week ?? "1"),
            send_notification: Boolean(item.send_notification),
          }))
        );
      } else {
        setItems([{ ...EMPTY_ITEM }]);
      }
    } catch (error) {
      alert("Não foi possível carregar os dados do treino.");
      nav("/treinos");
    } finally {
      setLoadingPage(false);
    }
  }

  function isActiveItem(item) {
    return (
      item?.is_active === true ||
      item?.is_active === 1 ||
      item?.is_active === "1" ||
      item?.is_active === null ||
      typeof item?.is_active === "undefined"
    );
  }

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function setItemField(index, field, value) {
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

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index) {
    setItems((prev) => {
      if (prev.length === 1) return prev;

      const itemToRemove = prev[index];

      if (itemToRemove?.workout_item_id) {
        setRemovedItems((old) => [...old, itemToRemove]);
      }

      return prev.filter((_, i) => i !== index);
    });
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

      if (!item.exercise_id) {
        alert(`Selecione o exercício do item ${i + 1}.`);
        return false;
      }

      if (!item.day_of_week) {
        alert(`Selecione o dia da semana do item ${i + 1}.`);
        return false;
      }
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const workoutPayload = {
        patient_id: Number(form.patient_id),
        workout_type_id: form.workout_type_id
          ? Number(form.workout_type_id)
          : null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        finalized_at: form.finalized_at || null,
      };

      await api.put(`/educators/workouts/${id}`, workoutPayload);

      for (const item of items) {
        const itemPayload = {
          workout_id: Number(id),
          exercise_id: Number(item.exercise_id),
          day_of_week: Number(item.day_of_week),
          series: item.series ? Number(item.series) : null,
          repetitions: item.repetitions ? Number(item.repetitions) : null,
          weight_load: item.weight_load ? Number(item.weight_load) : null,
          duration_time: item.duration_time ? Number(item.duration_time) : null,
          rest_time: item.rest_time ? Number(item.rest_time) : null,
          send_notification: item.send_notification,
          is_active: true,
        };

        if (item.workout_item_id) {
          await api.put(
            `/educators/workout-items/${item.workout_item_id}`,
            itemPayload
          );
        } else {
          await api.post("/educators/workout-items", itemPayload);
        }
      }

      for (const removedItem of removedItems) {
        await api.put(
          `/educators/workout-items/${removedItem.workout_item_id}`,
          {
            workout_id: Number(id),
            exercise_id: Number(removedItem.exercise_id),
            day_of_week: Number(removedItem.day_of_week),
            series: removedItem.series ? Number(removedItem.series) : null,
            repetitions: removedItem.repetitions
              ? Number(removedItem.repetitions)
              : null,
            weight_load: removedItem.weight_load
              ? Number(removedItem.weight_load)
              : null,
            duration_time: removedItem.duration_time
              ? Number(removedItem.duration_time)
              : null,
            rest_time: removedItem.rest_time
              ? Number(removedItem.rest_time)
              : null,
            send_notification: Boolean(removedItem.send_notification),
            is_active: false,
          }
        );
      }

      alert("Treino atualizado com sucesso!");
      nav("/treinos");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Não foi possível atualizar o treino."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return (
      <div>
        <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
          Editar Treino
        </h1>

        <div className="bg-sf-panel rounded-md shadow-soft p-6 text-center text-base font-serif">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Editar Treino
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-sf-panel rounded-md shadow-soft p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-base font-serif">Paciente</label>
              <select
                disabled
                value={form.patient_id}
                onChange={(e) => setField("patient_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="">Selecione o paciente</option>
                {patients.map((patient) => (
                  <option
                    key={getPatientId(patient)}
                    value={getPatientId(patient)}
                  >
                    {getPatientName(patient)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Tipo de Treino
              </label>
              <select
                value={form.workout_type_id}
                onChange={(e) => setField("workout_type_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value="">Selecione</option>
                {workoutTypes.map((type) => (
                  <option
                    key={getWorkoutTypeId(type)}
                    value={getWorkoutTypeId(type)}
                  >
                    {getWorkoutTypeName(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-base font-serif">
                Início do Treino
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Fim do Treino
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setField("end_date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Finalização do Treino
              </label>
              <input
                type="date"
                value={form.finalized_at}
                onChange={(e) => setField("finalized_at", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-sf-panel rounded-md shadow-soft p-6">
          <div className="mb-4">
            <button
              type="button"
              onClick={addItem}
              className="rounded-md bg-sf-greenDark px-4 py-2 text-sm text-white hover:bg-sf-green"
            >
              Adicionar exercício
            </button>
          </div>

          {items.map((item, index) => {
            const selectedExercise = getExerciseById(item.exercise_id);
            const exerciseLink = selectedExercise?.link_exercise ?? "";
            const muscleGroupName =
              selectedExercise?.muscle_group_name ??
              selectedExercise?.muscle_group?.name ??
              "";

            return (
              <div
                key={item.workout_item_id ?? index}
                className="mb-6 rounded-md border border-gray-300 p-4 last:mb-0"
              >
                <div className="mb-3">
                  <h2 className="font-serif text-xl">Exercício {index + 1}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Exercício
                    </label>
                    <select
                      value={item.exercise_id}
                      onChange={(e) =>
                        setItemField(index, "exercise_id", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="">Selecione</option>
                      {exercises.map((exercise) => (
                        <option
                          key={getExerciseId(exercise)}
                          value={getExerciseId(exercise)}
                        >
                          {getExerciseName(exercise)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Séries
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.series}
                      onChange={(e) =>
                        setItemField(index, "series", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Repetições
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.repetitions}
                      onChange={(e) =>
                        setItemField(index, "repetitions", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Carga
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.weight_load}
                      onChange={(e) =>
                        setItemField(index, "weight_load", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Tempo de Descanso
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.rest_time}
                      onChange={(e) =>
                        setItemField(index, "rest_time", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Grupo Muscular
                    </label>
                    <input
                      type="text"
                      value={muscleGroupName}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Duração / Tempo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.duration_time}
                      onChange={(e) =>
                        setItemField(index, "duration_time", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Dia da Semana
                    </label>
                    <select
                      value={item.day_of_week}
                      onChange={(e) =>
                        setItemField(index, "day_of_week", e.target.value)
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
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-base font-serif">
                      Link
                    </label>
                    <input
                      type="text"
                      value={exerciseLink}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                      readOnly
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-base font-serif">
                      <input
                        type="checkbox"
                        checked={item.send_notification}
                        onChange={(e) =>
                          setItemField(
                            index,
                            "send_notification",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      Enviar notificação ao paciente
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remover exercício
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col justify-center gap-3 pt-8 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={() => nav("/treinos")}
              className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-sf-greenDark px-6 py-2 text-base text-white hover:bg-sf-green disabled:opacity-60 md:w-80"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}