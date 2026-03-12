import { appRouter } from "@/server/trpc/routers/_app";
import { createContext } from "@/server/trpc/context";

/**
 * Server-side tRPC caller for use in Server Components / Server Actions.
 */
export async function createServerCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}
