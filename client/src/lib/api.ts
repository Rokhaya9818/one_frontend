// Client API REST

function getAPIBaseURL(): string {
  // Prod (Netlify / Vercel)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Dev local avec proxy Vite
  if (import.meta.env.DEV) {
    return "";
  }

  // Backend Render
  return "https://one-backend-6.onrender.com";
}

const API_BASE_URL = getAPIBaseURL();
console.log("[API BASE URL]", API_BASE_URL);

// =======================
// Types
// =======================

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

// =======================
// Fetch helper
// =======================

async function fetchAPI<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "Toutes") {
        qs.append(k, String(v));
      }
    });
    if (qs.toString()) url += `?${qs.toString()}`;
  }

  console.log("[API REQUEST]", url);

  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.text();
    console.error("[API ERROR]", response.status, err);
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

// =======================
// API
// =======================

export const api = {
  dashboard: {
    kpis: () =>
      fetchAPI<DashboardKPIs>("/api/dashboard/kpis"),

    fvrHumainTotal: () =>
      fetchAPI<number>("/api/dashboard/fvr-humain-total"),

    fvrHumainByRegion: () =>
      fetchAPI<RegionStat[]>("/api/dashboard/fvr-humain-by-region"),

    fvrAnimalTotal: () =>
      fetchAPI<number>("/api/dashboard/fvr-animal-total"),

    fvrAnimalByRegion: () =>
      fetchAPI<RegionStat[]>("/api/dashboard/fvr-animal-by-region"),

    malariaByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/api/dashboard/malaria-by-indicator"),

    tuberculoseByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/api/dashboard/tuberculose-by-indicator"),

    mapData: () =>
      fetchAPI<RegionMapData[]>("/api/dashboard/map-data"),
  },

  malaria: {
    list: () =>
      fetchAPI<MalariaData[]>("/api/malaria/list"),
  },

  tuberculose: {
    list: () =>
      fetchAPI<TuberculoseData[]>("/api/tuberculose/list"),
  },

  fvrHumain: {
    list: () =>
      fetchAPI<FvrHumainData[]>("/api/fvr-humain/list"),
  },

  fvrAnimal: {
    list: () =>
      fetchAPI<FvrAnimalData[]>("/api/fvr-animal/list"),
  },

  grippeAviaire: {
    list: () =>
      fetchAPI<GrippeAviaireData[]>("/api/grippe-aviaire/list"),
  },

  pollutionAir: {
    list: () =>
      fetchAPI<PollutionAirData[]>("/api/pollution-air/list"),
  },

  regions: {
    list: () =>
      fetchAPI<RegionData[]>("/api/regions/list"),
  },
};
