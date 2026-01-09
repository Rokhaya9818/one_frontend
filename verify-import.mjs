import { drizzle } from "drizzle-orm/mysql2";
import { malaria, tuberculose } from "./drizzle/schema.ts";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const malariaCount = await db.select({ count: sql`count(*)` }).from(malaria);
const tbCount = await db.select({ count: sql`count(*)` }).from(tuberculose);

console.log("Malaria records:", malariaCount[0]?.count || 0);
console.log("Tuberculose records:", tbCount[0]?.count || 0);

// Get sample
const malariaSample = await db.select().from(malaria).limit(3);
console.log("\nMalaria sample:");
malariaSample.forEach(m => {
  console.log(`  ${m.year}: ${m.indicatorName} = ${m.numericValue}`);
});

process.exit(0);
