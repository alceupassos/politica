import { Chart, type ChartConfiguration } from "chart.js/auto";

const charts = new Map<string, Chart>();
const GRID = "rgba(255,255,255,0.06)";
const TICK = "#8a8aaa";

function createChart(config: ChartConfiguration): ChartConfiguration {
  if (config.type === "pie" || config.type === "doughnut") {
    return {
      ...config,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          ...(config.options?.plugins ?? {}),
        },
        ...config.options,
      },
    };
  }

  return {
    ...config,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        ...(config.options?.plugins ?? {}),
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        ...(config.options?.scales ?? {}),
      },
      ...config.options,
    },
  };
}

const chartConfigs: Record<string, ChartConfiguration[]> = {
  dashboard: [
    {
      type: "line",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
        datasets: [
          {
            label: "Intenção %",
            data: [4.1, 4.8, 5.5, 6.2, 6.8, 7.4, 8.1, 8.7],
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.12)",
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: "#22c55e",
            pointRadius: 3,
          },
        ],
      },
      options: {},
    },
    {
      type: "doughnut",
      data: {
        labels: ["16–24", "25–34", "35–44", "45–59", "60+"],
        datasets: [
          {
            data: [12, 18, 24, 22, 14],
            backgroundColor: ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#6b7280"],
            borderWidth: 0,
          },
        ],
      },
      options: {},
    },
  ],
  pesquisas: [
    {
      type: "bar",
      data: {
        labels: ["Datafolha", "IBOPE", "Quaest", "Atlas", "Paraná"],
        datasets: [
          {
            label: "%",
            data: [9.1, 12.8, 7.6, 8.9, 14.2],
            backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e"],
            borderRadius: 4,
          },
        ],
      },
      options: {},
    },
    {
      type: "line",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
        datasets: [
          { label: "Datafolha", data: [5.8, 6.4, 7.2, 8.1, 9.1], borderColor: "#22c55e", tension: 0.4, borderWidth: 2, pointRadius: 3 },
          { label: "IBOPE", data: [8.2, 9.1, 10.4, 11.8, 12.8], borderColor: "#3b82f6", tension: 0.4, borderWidth: 2, pointRadius: 3 },
          { label: "Quaest", data: [4.8, 5.5, 6.1, 7.0, 7.6], borderColor: "#f59e0b", tension: 0.4, borderWidth: 2, pointRadius: 3 },
        ],
      },
      options: {},
    },
  ],
  territorios: [
    {
      type: "bar",
      data: {
        labels: ["16–24", "25–34", "35–44", "45–59", "60+"],
        datasets: [
          {
            label: "Aprovação %",
            data: [58, 63, 71, 68, 44],
            backgroundColor: ["#3b82f6", "#22c55e", "#22c55e", "#22c55e", "#ef4444"],
            borderRadius: 4,
          },
        ],
      },
      options: {},
    },
    {
      type: "line",
      data: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        datasets: [
          { label: "Angra", data: [82, 85, 87, 90], borderColor: "#22c55e", tension: 0.4, borderWidth: 2 },
          { label: "Paraty", data: [58, 60, 61, 62], borderColor: "#3b82f6", tension: 0.4, borderWidth: 2 },
          { label: "Mangaratiba", data: [45, 47, 46, 48], borderColor: "#f59e0b", tension: 0.4, borderWidth: 2 },
          { label: "Itaguaí", data: [40, 38, 37, 38], borderColor: "#ef4444", tension: 0.4, borderWidth: 2 },
        ],
      },
      options: {},
    },
  ],
  concorrentes: [
    {
      type: "bar",
      data: {
        labels: ["Angra", "Paraty", "R. Claro", "Mangaratiba", "Itaguaí"],
        datasets: [
          { label: "Renato", data: [88, 62, 55, 48, 38], backgroundColor: "rgba(34,197,94,0.8)", borderRadius: 3 },
          { label: "Chico", data: [12, 18, 22, 38, 52], backgroundColor: "rgba(239,68,68,0.8)", borderRadius: 3 },
        ],
      },
      options: {},
    },
  ],
  redes: [
    {
      type: "line",
      data: {
        labels: ["01/04", "07/04", "14/04", "21/04", "28/04", "30/04"],
        datasets: [
          { label: "Instagram", data: [31200, 31800, 32000, 32400, 32600, 32700], borderColor: "#e1306c", tension: 0.4, borderWidth: 2 },
          { label: "Facebook", data: [46800, 47100, 47500, 47900, 48100, 48300], borderColor: "#1877f2", tension: 0.4, borderWidth: 2 },
          { label: "Twitter/X", data: [17800, 17900, 18000, 18050, 18080, 18100], borderColor: "#1da1f2", tension: 0.4, borderWidth: 2 },
        ],
      },
      options: {},
    },
    {
      type: "doughnut",
      data: {
        labels: ["Positivo", "Neutro", "Negativo"],
        datasets: [{ data: [78, 14, 8], backgroundColor: ["#22c55e", "#6b7280", "#ef4444"], borderWidth: 0 }],
      },
      options: {},
    },
  ],
  diario: [
    {
      type: "bar",
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        datasets: [{ label: "Atividades", data: [8, 12, 9, 14, 11, 6], backgroundColor: "rgba(34,197,94,0.75)", borderRadius: 4 }],
      },
      options: {},
    },
  ],
  ia: [
    {
      type: "line",
      data: {
        labels: ["Ago/26", "Set/26", "Out/26 (Eleição)"],
        datasets: [
          { label: "Otimista", data: [72000, 78000, 88000], borderColor: "#22c55e", tension: 0.4, borderWidth: 2 },
          { label: "Base", data: [68000, 71000, 72100], borderColor: "#3b82f6", tension: 0.4, borderWidth: 2 },
          { label: "Pessimista", data: [60000, 62000, 64000], borderColor: "#ef4444", tension: 0.4, borderWidth: 2, borderDash: [5, 3] },
        ],
      },
      options: {},
    },
  ],
  demandas: [
    {
      type: "bar",
      data: {
        labels: ["Saúde", "Segurança", "Infraest.", "Emprego", "Educação", "Turismo", "Moradia"],
        datasets: [
          {
            label: "Menções",
            data: [482, 341, 298, 261, 198, 176, 91],
            backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e", "#60a5fa", "#f472b6"],
            borderRadius: 4,
          },
        ],
      },
      options: { indexAxis: "y" },
    },
  ],
  financeiro: [
    {
      type: "line",
      data: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8 (prev)", "Sem 9 (prev)", "Sem 10 (prev)"],
        datasets: [
          { label: "Planejado", data: [200, 260, 310, 360, 410, 460, 510, 620, 720, 800], borderColor: "#3b82f6", tension: 0.3, borderWidth: 2, borderDash: [5, 3], pointRadius: 2 },
          { label: "Realizado", data: [180, 320, 440, 540, 650, 760, 850, null, null, null], borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", fill: true, tension: 0.3, borderWidth: 2, pointBackgroundColor: "#22c55e", pointRadius: 3 },
          { label: "Projeção", data: [null, null, null, null, null, null, 850, 980, 1100, 1140], borderColor: "#f59e0b", tension: 0.3, borderWidth: 2, borderDash: [3, 3], pointRadius: 2 },
        ],
      },
      options: {},
    },
    {
      type: "doughnut",
      data: {
        labels: ["Fundo Eleitoral", "Fundo Partidário", "Doações PF"],
        datasets: [{ data: [80, 15, 5], backgroundColor: ["#22c55e", "#3b82f6", "#fb923c"], borderWidth: 0 }],
      },
      options: {},
    },
  ],
  crm: [
    {
      type: "bar",
      data: {
        labels: ["Angra dos Reis", "Paraty", "Mangaratiba", "Itaguaí"],
        datasets: [
          { label: "Meta", data: [21000, 10500, 6800, 6700], backgroundColor: "rgba(59,130,246,0.4)", borderRadius: 3, borderSkipped: false },
          { label: "Comprometidos", data: [17100, 6300, 3700, 1300], backgroundColor: ["#22c55e", "#f59e0b", "#f59e0b", "#ef4444"], borderRadius: 3, borderSkipped: false },
        ],
      },
      options: {
        plugins: { legend: { display: true, labels: { color: "#8a8aaa", font: { size: 9 } } } },
      },
    },
  ],
  comunicacao: [
    {
      type: "line",
      data: {
        labels: ["Sem 14", "Sem 15", "Sem 16", "Sem 17", "Sem 18"],
        datasets: [
          { label: "WhatsApp", data: [62, 65, 68, 71, 68], borderColor: "#25d366", tension: 0.4, borderWidth: 2, pointRadius: 3 },
          { label: "Instagram", data: [4.8, 5.2, 5.9, 6.4, 6.8], borderColor: "#e1306c", tension: 0.4, borderWidth: 2, pointRadius: 3 },
        ],
      },
      options: {
        plugins: { legend: { display: true, labels: { color: "#8a8aaa", font: { size: 9 } } } },
      },
    },
  ],
};

const sectionCanvases: Record<string, string[]> = {
  dashboard: ["cEvolucao", "cFaixa"],
  pesquisas: ["cInstitutos", "cHistPeq"],
  territorios: ["cIdade", "cFlutuacao"],
  concorrentes: ["cConcor"],
  redes: ["cRedes", "cSentimento"],
  diario: ["cDiario"],
  ia: ["cProjecao"],
  demandas: ["cDemandas"],
  financeiro: ["cExecucao", "cFontes"],
  crm: ["cCrmMunicipio"],
  comunicacao: ["cEngajamento"],
};

export function destroyCharts() {
  charts.forEach((chart) => chart.destroy());
  charts.clear();
}

export function renderSectionCharts(sectionId: string) {
  destroyCharts();

  const configs = chartConfigs[sectionId];
  const canvases = sectionCanvases[sectionId];

  if (!configs || !canvases) return;

  canvases.forEach((canvasId, index) => {
    const element = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!element) return;

    const chart = new Chart(element, createChart(configs[index]));
    charts.set(canvasId, chart);
  });
}
