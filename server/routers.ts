import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // One Health Data Routers
  dashboard: router({
    kpis: publicProcedure.query(async () => {
      return await db.getDashboardKPIs();
    }),
    fvrHumainTotal: publicProcedure.query(async () => {
      return await db.getFvrHumainTotal();
    }),
    fvrHumainByRegion: publicProcedure.query(async () => {
      return await db.getFvrHumainByRegion();
    }),
    fvrAnimalTotal: publicProcedure.query(async () => {
      return await db.getFvrAnimalTotal();
    }),
    fvrAnimalByRegion: publicProcedure.query(async () => {
      return await db.getFvrAnimalByRegion();
    }),
    malariaByIndicator: publicProcedure.query(async () => {
      return await db.getMalariaByIndicator();
    }),
    tuberculoseByIndicator: publicProcedure.query(async () => {
      return await db.getTuberculoseByIndicator();
    }),
  }),

  malaria: router({
    list: publicProcedure
      .input(z.object({
        yearStart: z.number().optional(),
        yearEnd: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getMalariaData(input?.yearStart, input?.yearEnd);
      }),
  }),

  tuberculose: router({
    list: publicProcedure
      .input(z.object({
        yearStart: z.number().optional(),
        yearEnd: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getTuberculoseData(input?.yearStart, input?.yearEnd);
      }),
  }),

  regions: router({
    list: publicProcedure.query(async () => {
      return await db.getRegions();
    }),
  }),

  pollution: router({
    list: publicProcedure
      .input(z.object({
        yearStart: z.number().optional(),
        yearEnd: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getPollutionAirData(input?.yearStart, input?.yearEnd);
      }),
  }),

  fvr: router({
    humain: publicProcedure.query(async () => {
      return await db.getFvrHumainData();
    }),
    animal: publicProcedure.query(async () => {
      return await db.getFvrAnimalData();
    }),
  }),

  grippeAviaire: router({
    list: publicProcedure.query(async () => {
      return await db.getGrippeAviaireData();
    }),
  }),
});

export type AppRouter = typeof appRouter;
