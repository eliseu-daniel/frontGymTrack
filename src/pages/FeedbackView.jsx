import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

export default function FeedbackView() {
  const nav = useNavigate();
  const location = useLocation();

  const feedback = location.state?.feedback || {};

  return (
    <div>
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Feedback
      </h1>

      <section className="bg-sf-panel rounded-md shadow-soft p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-base font-serif">
              Nome Paciente
            </label>
            <div className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
              {feedback.patient_name || feedback.name || "-"}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-base font-serif">
              Dieta / Treino
            </label>
            <div className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
              {feedback.type || feedback.feedback_type || "-"}
            </div>
          </div>

          <div className="md:col-span-2 md:max-w-[220px]">
            <label className="mb-1 block text-base font-serif">Data</label>
            <div className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
              {formatDateBR(feedback.date || feedback.created_at)}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-base font-serif">
              Comentário
            </label>
            <div className="min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 whitespace-pre-wrap">
              {feedback.comment || feedback.comentario || feedback.description || "-"}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 pt-6 md:flex-row md:justify-end">
          <button
            onClick={() => nav("/feedback")}
            className="w-full rounded-xl bg-blue-500 text-white px-6 py-2 text-base hover:bg-sf-green md:w-80"
          >
            Voltar
          </button>
        </div>
      </section>
    </div>
  );
}