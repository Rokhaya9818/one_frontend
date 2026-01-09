import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import SenegalMapWithSVG from "@/components/SenegalMapWithSVG";
import { PluviometrieMalariaChart, PollutionTuberculoseChart, FVRTransmissionChart } from "@/components/CorrelationCharts";

interface RegionCorrelation {
  region: string;
  fvr_humain: number;
  fvr_animal: number;
  grippe_aviaire: number;
  malaria: number;
  risk_level: string;
}

interface CorrelationAlert {
  type: string;
  title: string;
  message: string;
  region: string;
}

interface CorrelationSummary {
  total_regions: number;
  high_risk_regions: number;
  correlation_fvr: number;
}

export default function Correlations() {
  const { data: correlations } = useQuery<RegionCorrelation[]>({
    queryKey: ["correlations", "by-region"],
    queryFn: () => fetch("/api/correlations/by-region").then(res => res.json()),
  });

  const { data: alerts } = useQuery<CorrelationAlert[]>({
    queryKey: ["correlations", "alerts"],
    queryFn: () => fetch("/api/correlations/alerts").then(res => res.json()),
  });

  const { data: summary } = useQuery<CorrelationSummary>({
    queryKey: ["correlations", "summary"],
    queryFn: () => fetch("/api/correlations/summary").then(res => res.json()),
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critique": return "bg-red-100 border-red-500 text-red-900";
      case "élevé": return "bg-orange-100 border-orange-500 text-orange-900";
      case "modéré": return "bg-yellow-100 border-yellow-500 text-yellow-900";
      default: return "bg-green-100 border-green-500 text-green-900";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger": return "bg-red-50 border-red-400";
      case "warning": return "bg-yellow-50 border-yellow-400";
      default: return "bg-blue-50 border-blue-400";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger": return "⚠️";
      case "warning": return "⚡";
      default: return "ℹ️";
    }
  };

  // Convertir les données pour la carte
  const mapData = correlations?.map(c => ({
    region: c.region,
    fvr_humain: c.fvr_humain,
    fvr_animal: c.fvr_animal,
    grippe_aviaire: c.grippe_aviaire,
    malaria: c.malaria,
    total_cases: c.fvr_humain + c.fvr_animal + c.grippe_aviaire + Math.floor(c.malaria / 1000)
  })) || [];

  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);
  const selectedData = selectedRegion ? correlations?.find(c => c.region === selectedRegion) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Corrélations One Health</h2>
        <p className="mt-2 text-gray-600">
          Analyse des interactions entre Santé Humaine, Santé Animale et Environnement
        </p>
      </div>

      {/* Résumé des corrélations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Régions Surveillées</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{summary?.total_regions || 0}</p>
            </div>
            <div className="text-4xl">🗺️</div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Zones à Risque Élevé</p>
              <p className="mt-2 text-3xl font-bold text-red-900">{summary?.high_risk_regions || 0}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Corrélation FVR</p>
              <p className="mt-2 text-3xl font-bold text-purple-900">
                {summary ? Math.round(summary.correlation_fvr * 100) : 0}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Alertes One Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🔔 Alertes One Health</h3>
        <div className="space-y-3">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{alert.title}</h4>
                    <p className="mt-1 text-gray-700">{alert.message}</p>
                    <p className="mt-2 text-sm text-gray-500">📍 Région : {alert.region}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune alerte pour le moment</p>
          )}
        </div>
      </div>

      {/* Graphiques de corrélations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PluviometrieMalariaChart />
        <PollutionTuberculoseChart />
      </div>

      <FVRTransmissionChart />

      {/* Carte des corrélations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🗺️ Carte des Zones à Risque Multiple</h3>
        <p className="text-gray-600 mb-4">
          Cette carte montre les régions où plusieurs maladies sont présentes simultanément
        </p>
        <SenegalMapWithSVG
          data={mapData}
          onRegionSelect={(region) => setSelectedRegion(region)}
        />
        
        {selectedData && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">📍 {selectedData.region}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-gray-600">FVR Humain</p>
                <p className="font-bold text-gray-900">{selectedData.fvr_humain.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">FVR Animal</p>
                <p className="font-bold text-gray-900">{selectedData.fvr_animal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Grippe Aviaire</p>
                <p className="font-bold text-gray-900">{selectedData.grippe_aviaire.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Malaria</p>
                <p className="font-bold text-gray-900">{selectedData.malaria.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Niveau de Risque</p>
                <p className={`font-bold px-2 py-1 rounded ${getRiskColor(selectedData.risk_level)}`}>
                  {selectedData.risk_level.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des corrélations par région */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Détails par Région</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FVR Humain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FVR Animal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grippe Aviaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Malaria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau de Risque</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {correlations?.map((corr, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{corr.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{corr.fvr_humain.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{corr.fvr_animal.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{corr.grippe_aviaire.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{corr.malaria.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getRiskColor(corr.risk_level)}`}>
                      {corr.risk_level.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explication One Health */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Qu'est-ce que One Health ?</h3>
        <p className="text-gray-700 leading-relaxed">
          <strong>One Health</strong> reconnaît que la santé des humains, des animaux et de l'environnement 
          sont étroitement liées. Par exemple, une épidémie chez les animaux (comme la FVR) peut se transmettre 
          aux humains. Cette approche intégrée permet de mieux prévenir et contrôler les maladies.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-700">Santé Humaine</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🐄</div>
            <p className="text-sm font-medium text-gray-700">Santé Animale</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🌍</div>
            <p className="text-sm font-medium text-gray-700">Environnement</p>
          </div>
        </div>
      </div>
    </div>
  );
}
