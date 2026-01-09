import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { useState } from "react";

interface DashboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  region: string;
  maladie: string;
  categorie: string;
  periode: "none" | "day" | "week" | "month" | "year" | "custom";
}

const REGIONS = [
  "Toutes",
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Diourbel",
  "Louga",
  "Fatick",
  "Kaolack",
  "Matam",
  "Tambacounda",
  "Kolda",
  "Ziguinchor",
  "Kaffrine",
  "Kédougou",
  "Sédhiou",
];

const MALADIES = [
  "Toutes",
  "Paludisme",
  "Tuberculose",
  "FVR Humain",
  "FVR Animal",
  "Grippe Aviaire",
];

export default function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    region: "Toutes",
    maladie: "Toutes",
    categorie: "Toutes",
    periode: "year",
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Première ligne de filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ color: '#9333ea' }}>
            Région
          </label>
          <Select value={filters.region} onValueChange={(v) => updateFilter("region", v)}>
            <SelectTrigger className="bg-purple-50 border-purple-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ color: '#ea580c' }}>
            Type de Maladie
          </label>
          <Select value={filters.maladie} onValueChange={(v) => updateFilter("maladie", v)}>
            <SelectTrigger className="bg-orange-50 border-orange-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MALADIES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ color: '#16a34a' }}>
            Catégorie
          </label>
          <Select value={filters.categorie} onValueChange={(v) => updateFilter("categorie", v)}>
            <SelectTrigger className="bg-green-50 border-green-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Toutes">Toutes</SelectItem>
              <SelectItem value="Humain">Humain</SelectItem>
              <SelectItem value="Animal">Animal</SelectItem>
              <SelectItem value="Environnement">Environnement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deuxième ligne : Période et Actions */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ color: '#ca8a04' }}>
            Période
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.periode === "none" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "none")}
              className={filters.periode === "none" ? "bg-gray-300 text-gray-700 hover:bg-gray-400" : ""}
            >
              Aucune période
            </Button>
            <Button
              variant={filters.periode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "day")}
              className={filters.periode === "day" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Jour
            </Button>
            <Button
              variant={filters.periode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "week")}
              className={filters.periode === "week" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Semaine
            </Button>
            <Button
              variant={filters.periode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "month")}
              className={filters.periode === "month" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Mois
            </Button>
            <Button
              variant={filters.periode === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "year")}
              className={filters.periode === "year" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Année
            </Button>
            <Button
              variant={filters.periode === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("periode", "custom")}
              className={filters.periode === "custom" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Période personnalisée
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ color: '#dc2626' }}>
            Actions
          </label>
          <div className="flex gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button size="sm" className="bg-gray-800 hover:bg-gray-900">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
