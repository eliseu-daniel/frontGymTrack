import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import PatientCreate from "./pages/PatientCreate.jsx";
import PatientEdit from "./pages/PatientEdit.jsx";
import PatientRegistrationCreate from "./pages/PatientRegistrationCreate";
import Workout from "./pages/Workout";
import Diets from "./pages/Diets";
import Feedback from "./pages/Feedback";
import Reports from "./pages/Reports.jsx";
import AnthropometryCreate from "./pages/AnthropometryCreate.jsx";
import Anthropometry from "./pages/Anthropometry.jsx";
import Settings from "./pages/Settings.jsx";
import FeedbackView from "./pages/FeedbackView.jsx";
import WorkoutCreate from "./pages/WorkoutCreate.jsx";
import WorkoutEdit from "./pages/WorkoutEdit.jsx";
import DietCreate from "./pages/DietCreate.jsx";
import DietEdit from "./pages/DietEdit.jsx";
import AnthropometryEdit from "./pages/AnthropometryEdit.jsx";
import AnthropometryWeightUpdate from "./pages/AnthropometryWeightUpdate.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      <Route path="/cadastro" element={<Register />} />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<Patients />} />
        <Route path="/pacientes/cadastro" element={<PatientCreate />} />
        <Route path="/pacientes/:id/editar" element={<PatientEdit />} />
        <Route path="/pacientes/:id/matricula" element={<PatientRegistrationCreate />} />
        <Route path="/treinos" element={<Workout />} />
        <Route path="/treinos/cadastro" element={<WorkoutCreate />} />
        <Route path="/treinos/editar/:id" element={<WorkoutEdit />} />
        <Route path="/dietas" element={<Diets />} />
        <Route path="/dietas/cadastrar" element={<DietCreate />} />
        <Route path="/dietas/:id/editar" element={<DietEdit />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback/visualizar" element={<FeedbackView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/antropometria/cadastro" element={<AnthropometryCreate />} />
        <Route path="/antropometria" element={<Anthropometry />} />
        <Route path="/antropometria/:id/editar" element={<AnthropometryEdit />} />
        <Route path="/antropometria/:id/peso" element={<AnthropometryWeightUpdate />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
