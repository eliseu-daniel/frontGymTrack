import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { api } from "../services/api";

// data comes from API endpoints: `progress/patients` and `progress/reports`

function formatLabelDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("pt-BR");
}

function formatValue(value, unit = "") {
  if (value === null || value === undefined || value === "") return "-";

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return `${numericValue.toLocaleString("pt-BR")} ${unit}`.trim();
  }

  return `${value} ${unit}`.trim();
}

function normalizeChartData(data) {
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => {
    const rawDate =
      item?.date ??
      item?.created_at ??
      item?.updated_at ??
      `initial-${index}`; // 👈 fallback

    const rawValue = item?.value ?? 0;
    const numericValue = Number(rawValue);

    return {
      ...item,
      chartKey: `${rawDate}-${index}`,
      originalDate: rawDate,
      value: Number.isNaN(numericValue) ? 0 : numericValue,
      order: index + 1,
    };
  });
}

function CustomTooltip({ active, payload, title, unit }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload ?? {};
  const rawValue = data?.value;
  const rawDate = data?.originalDate;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="text-sm text-gray-600">
        Data:{" "}
        <span className="font-medium text-gray-900">
          {formatLabelDate(rawDate)}
        </span>
      </p>

      <p className="text-sm text-gray-600">
        Registro:{" "}
        <span className="font-medium text-gray-900">
          #{data?.order ?? "-"}
        </span>
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Valor:{" "}
        <span className="font-semibold text-sf-greenDark">
          {formatValue(rawValue, unit)}
        </span>
      </p>
    </div>
  );
}

function ChartCard({ title, data, unit = "" }) {
  const safeData = useMemo(() => normalizeChartData(data), [data]);

  return (
    <div className="w-full min-w-0">
      <h3 className="mb-2 text-base font-serif">{title}</h3>

      <div className="w-full min-w-0 overflow-hidden rounded-md border border-gray-300 bg-white p-4">
        {safeData.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-gray-500">
            Nenhum dado disponível
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={safeData}
              barSize={34}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#d1d5db"
              />

              <XAxis
                dataKey="chartKey"
                tickFormatter={(_, index) =>
                  formatLabelDate(safeData[index]?.originalDate)
                }
                tick={{ fontSize: 11, fill: "#374151" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                interval={0}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#374151" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />

              <Tooltip
                cursor={{ fill: "rgba(155, 203, 159, 0.18)" }}
                content={<CustomTooltip title={title} unit={unit} />}
              />

              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                activeBar={{
                  fill: "#6fa276",
                  stroke: "#4f7d56",
                  strokeWidth: 1,
                }}
              >
                {safeData.map((entry, index) => (
                  <Cell
                    key={`cell-${title}-${entry.chartKey}-${index}`}
                    fill="#9BCB9F"
                    className="transition-all duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function Reports() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedType, setSelectedType] = useState("diet");
  const [reports, setReports] = useState(null);
  const [anthropometry, setAnthropometry] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchPatients() {
      try {
        setLoadingPatients(true);

        const res = await api.get("/educators/progress/patients");
        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : [];
        setPatients(data);

        if (data.length > 0) {
          setSelectedPatient((prev) =>
            prev && data.some((p) => String(p.id) === prev)
              ? prev
              : String(data[0].id)
          );
        } else {
          setSelectedPatient("");
        }
      } catch {
        if (!mounted) return;
        setPatients([]);
        setSelectedPatient("");
      } finally {
        if (mounted) setLoadingPatients(false);
      }
    }

    fetchPatients();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setReports(null);
      return;
    }

    let mounted = true;

    async function fetchReports() {
      try {
        setLoadingReports(true);

        const res = await api.get("/educators/progress/reports", {
          params: { patient_id: selectedPatient, type: selectedType },
        });

        if (!mounted) return;
        setReports(res.data || {});
      } catch {
        if (!mounted) return;
        setReports({});
      } finally {
        if (mounted) setLoadingReports(false);
      }
    }

    fetchReports();

    return () => {
      mounted = false;
    };
  }, [selectedPatient, selectedType]);

  useEffect(() => {
    if (!selectedPatient) {
      setAnthropometry([]);
      return;
    }

    let mounted = true;

    async function fetchAnthropometry() {
      try {
        const res = await api.get("/educators/anthropometrys", {
          params: { patient_id: selectedPatient },
        });

        if (!mounted) return;

        const anthropometryList = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        setAnthropometry(
          anthropometryList.filter(
            (item) =>
              String(
                item?.patient_id ??
                  item?.patient?.id ??
                  item?.id_patient ??
                  ""
              ) === String(selectedPatient)
          )
        );
      } catch {
        if (!mounted) return;
        setAnthropometry([]);
      }
    }

    fetchAnthropometry();

    return () => {
      mounted = false;
    };
  }, [selectedPatient]);

  const selectedData = useMemo(() => {
    return reports ?? {};
  }, [reports]);

  const weightWithInitial = useMemo(() => {
    const weightHistory = Array.isArray(selectedData.weight)
      ? selectedData.weight
      : [];

    const initialAnthropometry = Array.isArray(anthropometry)
      ? anthropometry.find(
          (item) =>
            String(
              item?.patient_id ?? item?.patient?.id ?? item?.id_patient ?? ""
            ) === String(selectedPatient) &&
            item?.weights_initial !== null &&
            item?.weights_initial !== undefined &&
            item?.weights_initial !== ""
        )
      : null;

    if (!initialAnthropometry) {
      return weightHistory;
    }

    return [
      {
        date:
          initialAnthropometry.date ??
          initialAnthropometry.created_at ??
          initialAnthropometry.updated_at ??
          null,
        value: initialAnthropometry.weights_initial,
      },
      ...weightHistory,
    ];
  }, [anthropometry, selectedData.weight, selectedPatient]);

  const chartConfig = useMemo(() => {
    if (selectedType === "diet") {
      return [
        {
          title: "Peso",
          data: weightWithInitial,
          unit: "kg",
        },
        {
          title: "Calorias",
          data: selectedData.calories ?? [],
          unit: "kcal",
        },
        {
          title: "TMB",
          data: selectedData.tmb ?? [],
          unit: "kcal",
        },
        {
          title: "Gordura Corporal",
          data: selectedData.bodyFat ?? [],
          unit: "%",
        },
      ];
    }

    return [
      {
        title: "Peso",
        data: weightWithInitial,
        unit: "kg",
      },
      {
        title: "Cargas",
        data: selectedData.loads ?? [],
        unit: "kg",
      },
      {
        title: "Repetições",
        data: selectedData.repetitions ?? [],
        unit: "rep",
      },
      {
        title: "Gordura Corporal",
        data: selectedData.bodyFat ?? [],
        unit: "%",
      },
    ];
  }, [selectedData, selectedType, weightWithInitial]);

  return (
    <div className="w-full min-w-0">
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Relatórios
      </h1>

      <div className="w-full min-w-0 bg-sf-panel rounded-md shadow-soft p-6">
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 min-w-0">
          <div className="min-w-0">
            <label className="mb-1 block text-base font-serif">Paciente</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              disabled={loadingPatients || patients.length === 0}
            >
              {loadingPatients ? (
                <option value="">Carregando pacientes...</option>
              ) : patients.length === 0 ? (
                <option value="">Nenhum paciente encontrado</option>
              ) : (
                patients.map((patient) => (
                  <option key={patient.id} value={String(patient.id)}>
                    {patient.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-base font-serif">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="diet">Dieta</option>
              <option value="workout">Treino</option>
            </select>
          </div>
        </div>

        {loadingReports ? (
          <div className="py-10 text-center text-sm text-gray-600">
            Carregando relatórios...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0 w-full">
            {chartConfig.map((chart) => (
              <ChartCard
                key={chart.title}
                title={chart.title}
                data={chart.data}
                unit={chart.unit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
