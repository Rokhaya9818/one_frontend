import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

// Dashboard hooks
export const useDashboardKpis = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => api.dashboard.kpis(filters),
  });
};

export const useFvrHumainTotal = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "fvrHumainTotal", filters],
    queryFn: () => api.dashboard.fvrHumainTotal(filters),
  });
};

export const useFvrHumainByRegion = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "fvrHumainByRegion", filters],
    queryFn: () => api.dashboard.fvrHumainByRegion(filters),
  });
};

export const useFvrAnimalTotal = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "fvrAnimalTotal", filters],
    queryFn: () => api.dashboard.fvrAnimalTotal(filters),
  });
};

export const useFvrAnimalByRegion = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "fvrAnimalByRegion", filters],
    queryFn: () => api.dashboard.fvrAnimalByRegion(filters),
  });
};

export const useMalariaByIndicator = () => {
  return useQuery({
    queryKey: ["dashboard", "malariaByIndicator"],
    queryFn: () => api.dashboard.malariaByIndicator(),
  });
};

export const useTuberculoseByIndicator = () => {
  return useQuery({
    queryKey: ["dashboard", "tuberculoseByIndicator"],
    queryFn: () => api.dashboard.tuberculoseByIndicator(),
  });
};

export const useMapData = (filters?: { region?: string; maladie?: string }) => {
  return useQuery({
    queryKey: ["dashboard", "mapData", filters],
    queryFn: () => api.dashboard.mapData(filters),
  });
};

// Data hooks
export const useMalariaList = (params?: { year_start?: number; year_end?: number }) => {
  return useQuery({
    queryKey: ["malaria", "list", params],
    queryFn: () => api.malaria.list(params),
  });
};

export const useTuberculoseList = (params?: { year_start?: number; year_end?: number }) => {
  return useQuery({
    queryKey: ["tuberculose", "list", params],
    queryFn: () => api.tuberculose.list(params),
  });
};

export const useFvrHumainList = () => {
  return useQuery({
    queryKey: ["fvrHumain", "list"],
    queryFn: () => api.fvrHumain.list(),
  });
};

export const useFvrAnimalList = () => {
  return useQuery({
    queryKey: ["fvrAnimal", "list"],
    queryFn: () => api.fvrAnimal.list(),
  });
};

export const useGrippeAviaireList = () => {
  return useQuery({
    queryKey: ["grippeAviaire", "list"],
    queryFn: () => api.grippeAviaire.list(),
  });
};

export const usePollutionAirList = (params?: { year_start?: number; year_end?: number }) => {
  return useQuery({
    queryKey: ["pollutionAir", "list", params],
    queryFn: () => api.pollutionAir.list(params),
  });
};

export const useRegionsList = () => {
  return useQuery({
    queryKey: ["regions", "list"],
    queryFn: () => api.regions.list(),
  });
};
