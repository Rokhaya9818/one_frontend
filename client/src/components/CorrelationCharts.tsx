import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from "recharts";

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};

export function PluviometrieMalariaChart() {
  // Données simulées - corrélation pluviométrie et malaria
  const data = [
    { region: "Ziguinchor", pluie: 1200, malaria: 1174 },
    { region: "Kolda", pluie: 950, malaria: 850 },
    { region: "Kaolack", pluie: 650, malaria: 964 },
    { region: "Dakar", pluie: 550, malaria: 410 },
    { region: "Saint-Louis", pluie: 350, malaria: 593 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>🌧️ Corrélation Pluviométrie - Malaria</CardTitle>
        <p className="text-sm text-gray-600">
          Plus il pleut, plus il y a de cas de malaria (zones humides favorisent les moustiques)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pluie" name="Pluviométrie (mm/an)" />
            <YAxis dataKey="malaria" name="Cas Malaria (milliers)" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow">
                      <p className="font-bold">{payload[0].payload.region}</p>
                      <p className="text-sm">Pluie: {payload[0].payload.pluie} mm/an</p>
                      <p className="text-sm">Malaria: {payload[0].payload.malaria}k cas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={data} fill={COLORS.blue} />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Explication :</strong> Les zones avec beaucoup de pluie (comme Ziguinchor) 
            ont plus de cas de malaria car l'eau stagnante favorise la reproduction des moustiques.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PollutionTuberculoseChart() {
  // Données simulées - corrélation pollution et tuberculose
  const data = [
    { zone: "Dakar", pollution: 42.5, tuberculose: 85 },
    { zone: "Kaolack", pollution: 38.9, tuberculose: 72 },
    { zone: "Thiès", pollution: 35.2, tuberculose: 65 },
    { zone: "Saint-Louis", pollution: 28.7, tuberculose: 48 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>🏭 Corrélation Pollution Air - Tuberculose</CardTitle>
        <p className="text-sm text-gray-600">
          La pollution de l'air aggrave les maladies respiratoires comme la tuberculose
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="zone" />
            <YAxis yAxisId="left" label={{ value: 'PM2.5 (µg/m³)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Cas TB', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Bar yAxisId="left" dataKey="pollution" fill={COLORS.yellow} name="Pollution PM2.5" />
            <Bar yAxisId="right" dataKey="tuberculose" fill={COLORS.red} name="Tuberculose" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>💡 Explication :</strong> Les zones très polluées (comme Dakar) ont plus de cas 
            de tuberculose car la pollution affaiblit les poumons et facilite les infections respiratoires.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FVRTransmissionChart() {
  // Timeline montrant la transmission animal → humain
  const data = [
    { mois: "Jan", animal: 120, humain: 15 },
    { mois: "Fév", animal: 180, humain: 25 },
    { mois: "Mar", animal: 250, humain: 45 },
    { mois: "Avr", animal: 320, humain: 85 },
    { mois: "Mai", animal: 280, humain: 120 },
    { mois: "Jun", animal: 200, humain: 95 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>🔄 Transmission FVR : Animal → Humain</CardTitle>
        <p className="text-sm text-gray-600">
          Les pics chez les animaux précèdent les pics chez les humains
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="animal" stroke={COLORS.cyan} strokeWidth={2} name="FVR Animal" />
            <Line type="monotone" dataKey="humain" stroke={COLORS.red} strokeWidth={2} name="FVR Humain" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-900">
            <strong>💡 Explication :</strong> Quand il y a beaucoup de cas chez les animaux (ligne bleue), 
            quelques semaines après on voit une augmentation chez les humains (ligne rouge). 
            C'est pourquoi surveiller les animaux permet de prévenir les épidémies humaines !
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
