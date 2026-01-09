import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Users, Bird, AlertTriangle } from "lucide-react";

interface RegionMapData {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  malaria: number;
  total_cases: number;
}

interface SenegalRealMapProps {
  data: RegionMapData[];
  title?: string;
}

// Coordonnées géographiques réelles des régions du Sénégal
const SENEGAL_REGIONS_COORDS: Record<string, { lat: number; lon: number }> = {
  "Dakar": { lat: 14.7167, lon: -17.4677 },
  "Thiès": { lat: 14.7886, lon: -16.9260 },
  "Saint-Louis": { lat: 16.0179, lon: -16.4897 },
  "Louga": { lat: 15.6167, lon: -16.2167 },
  "Matam": { lat: 15.6558, lon: -13.2558 },
  "Tambacounda": { lat: 13.7671, lon: -13.6677 },
  "Kédougou": { lat: 12.5569, lon: -12.1744 },
  "Kolda": { lat: 12.8833, lon: -14.9500 },
  "Ziguinchor": { lat: 12.5833, lon: -16.2667 },
  "Sédhiou": { lat: 12.7081, lon: -15.5569 },
  "Fatick": { lat: 14.3333, lon: -16.4167 },
  "Kaolack": { lat: 14.1500, lon: -16.0833 },
  "Kaffrine": { lat: 14.1067, lon: -15.5481 },
  "Diourbel": { lat: 14.6500, lon: -16.2333 },
  "Pikine": { lat: 14.7500, lon: -17.3900 },
  "Rufisque": { lat: 14.7167, lon: -17.2667 },
  "Podor": { lat: 16.6500, lon: -14.9667 },
  "Mbacké": { lat: 14.7833, lon: -15.9167 },
  "Bambey": { lat: 14.7000, lon: -16.4500 },
  "Tivaouane": { lat: 14.9500, lon: -16.8167 },
  "Gossas": { lat: 14.4833, lon: -16.0667 },
  "Linguère": { lat: 15.3833, lon: -15.1167 },
  "Guédiawaye": { lat: 14.7667, lon: -17.4000 },
  "Malème Hodar": { lat: 14.3000, lon: -15.6167 },
};

export default function SenegalRealMap({ 
  data = [], 
  title = "Carte du Sénégal - One Health" 
}: SenegalRealMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'fvr_humain' | 'fvr_animal' | 'grippe_aviaire' | 'malaria'>('fvr_humain');

  // Limites géographiques du Sénégal
  const bounds = {
    minLat: 12.3,
    maxLat: 16.7,
    minLon: -17.5,
    maxLon: -11.4
  };

  // Convertir lat/lon en coordonnées SVG
  const latLonToSVG = (lat: number, lon: number) => {
    const width = 800;
    const height = 600;
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * width;
    const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;
    return { x, y };
  };

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

  // Calculer le max en fonction du layer actif
  const maxCases = Math.max(
    ...data.map(d => getCasesForLayer(d)),
    1
  );

  const getColor = (cases: number) => {
    if (cases === 0) return "#e5e7eb";
    const intensity = cases / maxCases;
    if (intensity > 0.7) return "#dc2626";
    if (intensity > 0.4) return "#f97316";
    if (intensity > 0.2) return "#fbbf24";
    return "#86efac";
  };

  const regions = Object.entries(SENEGAL_REGIONS_COORDS).map(([name, coords]) => {
    const regionData = data.find(d => d.region === name);
    const svgCoords = latLonToSVG(coords.lat, coords.lon);
    const cases = getCasesForLayer(regionData);
    
    return {
      name,
      ...svgCoords,
      data: regionData,
      cases,
      color: getColor(cases)
    };
  });

  const selectedRegionData = selectedRegion 
    ? data.find(d => d.region === selectedRegion)
    : null;

  // Contour approximatif du Sénégal basé sur les vraies coordonnées
  const senegalBorder = `
    M ${latLonToSVG(16.5, -16.5).x} ${latLonToSVG(16.5, -16.5).y}
    L ${latLonToSVG(16.7, -15.0).x} ${latLonToSVG(16.7, -15.0).y}
    L ${latLonToSVG(15.5, -12.0).x} ${latLonToSVG(15.5, -12.0).y}
    L ${latLonToSVG(13.5, -11.5).x} ${latLonToSVG(13.5, -11.5).y}
    L ${latLonToSVG(12.3, -12.0).x} ${latLonToSVG(12.3, -12.0).y}
    L ${latLonToSVG(12.3, -15.0).x} ${latLonToSVG(12.3, -15.0).y}
    L ${latLonToSVG(12.5, -16.7).x} ${latLonToSVG(12.5, -16.7).y}
    L ${latLonToSVG(13.0, -17.5).x} ${latLonToSVG(13.0, -17.5).y}
    L ${latLonToSVG(14.0, -17.3).x} ${latLonToSVG(14.0, -17.3).y}
    L ${latLonToSVG(15.5, -17.0).x} ${latLonToSVG(15.5, -17.0).y}
    Z
  `;

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
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
              activeLayer === 'grippe_aviaire' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Grippe Aviaire
          </button>
          <button
            onClick={() => setActiveLayer('malaria')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeLayer === 'malaria' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Malaria
          </button>
        </div>

        <div className="relative w-full bg-blue-50 rounded-lg border border-blue-200" style={{ paddingBottom: "75%" }}>
          <svg
            viewBox="0 0 800 600"
            className="absolute inset-0 w-full h-full"
          >
            {/* Fond océan */}
            <rect width="800" height="600" fill="#e0f2fe" />
            
            {/* Contour du Sénégal */}
            <path
              d={senegalBorder}
              fill="#f5f5f4"
              stroke="#78716c"
              strokeWidth="2"
            />

            {/* Grille de coordonnées */}
            <g opacity="0.3">
              {[13, 14, 15, 16].map(lat => {
                const y = latLonToSVG(lat, -15).y;
                return (
                  <g key={`lat-${lat}`}>
                    <line x1="0" y1={y} x2="800" y2={y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                    <text x="10" y={y - 5} fontSize="10" fill="#64748b">{lat}°N</text>
                  </g>
                );
              })}
              {[-17, -16, -15, -14, -13, -12].map(lon => {
                const x = latLonToSVG(14, lon).x;
                return (
                  <g key={`lon-${lon}`}>
                    <line x1={x} y1="0" x2={x} y2="600" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                    <text x={x + 5} y="20" fontSize="10" fill="#64748b">{lon}°W</text>
                  </g>
                );
              })}
            </g>

            {/* Régions */}
            {regions.map((region) => {
              const isSelected = selectedRegion === region.name;
              const radius = region.cases > 0 
                ? Math.max(8, Math.min(30, (region.cases / maxCases) * 40)) 
                : 5;

              return (
                <g 
                  key={region.name}
                  onMouseEnter={() => setSelectedRegion(region.name)}
                  onMouseLeave={() => setSelectedRegion(null)}
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
                    opacity={region.cases > 0 ? 0.85 : 0.4}
                  />
                  
                  {/* Nombre de cas */}
                  {region.cases > 0 && (
                    <text
                      x={region.x}
                      y={region.y + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#fff"
                      fontWeight="bold"
                    >
                      {region.cases}
                    </text>
                  )}
                  
                  {/* Nom de la région (toujours visible) */}
                  <text
                    x={region.x}
                    y={region.y + radius + 14}
                    textAnchor="middle"
                    fontSize={isSelected ? "12" : "10"}
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
              <div className="flex items-center gap-2">
                <span>Malaria: <strong className="text-green-600">{selectedRegionData.malaria}</strong></span>
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
