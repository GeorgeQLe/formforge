import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";

export async function createContext() {
  const { userId } = await auth();

  return {
    db,
    clerkUserId: userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
