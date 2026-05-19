import { router } from "../trpc";
import { formRouter } from "./form";
import { fieldRouter } from "./field";
import { responseRouter } from "./response";
import { billingRouter } from "./billing";
import { themeRouter } from "./theme";

export const appRouter = router({
  form: formRouter,
  field: fieldRouter,
  response: responseRouter,
  billing: billingRouter,
  theme: themeRouter,
});

export type AppRouter = typeof appRouter;
