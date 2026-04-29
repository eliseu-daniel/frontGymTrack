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

function formatObjective(text) {
  if (!text) return "-";
  if (text.length <= 30) return text;
  return `${text.slice(0, 30)}...`;
}

export default function Diets() {
  const nav = useNavigate();
  const { patients, fetchPatients } = usePatients();

  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenDietIds, setHiddenDietIds] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  // useEffect(() => {
  //   try {
  //     const saved = JSON.parse(localStorage.getItem("hiddenDiets") ?? "[]");
  //     if (Array.isArray(saved)) {
  //       setHiddenDietIds(saved.map((id) => String(id)));
  //     }
  //   } catch {
  //     setHiddenDietIds([]);
  //   }
  // }, []);

  async function fetchDiets() {
    try {
      setLoading(true);

      const response = await api.get("/educators/diets");
      const data = response.data?.diets ?? response.data ?? [];

      setDiets(Array.isArray(data) ? data : []);
    } catch (error) {
      setDiets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDiets();
  }, []);

  async function handleDelete(diet) {
    const dietId = String(diet.diet_id ?? diet.id);

    const confirmed = window.confirm(
      "Tem certeza que deseja finalizar/excluir esta dieta?"
    );

    if (!confirmed) return;

    try {
      try {
        await api.delete(`/educators/diets/${dietId}`);
      } catch (err) {
        alert(
          "Não foi possível excluir/finalizar a dieta na API. Ela será ocultada nesta tela, mas pode aparecer novamente caso a API retorne os dados dela em algum momento."
        );
      }

      // setHiddenDietIds((prev) => {
      //   if (prev.includes(dietId)) return prev;

      //   const next = [...prev, dietId];
      //   localStorage.setItem("hiddenDiets", JSON.stringify(next));
      //   return next;
      // });

      alert("Dieta excluída com sucesso!");
    } catch (error) {
      alert("Não foi possível excluir a dieta.");
    }
  }

  const patientsById = useMemo(() => {
    return (patients ?? []).reduce((acc, p) => {
      const id = String(p.id ?? p.patient_id ?? "");
      if (id) acc[id] = p;
      return acc;
    }, {});
  }, [patients]);

  const visibleDiets = useMemo(() => {
    return (diets ?? []).filter(
      (diet) => !hiddenDietIds.includes(String(diet.diet_id ?? diet.id))
    );
  }, [diets, hiddenDietIds]);

  const columns = [
    "NOME",
    "E-MAIL",
    "TELEFONE",
    "OBJETIVO",
    "INÍCIO ACOMP",
    "AÇÕES",
  ];

  const rows = visibleDiets.map((diet) => {
    const patient = patientsById[String(diet.patient_id ?? "")] ?? {};

    return [
      diet.patient_name ?? patient.nome ?? patient.name ?? "-",
      diet.email ?? patient.email ?? "-",
      diet.phone ?? diet.telefone ?? patient.telefone ?? patient.phone ?? "-",
      formatObjective(diet.objective),
      formatDateBR(diet.start_date),
      <div
        key={`actions-${diet.diet_id ?? diet.id}`}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => nav(`/dietas/${diet.diet_id ?? diet.id}/editar`)}
          className="border border-green-600 text-green-600 px-2 py-[2px] rounded"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => handleDelete(diet)}
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
        Dietas
      </h1>

      <div className="mb-3">
        <button
          onClick={() => nav("/dietas/cadastrar")}
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