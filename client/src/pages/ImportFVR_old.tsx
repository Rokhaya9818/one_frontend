import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

interface ImportHistory {
  date: string;
  total_cases: number;
  regions_count: number;
  status: string;
}

interface ImportStatus {
  status: string;
  message: string;
  timestamp: string;
}

export default function ImportFVR() {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportStatus | null>(null);
  const queryClient = useQueryClient();

  // Récupérer l'historique des imports
  const { data: history, isLoading } = useQuery<ImportHistory[]>({
    queryKey: ["fvr-import-history"],
    queryFn: async () => {
      const response = await fetch("/api/fvr-import/history");
      if (!response.ok) throw new Error("Erreur lors de la récupération de l'historique");
      return response.json();
    },
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });

  // Mutation pour lancer l'import
  const launchImport = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/fvr-import/launch", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Erreur lors du lancement de l'import");
      return response.json();
    },
    onSuccess: (data) => {
      setImportResult(data);
      setImporting(false);
      // Rafraîchir l'historique après 5 secondes
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["fvr-import-history"] });
      }, 5000);
    },
    onError: (error: Error) => {
      setImportResult({
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      setImporting(false);
    },
  });

  const handleLaunchImport = () => {
    setImporting(true);
    setImportResult(null);
    launchImport.mutate();
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
            Lancer l'Import Maintenant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Cliquez sur le bouton ci-dessous pour lancer manuellement l'import des dernières données FVR
            depuis la page Facebook du Ministère. L'import se fait automatiquement chaque jour à 18h00.
          </p>

          <Button
            onClick={handleLaunchImport}
            disabled={importing}
            className="w-full sm:w-auto"
          >
            {importing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Lancer l'Import
              </>
            )}
          </Button>

          {/* Résultat de l'import */}
          {importResult && (
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
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(importResult.timestamp).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
            <li>• Les communiqués de presse sont récupérés et analysés avec OCR</li>
            <li>• Les données FVR (cas par région) sont extraites automatiquement</li>
            <li>• La base de données est mise à jour de manière incrémentale (pas de doublon)</li>
            <li>
              • L'import automatique s'exécute <strong>tous les jours à 18h00</strong>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
