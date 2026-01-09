import { useState, useMemo } from "react";
import {
  useDashboardKpis,
  useFvrHumainTotal,
  useFvrAnimalTotal,
  useFvrHumainByRegion,
  useFvrAnimalByRegion,
  useMalariaByIndicator,
  useTuberculoseByIndicator,
  useMapData
} from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Bird, Wind, AlertTriangle, TrendingUp, TrendingDown, Droplets, Stethoscope } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { APP_LOGO, APP_TITLE } from "@/const";
import DashboardFilters, { FilterState } from "@/components/DashboardFilters";
import DashboardTabs from "@/components/DashboardTabs";
import SenegalMap from "@/components/SenegalMap";
import SenegalMapEnhanced from "@/components/SenegalMapEnhanced";
import SenegalRealMap from "@/components/SenegalRealMap";
import SenegalMapWithSVG from "@/components/SenegalMapWithSVG";
import Correlations from "./Correlations";
import ImportFVR from "./ImportFVR";
import Predictions from "./Predictions";

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  purple: "#a855f7",
  orange: "#f97316",
  cyan: "#06b6d4",
  yellow: "#eab308",
  pink: "#ec4899",
  red: "#ef4444",
};

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  variation?: number;
  unit?: string;
}

function KPICard({ title, value, icon, bgColor, iconBgColor, variation, unit }: KPICardProps) {
  const isPositive = variation && variation > 0;
  const isNegative = variation && variation < 0;

  return (
    <Card className={`${bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            {icon}
          </div>
          {variation !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
              {isPositive && <TrendingUp className="w-4 h-4" />}
              {isNegative && <TrendingDown className="w-4 h-4" />}
              {variation > 0 ? '+' : ''}{variation}%
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
            {unit && <span className="text-sm text-gray-600">{unit}</span>}
          </div>
        </div>
        <div className="mt-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded ${i < 3 ? iconBgColor.replace('bg-', 'bg-') : 'bg-gray-200'}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<FilterState>({
    region: "Toutes",
    maladie: "Toutes",
    categorie: "Toutes",
    periode: "year",
  });
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Charger les données avec filtres
  const { data: kpis } = useDashboardKpis({ region: filters.region, maladie: filters.maladie });
  const { data: fvrHumainTotal } = useFvrHumainTotal({ region: filters.region, maladie: filters.maladie });
  const { data: fvrAnimalTotal } = useFvrAnimalTotal({ region: filters.region, maladie: filters.maladie });
  const { data: fvrHumainByRegion } = useFvrHumainByRegion({ region: filters.region, maladie: filters.maladie });
  const { data: fvrAnimalByRegion } = useFvrAnimalByRegion({ region: filters.region, maladie: filters.maladie });
  const { data: malariaByIndicator } = useMalariaByIndicator();
  const { data: tuberculoseByIndicator } = useTuberculoseByIndicator();
  const mapData = useMapData({ region: filters.region, maladie: filters.maladie });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#a12c3e] to-[#7a1f2e] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-12 w-12 object-contain bg-white rounded-lg p-1" />}
              <div>
                <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
                <p className="text-sm text-white/90">L'intelligence des données au service de la décision sanitaire</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/70">Utilisateur</p>
                <p className="text-sm font-semibold">Rokhaya Seck</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                RS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {/* Filtres */}
        <DashboardFilters onFilterChange={setFilters} />

        {/* Info région sélectionnée - Zone fixe en haut */}
        {selectedRegion && mapData?.data && (() => {
          const regionData = mapData.data.find(d => d.region === selectedRegion);
          return regionData ? (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xl">{selectedRegion}</h4>
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-white/80 text-xs">FVR Humain</span>
                  <strong className="text-lg">{regionData.fvr_humain.toLocaleString()}</strong>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 text-xs">FVR Animal</span>
                  <strong className="text-lg">{regionData.fvr_animal.toLocaleString()}</strong>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 text-xs">Grippe Aviaire</span>
                  <strong className="text-lg">{regionData.grippe_aviaire.toLocaleString()}</strong>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 text-xs">Malaria</span>
                  <strong className="text-lg">{regionData.malaria.toLocaleString()}</strong>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 text-xs font-semibold">Total</span>
                  <strong className="text-xl">{regionData.total_cases.toLocaleString()}</strong>
                  <span className="text-white/80 text-xs">cas</span>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Onglets de navigation */}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Vue d'ensemble */}
        {activeTab === "overview" && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Indicateurs clés de performance</h2>
            </div>

            {/* KPI Cards - Vraies données One Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="FVR Humain"
                value={fvrHumainTotal || 0}
                icon={<Users className="w-6 h-6 text-white" />}
                bgColor="bg-red-50"
                iconBgColor="bg-red-500"
                unit="cas confirmés"
              />
              <KPICard
                title="FVR Animal"
                value={fvrAnimalTotal || 0}
                icon={<Bird className="w-6 h-6 text-white" />}
                bgColor="bg-cyan-50"
                iconBgColor="bg-cyan-500"
                unit="cas détectés"
              />
              <KPICard
                title="Grippe Aviaire"
                value={kpis?.grippe_aviaire_cases || 0}
                icon={<AlertTriangle className="w-6 h-6 text-white" />}
                bgColor="bg-orange-50"
                iconBgColor="bg-orange-500"
                unit="incidents"
              />
              <KPICard
                title="Taux Létalité FVR"
                value={kpis?.taux_letalite_fvr || 0}
                icon={<Activity className="w-6 h-6 text-white" />}
                bgColor="bg-purple-50"
                iconBgColor="bg-purple-500"
                unit="%"
              />
            </div>

            {/* Graphiques de répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Répartition Paludisme */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-red-500 rounded"></div>
                    Répartition des Indicateurs Paludisme
                  </CardTitle>
                  <p className="text-sm text-gray-600">Par type d'indicateur</p>
                </CardHeader>
                <CardContent>
                  {malariaByIndicator && malariaByIndicator.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={malariaByIndicator}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={10} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.red} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      Chargement des données...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Répartition Tuberculose */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-orange-500 rounded"></div>
                    Répartition des Indicateurs Tuberculose
                  </CardTitle>
                  <p className="text-sm text-gray-600">Par type d'indicateur</p>
                </CardHeader>
                <CardContent>
                  {tuberculoseByIndicator && tuberculoseByIndicator.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tuberculoseByIndicator}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={10} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.orange} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      Chargement des données...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Carte interactive - Toutes les données régionales */}
            <div className="mb-8">
              <SenegalMapWithSVG
                title="Carte du Sénégal - One Health"
                data={mapData?.data || []}
                onRegionSelect={setSelectedRegion}
              />
            </div>
          </>
        )}

        {/* Santé Humaine */}
        {activeTab === "human" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Santé Humaine</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="FVR Humain - Cas Confirmés"
                value={fvrHumainTotal || 0}
                icon={<AlertTriangle className="w-6 h-6 text-white" />}
                bgColor="bg-red-50"
                iconBgColor="bg-red-500"
                unit="cas"
              />
              <KPICard
                title="FVR - Décès"
                value={kpis?.fvr_humain_deces || 0}
                icon={<Activity className="w-6 h-6 text-white" />}
                bgColor="bg-gray-50"
                iconBgColor="bg-gray-500"
                unit="décès"
              />
              <KPICard
                title="FVR - Guéris"
                value={kpis?.fvr_humain_gueris || 0}
                icon={<Users className="w-6 h-6 text-white" />}
                bgColor="bg-green-50"
                iconBgColor="bg-green-500"
                unit="guéris"
              />
              <KPICard
                title="Taux Létalité"
                value={kpis?.taux_letalite_fvr || 0}
                icon={<TrendingDown className="w-6 h-6 text-white" />}
                bgColor="bg-purple-50"
                iconBgColor="bg-purple-500"
                unit="%"
              />
            </div>

            {/* Graphiques détaillés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Paludisme - Indicateurs Clés</CardTitle>
                  <p className="text-sm text-gray-600">Principaux indicateurs de santé</p>
                </CardHeader>
                <CardContent>
                  {malariaByIndicator && malariaByIndicator.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={malariaByIndicator}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={10} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.red} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p>Données en cours de chargement</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Tuberculose - Indicateurs Clés</CardTitle>
                  <p className="text-sm text-gray-600">Principaux indicateurs de santé</p>
                </CardHeader>
                <CardContent>
                  {tuberculoseByIndicator && tuberculoseByIndicator.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tuberculoseByIndicator}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} fontSize={10} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.orange} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p>Données en cours de chargement</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Carte interactive Santé Humaine */}
            <SenegalMapWithSVG
              title="Carte du Sénégal - Santé Humaine"
              data={mapData?.data || []}
              onRegionSelect={setSelectedRegion}
            />
          </div>
        )}

        {/* Santé Animale */}
        {activeTab === "animal" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Santé Animale</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="FVR Animaux - Total"
                value={fvrAnimalTotal || 0}
                icon={<Activity className="w-6 h-6 text-white" />}
                bgColor="bg-cyan-50"
                iconBgColor="bg-cyan-500"
                unit="cas détectés"
              />
              <KPICard
                title="Grippe Aviaire"
                value={kpis?.grippe_aviaire_cases || 0}
                icon={<Bird className="w-6 h-6 text-white" />}
                bgColor="bg-orange-50"
                iconBgColor="bg-orange-500"
                unit="incidents"
              />
              <KPICard
                title="Espèces Affectées"
                value="5"
                icon={<AlertTriangle className="w-6 h-6 text-white" />}
                bgColor="bg-purple-50"
                iconBgColor="bg-purple-500"
                unit="espèces"
              />
              <KPICard
                title="Régions Touchées"
                value={fvrAnimalByRegion?.length || 0}
                icon={<Activity className="w-6 h-6 text-white" />}
                bgColor="bg-green-50"
                iconBgColor="bg-green-500"
                unit="régions"
              />
            </div>

            {/* Alertes Zoonotiques */}
            <Card className="shadow-sm mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-red-500 rounded"></div>
                  Alertes Zoonotiques Actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">FVR Animal - Surveillance Renforcée</h4>
                      <p className="text-sm text-red-700">Saint-Louis: 84 cas détectés (ovins/caprins) - Vaccination recommandée</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <Bird className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900">Grippe Aviaire - Surveillance Active</h4>
                      <p className="text-sm text-orange-700">{kpis?.grippeAviaireCases || 0} incidents rapportés - Mesures de biosécurité activées</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte Santé Animale */}
            <SenegalMapWithSVG
              title="Carte du Sénégal - Santé Animale"
              data={mapData?.data || []}
              onRegionSelect={setSelectedRegion}
            />
          </div>
        )}

        {/* Corrélations One Health */}
        {activeTab === "correlations" && (
          <Correlations />
        )}

        {/* Import FVR */}
        {activeTab === "import-fvr" && (
          <ImportFVR />
        )}

        {/* Prédictions */}
        {activeTab === "predictions" && (
          <Predictions />
        )}

        {/* Environnement */}
        {activeTab === "environment" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Environnement</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KPICard
                title="Pollution PM2.5"
                value="42.5"
                icon={<Wind className="w-6 h-6 text-white" />}
                bgColor="bg-yellow-50"
                iconBgColor="bg-yellow-500"
                unit="µg/m³"
              />
              <KPICard
                title="Pluviométrie Moyenne"
                value="650"
                icon={<Droplets className="w-6 h-6 text-white" />}
                bgColor="bg-blue-50"
                iconBgColor="bg-blue-500"
                unit="mm/an"
              />
              <KPICard
                title="Qualité de l'Air"
                value="Modérée"
                icon={<Wind className="w-6 h-6 text-white" />}
                bgColor="bg-green-50"
                iconBgColor="bg-green-500"
                unit="IQA"
              />
              <KPICard
                title="Zones à Risque"
                value="3"
                icon={<AlertTriangle className="w-6 h-6 text-white" />}
                bgColor="bg-orange-50"
                iconBgColor="bg-orange-500"
                unit="régions"
              />
            </div>

            {/* Indicateurs Environnementaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Qualité de l'Air - PM2.5</CardTitle>
                  <p className="text-sm text-gray-600">Concentrations moyennes par zone</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { zone: "Dakar", pm25: 42.5 },
                      { zone: "Thiès", pm25: 35.2 },
                      { zone: "Saint-Louis", pm25: 28.7 },
                      { zone: "Kaolack", pm25: 38.9 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pm25" fill={COLORS.yellow} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Pluviométrie Moyenne Annuelle</CardTitle>
                  <p className="text-sm text-gray-600">Par région (mm/an)</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { region: "Ziguinchor", pluie: 1200 },
                      { region: "Kolda", pluie: 950 },
                      { region: "Dakar", pluie: 550 },
                      { region: "Saint-Louis", pluie: 350 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pluie" fill={COLORS.blue} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alertes Environnementales */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-red-500 rounded"></div>
                  Alertes Environnementales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <Wind className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Qualité de l'Air Dégradée - Dakar</h4>
                      <p className="text-sm text-yellow-700">PM2.5 supérieur au seuil OMS - Populations sensibles à risque</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Saison des Pluies - Surveillance Paludisme</h4>
                      <p className="text-sm text-blue-700">Pluviométrie élevée prévue - Renforcer la prévention antipaludique</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
