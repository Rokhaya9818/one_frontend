import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Table des indicateurs de paludisme (malaria)
 */
export const malaria = mysqlTable("malaria", {
  id: int("id").autoincrement().primaryKey(),
  indicatorCode: varchar("indicatorCode", { length: 100 }).notNull(),
  indicatorName: text("indicatorName").notNull(),
  year: int("year").notNull(),
  value: varchar("value", { length: 100 }),
  numericValue: varchar("numericValue", { length: 50 }),
  lowValue: varchar("lowValue", { length: 50 }),
  highValue: varchar("highValue", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Malaria = typeof malaria.$inferSelect;
export type InsertMalaria = typeof malaria.$inferInsert;

/**
 * Table des indicateurs de tuberculose
 */
export const tuberculose = mysqlTable("tuberculose", {
  id: int("id").autoincrement().primaryKey(),
  indicatorCode: varchar("indicatorCode", { length: 100 }).notNull(),
  indicatorName: text("indicatorName").notNull(),
  year: int("year").notNull(),
  value: varchar("value", { length: 100 }),
  numericValue: varchar("numericValue", { length: 50 }),
  lowValue: varchar("lowValue", { length: 50 }),
  highValue: varchar("highValue", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tuberculose = typeof tuberculose.$inferSelect;
export type InsertTuberculose = typeof tuberculose.$inferInsert;

/**
 * Table des cas FVR humains
 */
export const fvrHumain = mysqlTable("fvr_humain", {
  id: int("id").autoincrement().primaryKey(),
  dateBilan: date("dateBilan").notNull(),
  casConfirmes: int("casConfirmes").notNull().default(0),
  deces: int("deces").notNull().default(0),
  gueris: int("gueris").notNull().default(0),
  region: varchar("region", { length: 100 }),
  district: varchar("district", { length: 100 }),
  tauxLetalite: varchar("tauxLetalite", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FvrHumain = typeof fvrHumain.$inferSelect;
export type InsertFvrHumain = typeof fvrHumain.$inferInsert;

/**
 * Table des cas FVR animaux
 */
export const fvrAnimal = mysqlTable("fvr_animal", {
  id: int("id").autoincrement().primaryKey(),
  annee: int("annee").notNull(),
  cas: int("cas").notNull().default(0),
  espece: varchar("espece", { length: 100 }),
  region: varchar("region", { length: 100 }),
  localisation: varchar("localisation", { length: 100 }),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FvrAnimal = typeof fvrAnimal.$inferSelect;
export type InsertFvrAnimal = typeof fvrAnimal.$inferInsert;

/**
 * Table de la grippe aviaire
 */
export const grippeAviaire = mysqlTable("grippe_aviaire", {
  id: int("id").autoincrement().primaryKey(),
  reportId: varchar("reportId", { length: 100 }).notNull().unique(),
  dateRapport: date("dateRapport").notNull(),
  region: varchar("region", { length: 100 }),
  espece: varchar("espece", { length: 100 }),
  maladie: text("maladie"),
  casConfirmes: int("casConfirmes").notNull().default(0),
  deces: int("deces").notNull().default(0),
  statutEpidemie: varchar("statutEpidemie", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GrippeAviaire = typeof grippeAviaire.$inferSelect;
export type InsertGrippeAviaire = typeof grippeAviaire.$inferInsert;

/**
 * Table de pluviométrie
 */
export const pluviometrie = mysqlTable("pluviometrie", {
  id: int("id").autoincrement().primaryKey(),
  dateObservation: date("dateObservation").notNull(),
  region: varchar("region", { length: 100 }),
  pluieMoyenne: varchar("pluieMoyenne", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pluviometrie = typeof pluviometrie.$inferSelect;
export type InsertPluviometrie = typeof pluviometrie.$inferInsert;

/**
 * Table de pollution de l'air (PM2.5)
 */
export const pollutionAir = mysqlTable("pollution_air", {
  id: int("id").autoincrement().primaryKey(),
  annee: int("annee").notNull(),
  zone: varchar("zone", { length: 50 }).notNull(),
  concentrationPm25: varchar("concentrationPm25", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PollutionAir = typeof pollutionAir.$inferSelect;
export type InsertPollutionAir = typeof pollutionAir.$inferInsert;

/**
 * Table de mortalité animale
 */
export const animalMortalite = mysqlTable("animal_mortalite", {
  id: int("id").autoincrement().primaryKey(),
  dateObservation: date("dateObservation").notNull(),
  departement: varchar("departement", { length: 100 }),
  nombreMorts: int("nombreMorts").notNull().default(0),
  espece: varchar("espece", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnimalMortalite = typeof animalMortalite.$inferSelect;
export type InsertAnimalMortalite = typeof animalMortalite.$inferInsert;

/**
 * Table des régions du Sénégal
 */
export const regions = mysqlTable("regions", {
  id: int("id").autoincrement().primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Region = typeof regions.$inferSelect;
export type InsertRegion = typeof regions.$inferInsert;
