import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface RegionData {
  nom: string;
  cases: number;
  color: string;
}

interface SenegalMapProps {
  data?: RegionData[];
  title?: string;
}

export default function SenegalMap({ data = [], title = "Carte du Sénégal" }: SenegalMapProps) {
  const maxCases = useMemo(() => {
    if (data.length === 0) return 1;
    return Math.max(...data.map(d => d.cases));
  }, [data]);

  const getColor = (cases: number) => {
    if (cases === 0) return "#e5e7eb";
    const intensity = cases / maxCases;
    if (intensity > 0.7) return "#dc2626";
    if (intensity > 0.4) return "#f97316";
    if (intensity > 0.2) return "#fbbf24";
    return "#86efac";
  };

  // Simplified representation of Senegal regions
  const regions = [
    { name: "Saint-Louis", x: 180, y: 40, cases: data.find(d => d.nom === "Saint-Louis")?.cases || 0 },
    { name: "Louga", x: 180, y: 100, cases: data.find(d => d.nom === "Louga")?.cases || 0 },
    { name: "Matam", x: 300, y: 80, cases: data.find(d => d.nom === "Matam")?.cases || 0 },
    { name: "Dakar", x: 120, y: 140, cases: data.find(d => d.nom === "Dakar")?.cases || 0 },
    { name: "Thiès", x: 160, y: 160, cases: data.find(d => d.nom === "Thiès")?.cases || 0 },
    { name: "Diourbel", x: 200, y: 180, cases: data.find(d => d.nom === "Diourbel")?.cases || 0 },
    { name: "Fatick", x: 160, y: 220, cases: data.find(d => d.nom === "Fatick")?.cases || 0 },
    { name: "Kaolack", x: 220, y: 220, cases: data.find(d => d.nom === "Kaolack")?.cases || 0 },
    { name: "Kaffrine", x: 260, y: 220, cases: data.find(d => d.nom === "Kaffrine")?.cases || 0 },
    { name: "Tambacounda", x: 360, y: 200, cases: data.find(d => d.nom === "Tambacounda")?.cases || 0 },
    { name: "Kédougou", x: 420, y: 280, cases: data.find(d => d.nom === "Kédougou")?.cases || 0 },
    { name: "Kolda", x: 260, y: 300, cases: data.find(d => d.nom === "Kolda")?.cases || 0 },
    { name: "Sédhiou", x: 180, y: 300, cases: data.find(d => d.nom === "Sédhiou")?.cases || 0 },
    { name: "Ziguinchor", x: 120, y: 340, cases: data.find(d => d.nom === "Ziguinchor")?.cases || 0 },
  ];

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
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <svg
            viewBox="0 0 500 400"
            className="absolute inset-0 w-full h-full"
            style={{ background: "#f9fafb" }}
          >
            {/* Simplified Senegal outline */}
            <path
              d="M 120 140 L 180 40 L 300 80 L 360 200 L 420 280 L 260 300 L 180 300 L 120 340 L 80 300 L 100 240 L 120 180 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="2"
            />

            {/* Regions */}
            {regions.map((region) => {
              const color = getColor(region.cases);
              return (
                <g key={region.name}>
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={region.cases > 0 ? Math.max(15, Math.min(30, (region.cases / maxCases) * 40)) : 10}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <text
                    x={region.x}
                    y={region.y + 45}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#374151"
                    fontWeight="600"
                  >
                    {region.name}
                  </text>
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
                </g>
              );
            })}
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-300"></div>
            <span>Faible (0-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-300"></div>
            <span>Modéré (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>Élevé (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            <span>Très élevé (&gt;70%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
