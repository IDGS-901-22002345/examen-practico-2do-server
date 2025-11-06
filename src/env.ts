import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number(),
  },
  //@ts-ignore
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
