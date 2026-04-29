import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { api } from "../services/api";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

function formatComment(text) {
  if (!text) return "-";
  if (text.length <= 50) return text;
  return `${text.slice(0, 50)}...`;
}

export default function Feedbacks() {
  const nav = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchFeedbacks() {
    try {
      setLoading(true);

      const [dietResponse, workoutResponse] = await Promise.all([
        api.get("/educators/diet-feedbacks"),
        api.get("/educators/workout-feedbacks"),
      ]);

      const dietFeedbacks = (dietResponse.data?.data ?? []).map((item) => ({
        id: item.id,
        patient_name: item.patient_name,
        comment: item.comment,
        created_at: item.created_at,
        type: "Dieta",
      }));

      const workoutFeedbacks = (workoutResponse.data?.DataFeedback ?? []).map(
        (item) => ({
          id: item.id,
          patient_name: item.patient_name,
          comment: item.comment,
          created_at: item.created_at,
          type: "Treino",
        })
      );

      const mergedFeedbacks = [...dietFeedbacks, ...workoutFeedbacks].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setFeedbacks(mergedFeedbacks);
    } catch (error) {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const columns = [
    "NOME",
    "DIETA/TREINO",
    "COMENTARIO",
    "DATA FEEDBACK",
    "AÇÕES",
  ];

  const rows = (feedbacks ?? []).map((feedback) => [
    feedback.patient_name ?? "-",
    feedback.type ?? "-",
    formatComment(feedback.comment),
    formatDateBR(feedback.created_at),
    <div
      key={`actions-${feedback.type}-${feedback.id}`}
      className="flex items-center gap-2"
    >
      <button
        onClick={() =>
          nav("/feedback/visualizar", {
            state: { feedback },
          })
        }
        className="text-blue-600 border border-blue-600 px-2 py-[2px] rounded"
      >
        Visualizar
      </button>
    </div>,
  ]);

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Feedback
      </h1>

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