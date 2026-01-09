// api.ts
// Client API REST pour remplacer tRPC
// Configuration dynamique de l'URL de base de l'API

function getAPIBaseURL(): string {
  // En production (Netlify, Vercel...), utiliser la variable d'environnement
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // En développement local, utiliser le proxy Vite
  if (import.meta.env.DEV) {
    return "/api";
  }

  // Par défaut, utiliser le backend Render
  return "https://one-backend-6.onrender.com";
}

const API_BASE_URL = getAPIBaseURL();
console.log("[API Config] Base URL:", API_BASE_URL, "| Env:", import.meta.env.MODE);

// ====================== Interfaces ======================

interface DashboardKPIs { /* ... ton code existant ... */ }
interface RegionStat { /* ... */ }
interface IndicatorStat { /* ... */ }
interface RegionMapData { /* ... */ }
interface MalariaData { /* ... */ }
interface TuberculoseData { /* ... */ }
interface FvrHumainData { /* ... */ }
interface FvrAnimalData { /* ... */ }
interface GrippeAviaireData { /* ... */ }
interface PollutionAirData { /* ... */ }
interface RegionData { /* ... */ }

// ====================== Fetch Helper ======================

async function fetchAPI<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "Toutes") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  console.log("[API Request]", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API Error]", response.status, errorText);
      throw new Error(`API Error: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    console.log("[API Response]", endpoint, data);
    return data;
  } catch (error) {
    console.error("[API Fetch Error]", url, error);
    throw error;
  }
}

// ====================== API Principal ======================

export const api = {
  dashboard: {
    kpis: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<DashboardKPIs>("/api/dashboard/kpis", filters),
    fvrHumainTotal: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<number>("/api/dashboard/fvr-humain-total", filters),
    fvrHumainByRegion: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<RegionStat[]>("/api/dashboard/fvr-humain-by-region", filters),
    fvrAnimalTotal: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<number>("/api/dashboard/fvr-animal-total", filters),
    fvrAnimalByRegion: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<RegionStat[]>("/api/dashboard/fvr-animal-by-region", filters),
    malariaByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/api/dashboard/malaria-by-indicator"),
    tuberculoseByIndicator: () =>
      fetchAPI<IndicatorStat[]>("/api/dashboard/tuberculose-by-indicator"),
    mapData: (filters?: { region?: string; maladie?: string }) =>
      fetchAPI<RegionMapData[]>("/api/dashboard/map-data", filters),
  },
  malaria: {
    list: (params?: { year_start?: number; year_end?: number }) =>
      fetchAPI<MalariaData[]>("/api/malaria/list", params),
  },
  tuberculose: {
    list: (params?: { year_start?: number; year_end?: number }) =>
      fetchAPI<TuberculoseData[]>("/api/tuberculose/list", params),
  },
  fvrHumain: {
    list: () => fetchAPI<FvrHumainData[]>("/api/fvr-humain/list"),
  },
  fvrAnimal: {
    list: () => fetchAPI<FvrAnimalData[]>("/api/fvr-animal/list"),
  },
  grippeAviaire: {
    list: () => fetchAPI<GrippeAviaireData[]>("/api/grippe-aviaire/list"),
  },
  pollutionAir: {
    list: (params?: { year_start?: number; year_end?: number }) =>
      fetchAPI<PollutionAirData[]>("/api/pollution-air/list", params),
  },
  regions: {
    list: () => fetchAPI<RegionData[]>("/api/regions/list"),
  },
};

// ====================== API Extra (Corrélation + Prédiction) ======================

export const apiExtra = {
  correlations: {
    byRegion: () => fetchAPI("/api/correlations/by-region"),
    alerts: () => fetchAPI("/api/correlations/alerts"),
    summary: () => fetchAPI("/api/correlations/summary"),
  },
  predictions: {
    regions: () => fetchAPI("/api/predictions/regions"),
    summary: () => fetchAPI("/api/predictions/summary"),
    advanced: {
      national: () => fetchAPI("/api/predictions/advanced/national"),
      region: (region_name: string) =>
        fetchAPI(`/api/predictions/advanced/region/${region_name}`),
      status: () => fetchAPI("/api/predictions/advanced/status"),
    },
  },
};
