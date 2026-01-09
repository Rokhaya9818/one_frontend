// Client API REST pour remplacer tRPC
// Configuration dynamique de l'URL de base de l'API

// Déterminer l'URL de base de l'API
function getAPIBaseURL(): string {
  // En production (Netlify), utiliser la variable d'environnement
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

// Log pour debug
console.log("[API Config] Base URL:", API_BASE_URL, "| Env:", import.meta.env.MODE);

interface DashboardKPIs {
  malaria_cases: string;
  tuberculose_cases: string;
  fvr_humain_cases: number;
  fvr_animal_cases: number;
  grippe_aviaire_cases: number;
  pm25_recent: string;
  taux_letalite_fvr: number;
}

interface RegionStat {
  region: string;
  total: number;
}

interface IndicatorStat {
  name: string;
  value: number;
}

interface RegionMapData {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  malaria: number;
  total_cases: number;
}

interface MalariaData {
  id: number;
  indicator_code: string;
  indicator_name: string;
  year: number;
  value: string | null;
  numeric_value: string | null;
  low_value: string | null;
  high_value: string | null;
  created_at: string;
}

interface TuberculoseData {
  id: number;
  indicator_code: string;
  indicator_name: string;
  year: number;
  value: string | null;
  numeric_value: string | null;
  low_value: string | null;
  high_value: string | null;
  created_at: string;
}

interface FvrHumainData {
  id: number;
  date_bilan: string;
  cas_confirmes: number;
  deces: number;
  gueris: number;
  region: string | null;
  district: string | null;
  taux_letalite: string | null;
  created_at: string;
}

interface FvrAnimalData {
  id: number;
  annee: number;
  cas: number;
  espece: string | null;
  region: string | null;
  localisation: string | null;
  source: string | null;
  created_at: string;
}

interface GrippeAviaireData {
  id: number;
  report_id: string;
  date_rapport: string;
  region: string | null;
  espece: string | null;
  maladie: string | null;
  cas_confirmes: number;
  deces: number;
  statut_epidemie: string | null;
  created_at: string;
}

interface PollutionAirData {
  id: number;
  annee: number;
  zone: string;
  concentration_pm25: string | null;
  created_at: string;
}

interface RegionData {
  id: number;
  nom: string;
  code: string;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
}

async function fetchAPI<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  
  // Ajouter les paramètres de requête si présents
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "Toutes") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  console.log("[API Request]", url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Inclure les cookies si nécessaire
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

export const api = {
  dashboard: {
    kpis: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<DashboardKPIs>("/dashboard/kpis", filters),
    fvrHumainTotal: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<number>("/dashboard/fvr-humain-total", filters),
    fvrHumainByRegion: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<RegionStat[]>("/dashboard/fvr-humain-by-region", filters),
    fvrAnimalTotal: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<number>("/dashboard/fvr-animal-total", filters),
    fvrAnimalByRegion: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<RegionStat[]>("/dashboard/fvr-animal-by-region", filters),
    malariaByIndicator: () => fetchAPI<IndicatorStat[]>("/dashboard/malaria-by-indicator"),
    tuberculoseByIndicator: () => fetchAPI<IndicatorStat[]>("/dashboard/tuberculose-by-indicator"),
    mapData: (filters?: { region?: string; maladie?: string }) => 
      fetchAPI<RegionMapData[]>("/dashboard/map-data", filters),
  },
  malaria: {
    list: (params?: { year_start?: number; year_end?: number }) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return fetchAPI<MalariaData[]>(`/malaria/list${query}`);
    },
  },
  tuberculose: {
    list: (params?: { year_start?: number; year_end?: number }) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return fetchAPI<TuberculoseData[]>(`/tuberculose/list${query}`);
    },
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
    list: (params?: { year_start?: number; year_end?: number }) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
      return fetchAPI<PollutionAirData[]>(`/pollution-air/list${query}`);
    },
  },
  regions: {
    list: () => fetchAPI<RegionData[]>("/regions/list"),
  },
};

export type { 
  DashboardKPIs, 
  RegionStat, 
  IndicatorStat,
  RegionMapData,
  MalariaData,
  TuberculoseData,
  FvrHumainData,
  FvrAnimalData,
  GrippeAviaireData,
  PollutionAirData,
  RegionData
};

// Helper functions for hooks
export const fetchMapData = () => api.dashboard.mapData();
