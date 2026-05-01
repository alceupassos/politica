export const navigationGroups = [
  {
    label: "Principal",
    items: [
      { id: "dashboard", icon: "layout-dashboard", label: "Dashboard" },
      { id: "pesquisas", icon: "chart-column", label: "Pesquisas" },
      { id: "territorios", icon: "map", label: "Territórios" },
      { id: "concorrentes", icon: "crosshair", label: "Concorrentes" },
    ],
  },
  {
    label: "Monitoramento",
    items: [
      { id: "redes", icon: "smartphone", label: "Redes Sociais" },
      { id: "midia", icon: "radio-tower", label: "Mídia & Imprensa" },
      { id: "influenciadores", icon: "users-round", label: "Influenciadores" },
      { id: "diario", icon: "clipboard-list", label: "Diário Campanha" },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { id: "ia", icon: "brain-circuit", label: "IA Preditiva" },
      { id: "demandas", icon: "messages-square", label: "Demandas Pop." },
    ],
  },
  {
    label: "Campo",
    items: [
      { id: "candidatos", icon: "user-round-search", label: "Candidatos" },
      { id: "eventos", icon: "calendar-days", label: "Agenda" },
    ],
  },
  {
    label: "Operacional",
    items: [
      { id: "cabos", icon: "network", label: "Rede de Cabos" },
      { id: "crm", icon: "vote", label: "CRM Eleitoral" },
      { id: "material", icon: "package-2", label: "Material Camp." },
      { id: "comunicacao", icon: "message-circle", label: "Comunicação" },
    ],
  },
  {
    label: "Gestão & Jurídico",
    items: [
      { id: "financeiro", icon: "wallet", label: "Gestão de Verba" },
      { id: "compliance", icon: "shield-check", label: "Compliance TSE" },
      { id: "calculadora", icon: "calculator", label: "Calculadora" },
    ],
  },
] as const;

export const refreshableSections = new Set([
  "dashboard",
  "pesquisas",
  "territorios",
  "concorrentes",
  "redes",
  "diario",
  "ia",
  "demandas",
  "financeiro",
  "crm",
  "comunicacao",
]);
