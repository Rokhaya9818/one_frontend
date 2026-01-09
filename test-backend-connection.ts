/**
 * Script de test pour vérifier la connexion avec le backend Render
 * Exécuter avec: npx tsx test-backend-connection.ts
 */

const BACKEND_URL = "https://one-backend-6.onrender.com";

interface TestResult {
  name: string;
  status: "✅" | "❌" | "⚠️";
  message: string;
  duration?: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({
      name,
      status: "✅",
      message: "Succès",
      duration,
    });
  } catch (error) {
    const duration = Date.now() - start;
    results.push({
      name,
      status: "❌",
      message: error instanceof Error ? error.message : String(error),
      duration,
    });
  }
}

async function runTests() {
  console.log("🧪 Démarrage des tests de connexion au backend Render\n");
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  // Test 1: Vérifier que le backend est accessible
  await test("Backend accessible", async () => {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
  });

  // Test 2: Récupérer les KPIs
  await test("Dashboard KPIs", async () => {
    const response = await fetch(`${BACKEND_URL}/dashboard/kpis`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.fvr_humain_cases) {
      throw new Error("Données manquantes");
    }
  });

  // Test 3: Récupérer le total FVR Humain
  await test("FVR Humain Total", async () => {
    const response = await fetch(
      `${BACKEND_URL}/dashboard/fvr-humain-total`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (typeof data !== "number") {
      throw new Error("Format invalide");
    }
  });

  // Test 4: Récupérer le total FVR Animal
  await test("FVR Animal Total", async () => {
    const response = await fetch(
      `${BACKEND_URL}/dashboard/fvr-animal-total`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (typeof data !== "number") {
      throw new Error("Format invalide");
    }
  });

  // Test 5: Récupérer les données de la carte
  await test("Map Data", async () => {
    const response = await fetch(`${BACKEND_URL}/dashboard/map-data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format invalide");
    }
  });

  // Test 6: Récupérer les indicateurs Malaria
  await test("Malaria Indicators", async () => {
    const response = await fetch(
      `${BACKEND_URL}/dashboard/malaria-by-indicator`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format invalide");
    }
  });

  // Test 7: Récupérer les indicateurs Tuberculose
  await test("Tuberculose Indicators", async () => {
    const response = await fetch(
      `${BACKEND_URL}/dashboard/tuberculose-by-indicator`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format invalide");
    }
  });

  // Test 8: Tester l'assistant IA
  await test("Assistant IA", async () => {
    const response = await fetch(`${BACKEND_URL}/assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Bonjour" }),
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.answer) {
      throw new Error("Pas de réponse");
    }
  });

  // Test 9: Récupérer la liste des régions
  await test("Regions List", async () => {
    const response = await fetch(`${BACKEND_URL}/regions/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format invalide");
    }
  });

  // Test 10: Récupérer la liste FVR Humain
  await test("FVR Humain List", async () => {
    const response = await fetch(`${BACKEND_URL}/fvr-humain/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Format invalide");
    }
  });

  // Afficher les résultats
  console.log("\n📊 Résultats des tests:\n");
  console.log("┌─────────────────────────────────────┬──────────┬──────────────┐");
  console.log("│ Test                                │ Statut   │ Durée (ms)   │");
  console.log("├─────────────────────────────────────┼──────────┼──────────────┤");

  results.forEach((result) => {
    const testName = result.name.padEnd(35);
    const status = result.status.padEnd(8);
    const duration = (result.duration || 0).toString().padEnd(12);
    console.log(`│ ${testName} │ ${status} │ ${duration} │`);
  });

  console.log("└─────────────────────────────────────┴──────────┴──────────────┘");

  // Résumé
  const passed = results.filter((r) => r.status === "✅").length;
  const failed = results.filter((r) => r.status === "❌").length;
  const warnings = results.filter((r) => r.status === "⚠️").length;

  console.log(`\n✅ Réussis: ${passed}/${results.length}`);
  if (failed > 0) console.log(`❌ Échoués: ${failed}`);
  if (warnings > 0) console.log(`⚠️ Avertissements: ${warnings}`);

  // Afficher les erreurs
  const errors = results.filter((r) => r.status !== "✅");
  if (errors.length > 0) {
    console.log("\n🔴 Erreurs détaillées:\n");
    errors.forEach((error) => {
      console.log(`${error.status} ${error.name}`);
      console.log(`   → ${error.message}\n`);
    });
  }

  console.log("\n✨ Tests terminés!");
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error("Erreur fatale:", error);
  process.exit(1);
});
