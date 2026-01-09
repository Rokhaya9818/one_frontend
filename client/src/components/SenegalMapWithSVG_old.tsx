import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Users, Bird, AlertTriangle, Bug } from "lucide-react";

interface RegionMapData {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  malaria: number;
  total_cases: number;
}

interface SenegalMapWithSVGProps {
  data: RegionMapData[];
  title?: string;
  onRegionSelect?: (region: string | null) => void;
}

// Coordonnées des centres de régions pour placer les marqueurs (approximatives basées sur le SVG)
const REGION_POSITIONS: Record<string, { x: number; y: number }> = {
  "Dakar": { x: 150, y: 420 },
  "Thiès": { x: 200, y: 400 },
  "Saint-Louis": { x: 280, y: 200 },
  "Louga": { x: 250, y: 280 },
  "Matam": { x: 650, y: 250 },
  "Tambacounda": { x: 700, y: 450 },
  "Kédougou": { x: 850, y: 520 },
  "Kolda": { x: 550, y: 560 },
  "Ziguinchor": { x: 250, y: 650 },
  "Sédhiou": { x: 350, y: 580 },
  "Fatick": { x: 300, y: 480 },
  "Kaolack": { x: 380, y: 450 },
  "Kaffrine": { x: 480, y: 420 },
  "Diourbel": { x: 320, y: 380 },
};

export default function SenegalMapWithSVG({ 
  data = [], 
  title = "Carte du Sénégal - One Health",
  onRegionSelect
}: SenegalMapWithSVGProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const handleRegionClick = (region: string | null) => {
    setSelectedRegion(region);
    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };
  const [activeLayer, setActiveLayer] = useState<'all' | 'fvr_humain' | 'fvr_animal' | 'grippe_aviaire' | 'malaria'>('all');

  // Vérifier que data est un tableau
  const safeData = Array.isArray(data) ? data : [];

  const getCasesForLayer = (regionData: RegionMapData | undefined) => {
    if (!regionData) return 0;
    switch (activeLayer) {
      case 'fvr_humain': return regionData.fvr_humain;
      case 'fvr_animal': return regionData.fvr_animal;
      case 'grippe_aviaire': return regionData.grippe_aviaire;
      case 'malaria': return regionData.malaria;
      default: return regionData.total_cases;
    }
  };

  const maxCases = Math.max(...safeData.map(d => d.total_cases), 1);

  const getColor = (cases: number) => {
    if (cases === 0) return "#e5e7eb";
    const intensity = cases / maxCases;
    if (intensity > 0.7) return "#dc2626";
    if (intensity > 0.4) return "#f97316";
    if (intensity > 0.2) return "#fbbf24";
    return "#86efac";
  };

  const regions = Object.entries(REGION_POSITIONS).map(([name, pos]) => {
    const regionData = safeData.find(d => d.region === name);
    const cases = getCasesForLayer(regionData);
    
    return {
      name,
      x: pos.x,
      y: pos.y,
      data: regionData,
      cases,
      color: getColor(cases)
    };
  });

  const selectedRegionData = selectedRegion 
    ? safeData.find(d => d.region === selectedRegion)
    : null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-1 w-8 bg-red-500 rounded"></div>
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">Carte géographique avec coordonnées réelles</p>
      </CardHeader>
      <CardContent>
        {/* Filtres de couches */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeLayer === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous les cas
          </button>
          <button
            onClick={() => setActiveLayer('fvr_humain')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              activeLayer === 'fvr_humain' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-3 h-3" />
            FVR Humain
          </button>
          <button
            onClick={() => setActiveLayer('fvr_animal')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              activeLayer === 'fvr_animal' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bird className="w-3 h-3" />
            FVR Animal
          </button>
          <button
            onClick={() => setActiveLayer('grippe_aviaire')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === 'grippe_aviaire'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Grippe Aviaire
          </button>
          <button
            onClick={() => setActiveLayer('malaria')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeLayer === 'malaria'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bug className="w-3 h-3" />
            Malaria
          </button>
        </div>


        <div className="relative w-full bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
          <svg
            viewBox="0 0 1000 736"
            className="w-full h-auto"
            style={{ maxHeight: "600px" }}
          >
            {/* Fond océan */}
            <rect width="1000" height="736" fill="#e0f2fe" />
            
            {/* Carte du Sénégal (SVG simplifié) */}
            <image 
              href="/senegal.svg" 
              width="1000" 
              height="736"
              opacity="0.8"
            />

            {/* Marqueurs de régions */}
            {regions.map((region) => {
              const isSelected = selectedRegion === region.name;
              const radius = region.cases > 0 
                ? Math.max(10, Math.min(40, (region.cases / maxCases) * 50)) 
                : 6;

              return (
                <g 
                  key={region.name}
                  onClick={() => handleRegionClick(region.name)}
                  style={{ cursor: region.cases > 0 ? 'pointer' : 'default' }}
                >
                  {/* Cercle de la région */}
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={radius}
                    fill={region.color}
                    stroke={isSelected ? "#000" : "#fff"}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={region.cases > 0 ? 0.9 : 0.5}
                  />
                  
                  {/* Nombre de cas */}
                  {region.cases > 0 && (
                    <text
                      x={region.x}
                      y={region.y + 5}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      {region.cases}
                    </text>
                  )}
                  
                  {/* Nom de la région */}
                  <text
                    x={region.x}
                    y={region.y + radius + 16}
                    textAnchor="middle"
                    fontSize={isSelected ? "13" : "11"}
                    fill={isSelected ? "#000" : "#374151"}
                    fontWeight={isSelected ? "700" : "600"}
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-300"></div>
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-300"></div>
            <span>Modéré</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span>Élevé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-600"></div>
            <span>Très élevé</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
