import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { Users, Bird, AlertTriangle } from "lucide-react";

interface RegionMapData {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  total_cases: number;
}

interface SenegalMapEnhancedProps {
  data: RegionMapData[];
  title?: string;
}

export default function SenegalMapEnhanced({ 
  data = [], 
  title = "Répartition Géographique - One Health" 
}: SenegalMapEnhancedProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'fvr_humain' | 'fvr_animal' | 'grippe_aviaire'>('all');

  const maxCases = useMemo(() => {
    if (data.length === 0) return 1;
    return Math.max(...data.map(d => d.total_cases));
  }, [data]);

  const getColor = (cases: number) => {
    if (cases === 0) return "#e5e7eb";
    const intensity = cases / maxCases;
    if (intensity > 0.7) return "#dc2626";
    if (intensity > 0.4) return "#f97316";
    if (intensity > 0.2) return "#fbbf24";
    return "#86efac";
  };

  const getCasesForLayer = (regionData: RegionMapData | undefined) => {
    if (!regionData) return 0;
    switch (activeLayer) {
      case 'fvr_humain': return regionData.fvr_humain;
      case 'fvr_animal': return regionData.fvr_animal;
      case 'grippe_aviaire': return regionData.grippe_aviaire;
      default: return regionData.total_cases;
    }
  };

  // Positions des régions du Sénégal (coordonnées approximatives)
  const regionPositions: Record<string, { x: number; y: number }> = {
    "Saint-Louis": { x: 180, y: 40 },
    "Louga": { x: 180, y: 100 },
    "Matam": { x: 300, y: 80 },
    "Dakar": { x: 120, y: 140 },
    "Thiès": { x: 160, y: 160 },
    "Diourbel": { x: 200, y: 180 },
    "Fatick": { x: 160, y: 220 },
    "Kaolack": { x: 220, y: 220 },
    "Kaffrine": { x: 260, y: 220 },
    "Tambacounda": { x: 360, y: 200 },
    "Kédougou": { x: 420, y: 280 },
    "Kolda": { x: 260, y: 300 },
    "Sédhiou": { x: 180, y: 300 },
    "Ziguinchor": { x: 120, y: 340 },
    "Podor": { x: 240, y: 50 },
    "Pikine": { x: 130, y: 150 },
    "Rufisque": { x: 140, y: 155 },
    "Mbacké": { x: 210, y: 170 },
    "Bambey": { x: 190, y: 170 },
    "Tivaouane": { x: 170, y: 150 },
    "Gossas": { x: 180, y: 210 },
    "Linguère": { x: 220, y: 120 },
    "Guédiawaye": { x: 125, y: 145 },
    "Malème Hodar": { x: 230, y: 210 },
  };

  const regions = Object.keys(regionPositions).map(regionName => {
    const regionData = data.find(d => d.region === regionName);
    const position = regionPositions[regionName];
    return {
      name: regionName,
      x: position.x,
      y: position.y,
      data: regionData,
      cases: getCasesForLayer(regionData)
    };
  });

  const selectedRegionData = selectedRegion 
    ? data.find(d => d.region === selectedRegion)
    : null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-1 w-8 bg-red-500 rounded"></div>
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">Répartition géographique des cas</p>
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
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              activeLayer === 'grippe_aviaire' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Grippe Aviaire
          </button>
        </div>

        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <svg
            viewBox="0 0 500 400"
            className="absolute inset-0 w-full h-full"
            style={{ background: "#f9fafb" }}
          >
            {/* Contour simplifié du Sénégal */}
            <path
              d="M 120 140 L 180 40 L 300 80 L 360 200 L 420 280 L 260 300 L 180 300 L 120 340 L 80 300 L 100 240 L 120 180 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
            />

            {/* Régions */}
            {regions.map((region) => {
              const color = getColor(region.cases);
              const isSelected = selectedRegion === region.name;
              const radius = region.cases > 0 
                ? Math.max(12, Math.min(35, (region.cases / maxCases) * 45)) 
                : 8;

              return (
                <g 
                  key={region.name}
                  onMouseEnter={() => setSelectedRegion(region.name)}
                  onMouseLeave={() => setSelectedRegion(null)}
                  style={{ cursor: region.cases > 0 ? 'pointer' : 'default' }}
                >
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={radius}
                    fill={color}
                    stroke={isSelected ? "#000" : "#fff"}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={region.cases > 0 ? 0.85 : 0.3}
                  />
                  {region.cases > 0 && (
                    <text
                      x={region.x}
                      y={region.y + 5}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      {region.cases}
                    </text>
                  )}
                  {isSelected && (
                    <text
                      x={region.x}
                      y={region.y - radius - 5}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#374151"
                      fontWeight="600"
                    >
                      {region.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info région sélectionnée */}
        {selectedRegionData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">{selectedRegion}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                <span>FVR Humain: <strong>{selectedRegionData.fvr_humain}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Bird className="w-4 h-4 text-cyan-500" />
                <span>FVR Animal: <strong>{selectedRegionData.fvr_animal}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span>Grippe Aviaire: <strong>{selectedRegionData.grippe_aviaire}</strong></span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="font-semibold">Total: <strong className="text-purple-600">{selectedRegionData.total_cases}</strong> cas</span>
              </div>
            </div>
          </div>
        )}

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
