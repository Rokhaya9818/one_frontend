import { drizzle } from "drizzle-orm/mysql2";
import { malaria, tuberculose, pollutionAir, regions } from "./drizzle/schema";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function checkData() {
  const malariaCount = await db.select({ count: sql<number>\`count(*)\` }).from(malaria);
  const tbCount = await db.select({ count: sql<number>\`count(*)\` }).from(tuberculose);
  const pollutionCount = await db.select({ count: sql<number>\`count(*)\` }).from(pollutionAir);
  const regionsCount = await db.select({ count: sql<number>\`count(*)\` }).from(regions);
  
  console.log("Malaria records:", malariaCount[0]?.count || 0);
  console.log("Tuberculose records:", tbCount[0]?.count || 0);
  console.log("Pollution records:", pollutionCount[0]?.count || 0);
  console.log("Regions:", regionsCount[0]?.count || 0);
  
  // Check some sample data
  const malariaSample = await db.select().from(malaria).limit(3);
  console.log("\nMalaria sample:", JSON.stringify(malariaSample, null, 2));
}

checkData().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
