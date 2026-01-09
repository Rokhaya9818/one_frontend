import { drizzle } from "drizzle-orm/mysql2";
import { malaria, tuberculose } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function checkData() {
  console.log("=== Checking Malaria Data ===");
  const malariaData = await db.select().from(malaria).limit(5);
  console.log("Sample malaria records:", JSON.stringify(malariaData, null, 2));
  
  console.log("\n=== Checking Tuberculose Data ===");
  const tbData = await db.select().from(tuberculose).limit(5);
  console.log("Sample tuberculose records:", JSON.stringify(tbData, null, 2));
  
  process.exit(0);
}

checkData();
