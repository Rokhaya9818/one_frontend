import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function importFVRHumain() {
  console.log("Importing FVR Humain data...");
  
  const fvrHumainData = [
    { dateBilan: new Date("2025-10-13"), casConfirmes: 147, deces: 19, gueris: 115, region: "Saint-Louis", district: "Richard-Toll" },
    { dateBilan: new Date("2025-10-13"), casConfirmes: 147, deces: 19, gueris: 115, region: "Saint-Louis", district: "Saint-Louis" },
    { dateBilan: new Date("2025-10-13"), casConfirmes: 147, deces: 19, gueris: 115, region: "Matam", district: "" },
    { dateBilan: new Date("2025-10-13"), casConfirmes: 147, deces: 19, gueris: 115, region: "Louga", district: "" },
    { dateBilan: new Date("2025-10-13"), casConfirmes: 147, deces: 19, gueris: 115, region: "Fatick", district: "" },
    { dateBilan: new Date("2025-10-08"), casConfirmes: 119, deces: 17, gueris: 0, region: "Saint-Louis", district: "Richard-Toll" },
    { dateBilan: new Date("2025-09-30"), casConfirmes: 119, deces: 16, gueris: 0, region: "Saint-Louis", district: "" },
  ];

  try {
    await db.insert(schema.fvrHumain).values(fvrHumainData);
    console.log(`✓ Imported ${fvrHumainData.length} FVR Humain records`);
  } catch (error: any) {
    if (error.cause?.code === 'ER_DUP_ENTRY') {
      console.log(`⚠ FVR Humain data already exists, skipping`);
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function importFVRAnimal() {
  console.log("Importing FVR Animal data...");
  
  const fvrAnimalData = [
    { annee: 2013, cas: 7, espece: "cattle", region: "Dakar", localisation: null },
    { annee: 2013, cas: 45, espece: "cattle, goats, wildlife", region: "Saint-Louis", localisation: null },
    { annee: 2014, cas: 1, espece: null, region: "Saint-Louis", localisation: null },
    { annee: 2015, cas: 63, espece: null, region: "Saint-Louis", localisation: null },
    { annee: 2019, cas: 84, espece: "sheep/goats", region: "Saint-Louis", localisation: null },
    { annee: 2020, cas: 1, espece: "antelope", region: "Saint-Louis", localisation: "Bango" },
    { annee: 2015, cas: 35, espece: null, region: "Tambacounda", localisation: null },
    { annee: 2019, cas: 10, espece: "sheep/goats", region: "Thiès", localisation: null },
    { annee: 2019, cas: 75, espece: "sheep/goats", region: "Ziguinchor", localisation: null },
    { annee: 2018, cas: 9, espece: null, region: "Kaffrine", localisation: null },
    { annee: 2015, cas: 11, espece: null, region: "Kaolack", localisation: null },
    { annee: 2018, cas: 10, espece: null, region: "Kaolack", localisation: null },
    { annee: 2018, cas: 34, espece: null, region: "Kédougou", localisation: null },
    { annee: 2018, cas: 21, espece: null, region: "Louga", localisation: null },
    { annee: 2019, cas: 12, espece: "sheep/goats", region: "Louga", localisation: null },
    { annee: 2016, cas: 30, espece: null, region: "Matam", localisation: null },
    { annee: 2018, cas: 37, espece: null, region: "Matam", localisation: null },
  ];

  try {
    await db.insert(schema.fvrAnimal).values(fvrAnimalData);
    console.log(`✓ Imported ${fvrAnimalData.length} FVR Animal records`);
  } catch (error: any) {
    if (error.cause?.code === 'ER_DUP_ENTRY') {
      console.log(`⚠ FVR Animal data already exists, skipping`);
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function importGrippeAviaire() {
  console.log("Importing Grippe Aviaire data...");
  
  const grippeAviaireData = [
    { reportId: "1f1c9dde-8df8-4f27-b633-9b33346c95ed", dateRapport: "2022-02-17", region: null, espece: "Poultry", maladie: "Influenza A viruses of high pathogenicity", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "c302f316-e626-4357-a258-291f05ce3845", dateRapport: "2022-02-11", region: null, espece: "Poultry", maladie: "High pathogenicity avian influenza viruses", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "3d132aec-17df-4f23-a1c9-15aa65319943", dateRapport: "2022-02-11", region: null, espece: "Poultry", maladie: "Influenza A viruses of high pathogenicity", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "caadea8c-34b7-4da1-ada9-a4a928e21a0d", dateRapport: "2019-06-02", region: null, espece: "Poultry", maladie: "Equine influenza virus", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "198697bc-a463-4257-8d1a-f6f2ed142388", dateRapport: "2024-03-08", region: null, espece: "Poultry", maladie: "Influenza A viruses of high pathogenicity", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "5a6bcc9a-457a-46dd-b3af-10bae3673f0e", dateRapport: "2024-03-08", region: null, espece: "Poultry", maladie: "Influenza A viruses of high pathogenicity", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
    { reportId: "4d66a61e-1c54-4824-a432-9f4e6271066b", dateRapport: "2024-03-08", region: null, espece: "Poultry", maladie: "High pathogenicity avian influenza viruses", casConfirmes: 0, deces: 0, statutEpidemie: "Resolved" },
  ];

  try {
    await db.insert(schema.grippeAviaire).values(grippeAviaireData);
    console.log(`✓ Imported ${grippeAviaireData.length} Grippe Aviaire records`);
  } catch (error: any) {
    if (error.cause?.code === 'ER_DUP_ENTRY') {
      console.log(`⚠ Grippe Aviaire data already exists, skipping`);
    } else {
      console.error("Error:", error.message);
    }
  }
}

async function main() {
  console.log("Starting data import from dump...");
  
  await importFVRHumain();
  await importFVRAnimal();
  await importGrippeAviaire();
  
  console.log("✓ Data import completed successfully!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
