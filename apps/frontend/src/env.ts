import { z } from "zod";

export const envSchema = z.object({
  INTERNAL_API_URL: z.url(),
  APP_ENABLED: z
    .enum(["true", "false"])
    .catch("true")
    .transform((value) => value === "true"),
});
