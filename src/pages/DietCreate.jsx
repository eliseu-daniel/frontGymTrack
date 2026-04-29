import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function normalizeSendNotification(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export default function DietCreate() {
  const nav = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    objective: "",
    calories: "",
    diet_type: "",
    goal_weight: "",
    carbohydrates: "",
    proteins: "",
    fats: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const [items, setItems] = useState([
    {
      meals_id: "",
      food_id: "",
      meal_time: "",
      quantity: "",
      measure: "gr",
      others: "",
      send_notification: false,
    },
  ]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoadingPage(true);

      const [patientsRes, foodsRes, mealsRes] = await Promise.all([
        api.get("/educators/patient/for-educator").catch(() => null),
        api.get("/educators/foods").catch(() => null),
        api.get("/educators/meals").catch(() => null),
      ]);

      const patientsData =
        patientsRes?.data?.patients ??
        patientsRes?.data?.Patients ??
        patientsRes?.data?.data ??
        patientsRes?.data ??
        [];

      const foodsData =
        foodsRes?.data?.foodData ||
        foodsRes?.data?.foods ||
        foodsRes?.data?.message ||
        foodsRes?.data?.data ||
        [];

      const mealsData =
        mealsRes?.data?.mealData ||
        mealsRes?.data?.["mealData:"] ||
        mealsRes?.data?.meals ||
        mealsRes?.data?.data ||
        [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setFoods(Array.isArray(foodsData) ? foodsData : []);
      setMeals(Array.isArray(mealsData) ? mealsData : []);
    } catch (error) {
      alert("Erro ao carregar pacientes, alimentos ou refeições.");
    } finally {
      setLoadingPage(false);
    }
  }

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

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        meals_id: "",
        food_id: "",
        meal_time: "",
        quantity: "",
        measure: "gr",
        others: "",
        send_notification: false,
      },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function getPatientId(patient) {
    return patient.id ?? patient.patient_id;
  }

  function getPatientName(patient) {
    return patient.name ?? patient.nome ?? "Paciente";
  }

  function validateForm() {
    if (!form.patient_id) {
      alert("Selecione o paciente.");
      return false;
    }

    if (!form.calories) {
      alert("Preencha as calorias.");
      return false;
    }

    if (!form.proteins) {
      alert("Preencha as proteínas.");
      return false;
    }

    if (!form.carbohydrates) {
      alert("Preencha os carboidratos.");
      return false;
    }

    if (!form.fats) {
      alert("Preencha as gorduras.");
      return false;
    }

    if (!form.start_date) {
      alert("Preencha a data de início da dieta.");
      return false;
    }

    if (!form.end_date) {
      alert("Preencha a data de fim da dieta.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.meals_id) {
        alert(`Selecione a refeição do item ${i + 1}.`);
        return false;
      }

      if (!item.food_id) {
        alert(`Selecione o alimento do item ${i + 1}.`);
        return false;
      }

      if (!item.meal_time) {
        alert(`Preencha o horário da refeição do item ${i + 1}.`);
        return false;
      }

      if (!item.quantity) {
        alert(`Preencha a quantidade do item ${i + 1}.`);
        return false;
      }

      if (!item.measure) {
        alert(`Selecione a medida do item ${i + 1}.`);
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

      const dietPayload = {
        patient_id: Number(form.patient_id),
        diet_type: form.diet_type || null,
        goal_weight: form.goal_weight || null,
        objective: form.objective || null,
        calories: Number(form.calories),
        proteins: Number(form.proteins),
        carbohydrates: Number(form.carbohydrates),
        fats: Number(form.fats),
        start_date: form.start_date,
        end_date: form.end_date,
        finalized_at: form.finalized_at || null,
      };

      const dietResponse = await api.post("/educators/diets", dietPayload);

      const createdDiet =
        dietResponse?.data?.data ||
        dietResponse?.data?.diet ||
        dietResponse?.data;

      const dietId =
        createdDiet?.id ||
        createdDiet?.diet_id ||
        dietResponse?.data?.id ||
        dietResponse?.data?.diet_id;

      if (!dietId) {
        throw new Error(
          "A dieta foi enviada, mas a API não retornou o ID da dieta criada."
        );
      }

      for (const item of items) {
        const itemPayload = {
          diet_id: Number(dietId),
          food_id: Number(item.food_id),
          meals_id: Number(item.meals_id),
          meal_time: item.meal_time,
          quantity: Number(item.quantity),
          measure: item.measure,
          others: item.others || null,
          send_notification: normalizeSendNotification(item.send_notification)
            ? 1
            : 0,
          is_active: true,
        };

        await api.post("/educators/diet-items", itemPayload);
      }

      alert("Dieta cadastrada com sucesso!");
      nav("/dietas");
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Não foi possível cadastrar a dieta.";

      alert(apiMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return (
      <div className="bg-sf-panel rounded-md shadow-soft p-6 text-center text-base font-serif">
        Carregando...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Cadastro de Dieta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-sf-panel rounded-md shadow-soft p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-base font-serif">Paciente</label>
              <select
                value={form.patient_id}
                onChange={(e) => setField("patient_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                disabled={loadingPage}
              >
                <option value="">
                  {loadingPage ? "Carregando..." : "Selecione o paciente"}
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
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">Objetivo</label>
              <input
                type="text"
                value={form.objective}
                onChange={(e) => setField("objective", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">Calorias</label>
              <input
                type="number"
                value={form.calories}
                onChange={(e) => setField("calories", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Tipo de Dieta
              </label>
              <input
                type="text"
                value={form.diet_type}
                onChange={(e) => setField("diet_type", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Carboidratos
              </label>
              <input
                type="number"
                value={form.carbohydrates}
                onChange={(e) => setField("carbohydrates", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Proteínas
              </label>
              <input
                type="number"
                value={form.proteins}
                onChange={(e) => setField("proteins", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">Gorduras</label>
              <input
                type="number"
                value={form.fats}
                onChange={(e) => setField("fats", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Peso Meta
              </label>
              <input
                type="text"
                value={form.goal_weight}
                onChange={(e) => setField("goal_weight", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-base font-serif">
                Início da Dieta
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-base font-serif">
                Fim da Dieta
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
                Finalização da Dieta
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
          <div className="space-y-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-300 pb-6 last:border-b-0"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Refeição
                    </label>
                    <select
                      value={item.meals_id}
                      onChange={(e) =>
                        updateItem(index, "meals_id", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="">Tipo Refeição</option>
                      {meals.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Horário da Refeição
                    </label>
                    <input
                      type="time"
                      value={item.meal_time}
                      onChange={(e) =>
                        updateItem(index, "meal_time", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Alimento
                    </label>
                    <select
                      value={item.food_id}
                      onChange={(e) =>
                        updateItem(index, "food_id", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="">Selecionar Alimento</option>
                      {foods.map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-base font-serif">
                      Und / Gr / Ml / L
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                        placeholder="Quantidade"
                      />

                      <select
                        value={item.measure}
                        onChange={(e) =>
                          updateItem(index, "measure", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                      >
                        <option value="und">und</option>
                        <option value="gr">gr</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-base font-serif">
                      Outro
                    </label>
                    <input
                      type="text"
                      value={item.others}
                      onChange={(e) =>
                        updateItem(index, "others", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="Outro"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-base font-serif">
                      <input
                        type="checkbox"
                        checked={item.send_notification}
                        onChange={(e) =>
                          updateItem(
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
                    className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Remover item
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
              onClick={() => nav("/dietas")}
              className="w-full rounded-xl border border-sf-green text-sf-greenDark px-6 py-2 text-base md:w-80"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-sf-greenDark text-white px-6 py-2 text-base hover:bg-sf-green disabled:opacity-60 md:w-80"
            >
              {saving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
