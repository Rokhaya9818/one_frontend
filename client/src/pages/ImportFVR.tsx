import { useState } from 'react';
import { Upload, Link, Check, X, FileText, Loader2, AlertCircle } from 'lucide-react';

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
  source: string;
}

export default function ImportFVR() {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<FVRExtractedData | null>(null);
  const [facebookLink, setFacebookLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Veuillez déposer une image (JPG, PNG, etc.)');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/fvr/import/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'extraction');
      }

      const data: FVRExtractedData = await response.json();
      setExtractedData(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLink = async () => {
    if (!facebookLink.trim()) {
      setError('Veuillez entrer un lien');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fvr/import/facebook-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: facebookLink }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'extraction');
      }

      const data: FVRExtractedData = await response.json();
      setExtractedData(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!extractedData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fvr/import/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: extractedData,
          action: 'confirm',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'import');
      }

      const result = await response.json();
      alert(`✅ ${result.message}\n\nLe dashboard va se recharger pour afficher les nouvelles données.`);
      
      // Réinitialiser
      setExtractedData(null);
      setSelectedFile(null);
      setFacebookLink('');
      
      // Recharger la page pour mettre à jour le dashboard
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setExtractedData(null);
    setSelectedFile(null);
    setFacebookLink('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Import Automatique FVR</h2>
        <p className="text-gray-600 mb-6">
          Importez les données FVR en uploadant une image du communiqué ou en collant le lien direct de l'image Facebook
        </p>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 px-4 ${
              activeTab === 'upload'
                ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            <Upload className="inline mr-2 h-4 w-4" />
            Upload d'image
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2 px-4 ${
              activeTab === 'link'
                ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            <Link className="inline mr-2 h-4 w-4" />
            Lien Facebook
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Glissez-déposez une image ici ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-500">
                  Formats acceptés : JPG, PNG, PDF
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Extraction en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Extraire les données
                </>
              )}
            </button>
          </div>
        )}

        {/* Link Tab */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien direct de l'image Facebook
              </label>
              <input
                type="url"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="https://scontent.xx.fbcdn.net/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Sur Facebook : Clic droit sur l'image → "Copier l'adresse de l'image"
              </p>
            </div>

            <button
              onClick={handleFacebookLink}
              disabled={!facebookLink.trim() || isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Extraction en cours...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-5 w-5" />
                  Extraire les données
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Erreur</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">📊 Données extraites - Validation</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cas confirmés</p>
              <p className="text-2xl font-bold text-red-600">
                {extractedData.total_cas_confirmes}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Décès</p>
              <p className="text-2xl font-bold text-gray-800">
                {extractedData.total_deces}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Guéris</p>
              <p className="text-2xl font-bold text-green-600">
                {extractedData.total_gueris}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Régions ({extractedData.regions.length})</h4>
            <div className="space-y-3">
              {extractedData.regions.map((region, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{region.nom}</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {region.total_cas} cas
                    </span>
                  </div>
                  {region.districts.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      {region.districts.map((district, didx) => (
                        <div key={didx} className="text-sm text-gray-600 flex justify-between">
                          <span>• {district.nom}</span>
                          <span>{district.cas} cas</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Texte extrait (OCR)</h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {extractedData.texte_brut}
              </pre>
            </div>
          </div>
          {/* Error Message for Validation */}
          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 font-bold text-lg">⚠️ Erreur d'import</p>
                <p className="text-red-800 text-base mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleValidate}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Valider et Importer
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 flex items-center justify-center"
            >
              <X className="mr-2 h-5 w-5" />
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
