import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, malaria, tuberculose, regions, pollutionAir, fvrHumain, fvrAnimal, grippeAviaire } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// ONE HEALTH DATA QUERIES
// ============================================================================

export async function getMalariaData(yearStart?: number, yearEnd?: number) {
  const db = await getDb();
  if (!db) return [];

  if (yearStart && yearEnd) {
    return await db.select().from(malaria)
      .where(and(gte(malaria.year, yearStart), lte(malaria.year, yearEnd)))
      .orderBy(desc(malaria.year));
  }

  return await db.select().from(malaria).orderBy(desc(malaria.year));
}

export async function getTuberculoseData(yearStart?: number, yearEnd?: number) {
  const db = await getDb();
  if (!db) return [];

  if (yearStart && yearEnd) {
    return await db.select().from(tuberculose)
      .where(and(gte(tuberculose.year, yearStart), lte(tuberculose.year, yearEnd)))
      .orderBy(desc(tuberculose.year));
  }

  return await db.select().from(tuberculose).orderBy(desc(tuberculose.year));
}

export async function getRegions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(regions);
}

export async function getPollutionAirData(yearStart?: number, yearEnd?: number) {
  const db = await getDb();
  if (!db) return [];

  if (yearStart && yearEnd) {
    return await db.select().from(pollutionAir)
      .where(and(gte(pollutionAir.annee, yearStart), lte(pollutionAir.annee, yearEnd)))
      .orderBy(desc(pollutionAir.annee));
  }

  return await db.select().from(pollutionAir).orderBy(desc(pollutionAir.annee));
}

export async function getFvrHumainData() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fvrHumain).orderBy(desc(fvrHumain.dateBilan));
}

export async function getFvrAnimalData() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fvrAnimal).orderBy(desc(fvrAnimal.annee));
}

export async function getGrippeAviaireData() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grippeAviaire).orderBy(desc(grippeAviaire.dateRapport));
}

export async function getDashboardKPIs() {
  const db = await getDb();
  if (!db) return null;

  try {
    // Get latest malaria data
    const malariaRecent = await db
      .select()
      .from(malaria)
      .where(eq(malaria.indicatorCode, "MALARIA_CONF_CASES"))
      .orderBy(desc(malaria.year))
      .limit(1);

    // Get latest tuberculose data
    const tbRecent = await db
      .select()
      .from(tuberculose)
      .where(eq(tuberculose.indicatorCode, "MDG_0000000020"))
      .orderBy(desc(tuberculose.year))
      .limit(1);

    // Get FVR counts
    const fvrHumainCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(fvrHumain);

    const fvrAnimalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(fvrAnimal);

    // Get grippe aviaire count
    const grippeCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(grippeAviaire);

    // Get latest pollution data
    const pollutionRecent = await db
      .select()
      .from(pollutionAir)
      .where(eq(pollutionAir.zone, "National"))
      .orderBy(desc(pollutionAir.annee))
      .limit(1);

    return {
      malariaCases: malariaRecent[0]?.numericValue || "0",
      tuberculoseCases: tbRecent[0]?.numericValue || "0",
      fvrHumainCases: fvrHumainCount[0]?.count || 0,
      fvrAnimalCases: fvrAnimalCount[0]?.count || 0,
      grippeAviaireCases: grippeCount[0]?.count || 0,
      pm25Recent: pollutionRecent[0]?.concentrationPm25 || "0",
    };
  } catch (error) {
    console.error("Error getting dashboard KPIs:", error);
    return null;
  }
}

// Requêtes pour totaux et répartitions géographiques
export async function getFvrHumainTotal() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ total: sql`SUM(${fvrHumain.casConfirmes})` }).from(fvrHumain);
  return Number(result[0]?.total || 0);
}

export async function getFvrHumainByRegion() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      region: fvrHumain.region,
      total: sql`SUM(${fvrHumain.casConfirmes})`,
    })
    .from(fvrHumain)
    .where(sql`${fvrHumain.region} IS NOT NULL AND ${fvrHumain.region} != ''`)
    .groupBy(fvrHumain.region);
  
  return result.map(r => ({ region: r.region || "Inconnu", total: Number(r.total || 0) }));
}

export async function getFvrAnimalTotal() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ total: sql`SUM(${fvrAnimal.cas})` }).from(fvrAnimal);
  return Number(result[0]?.total || 0);
}

export async function getFvrAnimalByRegion() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      region: fvrAnimal.region,
      total: sql`SUM(${fvrAnimal.cas})`,
    })
    .from(fvrAnimal)
    .where(sql`${fvrAnimal.region} IS NOT NULL AND ${fvrAnimal.region} != ''`)
    .groupBy(fvrAnimal.region);
  
  return result.map(r => ({ region: r.region || "Inconnu", total: Number(r.total || 0) }));
}

export async function getMalariaByIndicator() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db
      .select({
        indicator: malaria.indicatorName,
        total: sql`SUM(CAST(REPLACE(${malaria.numericValue}, ',', '') AS DECIMAL(20,2)))`,
      })
      .from(malaria)
      .where(sql`${malaria.numericValue} IS NOT NULL AND ${malaria.numericValue} != '' AND ${malaria.numericValue} REGEXP '^[0-9.,]+$'`)
      .groupBy(malaria.indicatorName)
      .limit(6);
    
    return result.map(r => ({ 
      name: (r.indicator || "Inconnu").substring(0, 35),
      value: Math.round(Number(r.total || 0))
    })).filter(r => r.value > 0);
  } catch (error) {
    console.error("Error in getMalariaByIndicator:", error);
    return [];
  }
}

export async function getTuberculoseByIndicator() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db
      .select({
        indicator: tuberculose.indicatorName,
        total: sql`SUM(CAST(REPLACE(${tuberculose.numericValue}, ',', '') AS DECIMAL(20,2)))`,
      })
      .from(tuberculose)
      .where(sql`${tuberculose.numericValue} IS NOT NULL AND ${tuberculose.numericValue} != '' AND ${tuberculose.numericValue} REGEXP '^[0-9.,]+$'`)
      .groupBy(tuberculose.indicatorName)
      .limit(6);
    
    return result.map(r => ({ 
      name: (r.indicator || "Inconnu").substring(0, 35),
      value: Math.round(Number(r.total || 0))
    })).filter(r => r.value > 0);
  } catch (error) {
    console.error("Error in getTuberculoseByIndicator:", error);
    return [];
  }
}
