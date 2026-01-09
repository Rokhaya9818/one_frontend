import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(process.env.DATABASE_URL!);

interface CSVRow {
  [key: string]: string;
}

function parseCSV(filePath: string): CSVRow[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length === headers.length) {
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });
      rows.push(row);
    }
  }

  return rows;
}

async function importMalaria() {
  console.log("Importing malaria data...");
  const dataPath = path.join(__dirname, "../data/malaria_indicateurs.csv");
  const rows = parseCSV(dataPath);

  const malariaData = rows
    .filter((row) => row["#indicator+code"] && row["#date+year"])
    .map((row) => ({
      indicatorCode: row["#indicator+code"] || "",
      indicatorName: row["#indicator+name"] || "",
      year: parseInt(row["#date+year"]) || 0,
      value: row["#indicator+value"] || "",
      numericValue: row["#indicator+value+num"] || "",
      lowValue: row["#indicator+value+low"] || "",
      highValue: row["#indicator+value+high"] || "",
    }))
    .filter((item) => item.year > 0);

  if (malariaData.length > 0) {
    try {
      await db.insert(schema.malaria).values(malariaData);
      console.log(`✓ Imported ${malariaData.length} malaria records`);
    } catch (error: any) {
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        console.log(`⚠ Malaria data already exists, skipping`);
      } else {
        throw error;
      }
    }
  }
}

async function importTuberculose() {
  console.log("Importing tuberculose data...");
  const dataPath = path.join(__dirname, "../data/tuberculose_indicateurs.csv");
  const rows = parseCSV(dataPath);

  const tbData = rows
    .filter((row) => row["#indicator+code"] && row["#date+year"])
    .map((row) => ({
      indicatorCode: row["#indicator+code"] || "",
      indicatorName: row["#indicator+name"] || "",
      year: parseInt(row["#date+year"]) || 0,
      value: row["#indicator+value"] || "",
      numericValue: row["#indicator+value+num"] || "",
      lowValue: row["#indicator+value+low"] || "",
      highValue: row["#indicator+value+high"] || "",
    }))
    .filter((item) => item.year > 0);

  if (tbData.length > 0) {
    try {
      await db.insert(schema.tuberculose).values(tbData);
      console.log(`✓ Imported ${tbData.length} tuberculose records`);
    } catch (error: any) {
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        console.log(`⚠ Tuberculose data already exists, skipping`);
      } else {
        throw error;
      }
    }
  }
}

async function importRegions() {
  console.log("Importing regions data...");
  const regionsData = [
    { nom: "Dakar", code: "DK", latitude: "14.6928", longitude: "-17.4467" },
    { nom: "Thiès", code: "TH", latitude: "14.7886", longitude: "-16.9260" },
    { nom: "Saint-Louis", code: "SL", latitude: "16.0178", longitude: "-16.4897" },
    { nom: "Diourbel", code: "DB", latitude: "14.6542", longitude: "-16.2333" },
    { nom: "Louga", code: "LG", latitude: "15.6167", longitude: "-16.2167" },
    { nom: "Fatick", code: "FK", latitude: "14.3333", longitude: "-16.4167" },
    { nom: "Kaolack", code: "KL", latitude: "14.1500", longitude: "-16.0667" },
    { nom: "Matam", code: "MT", latitude: "15.6556", longitude: "-13.2553" },
    { nom: "Tambacounda", code: "TC", latitude: "13.7708", longitude: "-13.6681" },
    { nom: "Kolda", code: "KD", latitude: "12.8833", longitude: "-14.9500" },
    { nom: "Ziguinchor", code: "ZG", latitude: "12.5600", longitude: "-16.2700" },
    { nom: "Kaffrine", code: "KF", latitude: "14.1069", longitude: "-15.5506" },
    { nom: "Kédougou", code: "KE", latitude: "12.5569", longitude: "-12.1747" },
    { nom: "Sédhiou", code: "SE", latitude: "12.7081", longitude: "-15.5569" },
  ];

  try {
    await db.insert(schema.regions).values(regionsData);
    console.log(`✓ Imported ${regionsData.length} regions`);
  } catch (error: any) {
    if (error.cause?.code === 'ER_DUP_ENTRY') {
      console.log(`⚠ Regions already exist, skipping`);
    } else {
      throw error;
    }
  }
}

async function importPollutionAir() {
  console.log("Importing pollution air data...");
  const dataPath = path.join(__dirname, "../data/pollution_air.csv");
  
  if (!fs.existsSync(dataPath)) {
    console.log("⚠ Pollution air file not found, skipping");
    return;
  }

  const rows = parseCSV(dataPath);
  const pollutionData = rows
    .slice(0, 1000) // Limiter pour éviter les timeouts
    .filter((row) => row.Year && row.PM25)
    .map((row) => ({
      annee: parseInt(row.Year) || 0,
      zone: row.Zone || "National",
      concentrationPm25: row.PM25 || "0",
    }))
    .filter((item) => item.annee > 0);

  if (pollutionData.length > 0) {
    await db.insert(schema.pollutionAir).values(pollutionData);
    console.log(`✓ Imported ${pollutionData.length} pollution air records`);
  }
}

async function main() {
  try {
    console.log("Starting data import...\n");

    await importRegions();
    await importMalaria();
    await importTuberculose();
    await importPollutionAir();

    console.log("\n✓ Data import completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

main();
