import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(process.env.DATABASE_URL!);

async function importMalaria() {
  console.log("Importing malaria data...");
  const dataPath = path.join(__dirname, "../data/malaria_indicateurs.csv");
  const content = fs.readFileSync(dataPath, "utf-8");
  const lines = content.split("\n");
  
  // Skip first 2 header lines
  const dataLines = lines.slice(2).filter(line => line.trim());
  
  let imported = 0;
  let skipped = 0;
  
  for (const line of dataLines) {
    const parts = line.split(",");
    if (parts.length < 15) {
      skipped++;
      continue;
    }
    
    const indicatorCode = parts[0]?.trim();
    const indicatorName = parts[1]?.trim();
    const yearStr = parts[3]?.trim();
    const numericValue = parts[13]?.trim();
    const value = parts[14]?.trim();
    const lowValue = parts[15]?.trim();
    const highValue = parts[16]?.trim();
    
    const year = parseInt(yearStr);
    
    if (!indicatorCode || !year || isNaN(year)) {
      skipped++;
      continue;
    }
    
    try {
      await db.insert(schema.malaria).values({
        indicatorCode,
        indicatorName: indicatorName || "Unknown",
        year,
        value: value || null,
        numericValue: numericValue || null,
        lowValue: lowValue || null,
        highValue: highValue || null,
      });
      imported++;
      
      if (imported % 50 === 0) {
        console.log(`  Imported ${imported} malaria records...`);
      }
    } catch (error: any) {
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        // Ignore duplicates
      } else {
        console.error(`Error importing malaria record:`, error.message);
      }
    }
  }
  
  console.log(`✓ Imported ${imported} malaria records (skipped ${skipped})`);
}

async function importTuberculose() {
  console.log("Importing tuberculose data...");
  const dataPath = path.join(__dirname, "../data/tuberculose_indicateurs.csv");
  const content = fs.readFileSync(dataPath, "utf-8");
  const lines = content.split("\n");
  
  // Skip first 2 header lines
  const dataLines = lines.slice(2).filter(line => line.trim());
  
  let imported = 0;
  let skipped = 0;
  
  for (const line of dataLines) {
    const parts = line.split(",");
    if (parts.length < 15) {
      skipped++;
      continue;
    }
    
    const indicatorCode = parts[0]?.trim();
    const indicatorName = parts[1]?.trim();
    const yearStr = parts[3]?.trim();
    const numericValue = parts[13]?.trim();
    const value = parts[14]?.trim();
    const lowValue = parts[15]?.trim();
    const highValue = parts[16]?.trim();
    
    const year = parseInt(yearStr);
    
    if (!indicatorCode || !year || isNaN(year)) {
      skipped++;
      continue;
    }
    
    try {
      await db.insert(schema.tuberculose).values({
        indicatorCode,
        indicatorName: indicatorName || "Unknown",
        year,
        value: value || null,
        numericValue: numericValue || null,
        lowValue: lowValue || null,
        highValue: highValue || null,
      });
      imported++;
      
      if (imported % 50 === 0) {
        console.log(`  Imported ${imported} tuberculose records...`);
      }
    } catch (error: any) {
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        // Ignore duplicates
      } else {
        console.error(`Error importing tuberculose record:`, error.message);
      }
    }
  }
  
  console.log(`✓ Imported ${imported} tuberculose records (skipped ${skipped})`);
}

async function importPollutionAir() {
  console.log("Importing pollution air data...");
  const dataPath = path.join(__dirname, "../data/pollution_air.csv");
  
  if (!fs.existsSync(dataPath)) {
    console.log("⚠ Pollution air file not found, skipping");
    return;
  }

  const content = fs.readFileSync(dataPath, "utf-8");
  const lines = content.split("\n");
  
  // Skip first 2 header lines
  const dataLines = lines.slice(2).filter(line => line.trim()).slice(0, 500); // Limit to 500 records
  
  let imported = 0;
  
  for (const line of dataLines) {
    const parts = line.split(",");
    if (parts.length < 14) continue;
    
    const yearStr = parts[3]?.trim();
    const numericValue = parts[13]?.trim();
    
    const annee = parseInt(yearStr);
    
    if (!annee || isNaN(annee) || !numericValue) continue;
    
    try {
      await db.insert(schema.pollutionAir).values({
        annee,
        zone: "National",
        concentrationPm25: numericValue,
      });
      imported++;
    } catch (error: any) {
      if (error.cause?.code === 'ER_DUP_ENTRY') {
        // Ignore duplicates
      }
    }
  }
  
  console.log(`✓ Imported ${imported} pollution air records`);
}

async function main() {
  try {
    console.log("Starting data import...\n");

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
