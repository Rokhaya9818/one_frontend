import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./drizzle/schema";
import * as fs from "fs";

const db = drizzle(process.env.DATABASE_URL!);

async function exportAll() {
  console.log("Exporting all data...");
  
  const malaria = await db.select().from(schema.malaria);
  const tuberculose = await db.select().from(schema.tuberculose);
  const fvrHumain = await db.select().from(schema.fvrHumain);
  const fvrAnimal = await db.select().from(schema.fvrAnimal);
  const grippeAviaire = await db.select().from(schema.grippeAviaire);
  const pollutionAir = await db.select().from(schema.pollutionAir);
  const regions = await db.select().from(schema.regions);
  
  const exportData = {
    malaria,
    tuberculose,
    fvrHumain,
    fvrAnimal,
    grippeAviaire,
    pollutionAir,
    regions,
    exportDate: new Date().toISOString(),
    stats: {
      malaria: malaria.length,
      tuberculose: tuberculose.length,
      fvrHumain: fvrHumain.length,
      fvrAnimal: fvrAnimal.length,
      grippeAviaire: grippeAviaire.length,
      pollutionAir: pollutionAir.length,
      regions: regions.length,
    }
  };
  
  fs.writeFileSync("database-export.json", JSON.stringify(exportData, null, 2));
  console.log("✓ Database exported to database-export.json");
  console.log("Stats:", exportData.stats);
  
  process.exit(0);
}

exportAll();
