import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle, Cloud, Droplets, ThermometerSun } from 'lucide-react';

interface RegionPrediction {
  region: string;
  current_fvr_cases: number;
  predicted_7_days: number;
  predicted_14_days: number;
  predicted_30_days: number;
  pollution_pm25: number;
  climate_risk_score: number;
  seasonal_risk: string;
  combined_risk_score: number;
  risk_factors: string[];
  recommendations: string[];
}

interface PredictionSummary {
  total_current_cases: number;
  predicted_7_days_total: number;
  predicted_14_days_total: number;
  predicted_30_days_total: number;
  high_risk_regions: string[];
  critical_actions: string[];
}

interface ModelStatus {
  data_points: number;
  models: {
    linear: { available: boolean; status: string; min_required: number };
    arima: { available: boolean; status: string; min_required: number };
    prophet: { available: boolean; status: string; min_required: number };
    lstm: { available: boolean; status: string; min_required: number };
  };
  message: string;
}

export default function Predictions() {
  const [predictions, setPredictions] = useState<RegionPrediction[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const [predictionsRes, summaryRes, statusRes] = await Promise.all([
        fetch('/api/predictions/regions'),
        fetch('/api/predictions/summary'),
        fetch('/api/predictions/advanced/status')
      ]);

      const predictionsData = await predictionsRes.json();
      const summaryData = await summaryRes.json();
      const statusData = await statusRes.json();

      setPredictions(predictionsData);
      setSummary(summaryData);
      setModelStatus(statusData);
    } catch (error) {
      console.error('Erreur lors du chargement des prédictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'Critique';
    if (score >= 50) return 'Élevé';
    if (score >= 25) return 'Moyen';
    return 'Faible';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des prédictions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Prédictions One Health</h1>
        <p className="text-gray-600">
          Prédictions multi-facteurs basées sur FVR, pollution PM2.5, climat et saisons
        </p>
      </div>

      {/* Résumé global */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cas Actuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_current_cases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Prévision 7 jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary.predicted_7_days_total}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +{summary.predicted_7_days_total - summary.total_current_cases} cas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Prévision 14 jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {summary.predicted_14_days_total}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +{summary.predicted_14_days_total - summary.total_current_cases} cas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Prévision 30 jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {summary.predicted_30_days_total}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +{summary.predicted_30_days_total - summary.total_current_cases} cas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions critiques */}
      {summary && summary.critical_actions.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="font-semibold text-red-900 mb-2">Actions Critiques</div>
            <ul className="space-y-1">
              {summary.critical_actions.map((action, idx) => (
                <li key={idx} className="text-red-800">{action}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Statut des modèles de prédiction */}
      {modelStatus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Modèles de Prédiction Disponibles
            </CardTitle>
            <CardDescription className="text-blue-900">
              {modelStatus.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-600">Linear</div>
                <div className="text-lg font-bold mt-1">{modelStatus.models.linear.status}</div>
                <div className="text-xs text-gray-500 mt-1">Min: {modelStatus.models.linear.min_required} points</div>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-600">ARIMA</div>
                <div className="text-lg font-bold mt-1">{modelStatus.models.arima.status}</div>
                <div className="text-xs text-gray-500 mt-1">Min: {modelStatus.models.arima.min_required} points</div>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-600">Prophet</div>
                <div className="text-lg font-bold mt-1">{modelStatus.models.prophet.status}</div>
                <div className="text-xs text-gray-500 mt-1">Min: {modelStatus.models.prophet.min_required} points</div>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm font-medium text-gray-600">LSTM</div>
                <div className="text-lg font-bold mt-1">{modelStatus.models.lstm.status}</div>
                <div className="text-xs text-gray-500 mt-1">Min: {modelStatus.models.lstm.min_required} points</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="text-sm font-semibold text-gray-700 mb-2">Progression des Données</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all" 
                    style={{ width: `${Math.min((modelStatus.data_points / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {modelStatus.data_points} / 30 points
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {modelStatus.data_points < 30 
                  ? `Encore ${30 - modelStatus.data_points} communiqués nécessaires pour activer ARIMA et Prophet`
                  : "Modèles avancés activés ! 🎉"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prédictions par région */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Prédictions par Région</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {predictions.map((pred) => (
            <Card key={pred.region} className={`border-2 ${getRiskColor(pred.combined_risk_score)}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{pred.region}</span>
                  <span className={`text-sm px-2 py-1 rounded ${getRiskColor(pred.combined_risk_score)}`}>
                    {getRiskLabel(pred.combined_risk_score)}
                  </span>
                </CardTitle>
                <CardDescription>
                  Score de risque: {pred.combined_risk_score}/100
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cas actuels et prédictions */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">Évolution des cas</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Actuels:</span>
                      <span className="font-semibold">{pred.current_fvr_cases}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>7 jours:</span>
                      <span className="font-semibold">{pred.predicted_7_days}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>14 jours:</span>
                      <span className="font-semibold">{pred.predicted_14_days}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>30 jours:</span>
                      <span className="font-semibold">{pred.predicted_30_days}</span>
                    </div>
                  </div>
                </div>

                {/* Facteurs environnementaux */}
                <div>
                  <div className="font-semibold mb-2 text-sm">Facteurs Environnementaux</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      <span>PM2.5: {pred.pollution_pm25} µg/m³</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span>Risque saisonnier: {pred.seasonal_risk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4" />
                      <span>Climat: {pred.climate_risk_score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Facteurs de risque */}
                {pred.risk_factors.length > 0 && (
                  <div>
                    <div className="font-semibold mb-2 text-sm">Facteurs de Risque</div>
                    <ul className="space-y-1 text-xs">
                      {pred.risk_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommandations */}
                <div>
                  <div className="font-semibold mb-2 text-sm">Recommandations</div>
                  <ul className="space-y-1 text-xs">
                    {pred.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
