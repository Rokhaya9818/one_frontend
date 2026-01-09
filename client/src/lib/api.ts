// ===============================
// Client API REST (sans tRPC)
// ===============================

// 🔹 URL de base API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://one-backend-6.onrender.com";

console.log("[API Config] Base URL:", API_BASE_URL);

// ===============================
// Interfaces
// ===============================

export interface DashboardKPIs {
  malaria_cases: string;
  tuberculose_cases: string;
  fvr_humain_cases: number;
  fvr_animal_cases: number;
  grippe_aviaire_cases: number;
  pm25_recent: string;
  taux_letalite_fvr: number;
}

export interface RegionStat {
  region: string;
  total: number;
}

export interface IndicatorStat {
  name: string;
  value: number;
}

export interface RegionMapData {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  malaria: number;
  total_cases: number;
}

export interface MalariaData {
  id: number;
  indicator_code: string;
  indicator_name: string;
  year: number;
  value: string | null;
  numeric_value: string | null;
}

export interface TuberculoseData {
  id: number;
  indicator_code: string;
  indicator_name: string;
  year: number;
  value: string | null;
  numeric_value: string | null;
}

export interface FvrHumainData {
  id: number;
  date_bilan: string;
  cas_confirmes: number;
  deces: number;
  gueris: number;
  region: string | null;
}

export interface FvrAnimalData {
  id: number;
  annee: number;
  cas: number;
  espece: string | null;
  region: string | null;
}

export interface GrippeAviaireData {
  id: number;
  report_id: string;
  date_rapport: string;
  region: string | null;
  cas_confirmes: number;
}

export interface PollutionAirData {
  id: number;
  annee: number;
  zone: string;
  concentration_pm25: string | null;
}

export interface RegionData {
  id: number;
  nom: string;
  code: string;
}

// ===============================
// Fetch helper
// ===============================

async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "Toutes") {
        searchParams.append(key, String(value));
      }
    });

    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  console.log("[API Request]", url);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[API Error]", response.status, errorText);
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

// ===============================
// API
// ===============================

export const api = {
  dashboard: {
    kpis: () =>
      fetchAPI<DashboardKPIs>("/dashboard/kpis"),

    fvrHumainTotal: () =>
      fetchAPI<number>("/dashboard/fvr-humain-total"),

    fvrHumainByRegion: () =>
      fetchAPI<RegionStat[]>("/dashboard/fvr-humain-by-region"),

    fvrAnimalTotal: () =>
      fetchAPI<number>("/dashboard/fvr-animal-total"),

    fvrAnimalByRegion: () =>
      fetchAPI<RegionStat[]>("/dashboard/fvr-animal-by-region"),

    malariaByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/dashboard/malaria-by-indicator"),

    tuberculoseByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/dashboard/tuberculose-by-indicator"),

    mapData: () =>
      fetchAPI<RegionMapData[]>("/dashboard/map-data"),
  },

  malaria: {
    list: () => fetchAPI<MalariaData[]>("/malaria/list"),
  },

  tuberculose: {
    list: () => fetchAPI<TuberculoseData[]>("/tuberculose/list"),
  },

  fvrHumain: {
    list: () => fetchAPI<FvrHumainData[]>("/fvr-humain/list"),
  },

  fvrAnimal: {
    list: () => fetchAPI<FvrAnimalData[]>("/fvr-animal/list"),
  },

  grippeAviaire: {
    list: () => fetchAPI<GrippeAviaireData[]>("/grippe-aviaire/list"),
  },

  pollutionAir: {
    list: () => fetchAPI<PollutionAirData[]>("/pollution-air/list"),
  },

  regions: {
    list: () => fetchAPI<RegionData[]>("/regions/list"),
  },
};

// ===============================
// Helpers
// ===============================

export const fetchMapData = () => api.dashboard.mapData();
