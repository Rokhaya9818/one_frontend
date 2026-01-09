import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Eye } from "lucide-react";

interface DistrictData {
  nom: string;
  cas: number;
}

interface RegionData {
  nom: string;
  total_cas: number;
  districts: DistrictData[];
}

interface FVRExtractedData {
  date_communique: string;
  date_reference: string;
  total_cas_confirmes: number;
  total_deces: number;
  total_gueris: number;
  regions: RegionData[];
  texte_brut: string;
  source_url: string;
}

interface ImportHistory {
  date: string;
  total_cases: number;
  regions_count: number;
  status: string;
}

interface ImportStatus {
  status: string;
  message: string;
  timestamp?: string;
}

export default function ImportFVR() {
  const [scraping, setScraping] = useState(false);
  const [extractedData, setExtractedData] = useState<FVRExtractedData | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportStatus | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer l'historique des imports
  const { data: history, isLoading } = useQuery<ImportHistory[]>({
    queryKey: ["fvr-import-history"],
    queryFn: async () => {
      const response = await fetch("/api/fvr-import/history");
      if (!response.ok) return [];
      return response.json();
    },
    refetchInterval: 10000,
  });

  // Mutation pour scraper Facebook
  const scrapeFacebook = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/fvr/auto-import/scrape");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erreur lors du scraping");
      }
      return response.json();
    },
    onSuccess: (data: FVRExtractedData) => {
      setExtractedData(data);
      setScraping(false);
      setImportResult({
        status: "info",
        message: "Données extraites avec succès. Veuillez vérifier et valider.",
      });
    },
    onError: (error: Error) => {
      setScraping(false);
      setImportResult({
        status: "error",
        message: error.message,
      });
    },
  });

  // Mutation pour valider et importer
  const validateImport = useMutation({
    mutationFn: async (action: "confirm" | "cancel") => {
      const response = await fetch("/api/fvr/auto-import/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: extractedData,
          action: action,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erreur lors de l'import");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setImporting(false);
      setImportResult({
        status: "success",
        message: data.message,
      });
      setExtractedData(null);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["fvr-import-history"] });
      }, 2000);
    },
    onError: (error: Error) => {
      setImporting(false);
      setImportResult({
        status: "error",
        message: error.message,
      });
    },
  });

  const handleScrape = () => {
    setScraping(true);
    setExtractedData(null);
    setImportResult(null);
    scrapeFacebook.mutate();
  };

  const handleConfirmImport = () => {
    setImporting(true);
    validateImport.mutate("confirm");
  };

  const handleCancelImport = () => {
    setExtractedData(null);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Import Automatique FVR</h2>
          <p className="text-muted-foreground">
            Récupération des données depuis la page Facebook du Ministère de la Santé
          </p>
        </div>
      </div>

      {/* Bouton de lancement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Étape 1 : Récupérer les Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Cliquez sur le bouton ci-dessous pour scraper la page Facebook du Ministère de la Santé
            et extraire automatiquement les dernières données FVR.
          </p>

          <Button
            onClick={handleScrape}
            disabled={scraping || !!extractedData}
            className="w-full sm:w-auto"
          >
            {scraping ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Récupération en cours...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Récupérer les Données
              </>
            )}
          </Button>

          {/* Résultat du scraping */}
          {importResult && !extractedData && (
            <div
              className={`p-4 rounded-lg border ${
                importResult.status === "success"
                  ? "bg-green-50 border-green-200"
                  : importResult.status === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {importResult.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : importResult.status === "error" ? (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      importResult.status === "success"
                        ? "text-green-900"
                        : importResult.status === "error"
                        ? "text-red-900"
                        : "text-blue-900"
                    }`}
                  >
                    {importResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aperçu des données extraites */}
      {extractedData && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Étape 2 : Vérifier et Valider les Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Statistiques nationales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 font-medium">Cas Confirmés</p>
                <p className="text-3xl font-bold text-red-900">
                  {extractedData.total_cas_confirmes}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Décès</p>
                <p className="text-3xl font-bold text-gray-900">{extractedData.total_deces}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Guéris</p>
                <p className="text-3xl font-bold text-green-900">{extractedData.total_gueris}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Régions</p>
                <p className="text-3xl font-bold text-blue-900">{extractedData.regions.length}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Date du Communiqué</p>
                <p className="text-lg font-semibold">
                  {new Date(extractedData.date_communique).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Date de Référence</p>
                <p className="text-lg font-semibold">
                  {new Date(extractedData.date_reference).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Tableau des régions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Données par Région</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Région</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Total Cas</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Districts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.regions.map((region, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{region.nom}</td>
                        <td className="py-3 px-4 font-bold text-red-600">{region.total_cas}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {region.districts.map((d, i) => (
                              <div key={i}>
                                {d.nom}: {d.cas} cas
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Texte brut */}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRawText(!showRawText)}
                className="mb-2"
              >
                {showRawText ? "Masquer" : "Afficher"} le texte brut
              </Button>
              {showRawText && (
                <div className="bg-gray-50 p-4 rounded-lg border text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {extractedData.texte_brut}
                </div>
              )}
            </div>

            {/* Boutons de validation */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleConfirmImport}
                disabled={importing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {importing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valider et Importer
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancelImport}
                disabled={importing}
                variant="outline"
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultat de l'import */}
      {importResult && extractedData && (
        <div
          className={`p-4 rounded-lg border ${
            importResult.status === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {importResult.status === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  importResult.status === "success" ? "text-green-900" : "text-red-900"
                }`}
              >
                {importResult.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Historique des imports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique des Imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : history && history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cas Confirmés</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Régions</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(item.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-red-600">
                        {item.total_cases.toLocaleString("fr-FR")}
                      </td>
                      <td className="py-3 px-4">{item.regions_count}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          {item.status === "completed" ? "Terminé" : item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun historique d'import disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Comment ça fonctionne ?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              • Le système se connecte automatiquement à la page Facebook du Ministère de la Santé
            </li>
            <li>• Le dernier communiqué FVR est récupéré et analysé automatiquement</li>
            <li>
              • Les données (cas par région et district) sont extraites avec reconnaissance de texte
            </li>
            <li>• Vous validez les données avant l'import dans la base de données</li>
            <li>• La base de données est mise à jour uniquement après votre validation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
