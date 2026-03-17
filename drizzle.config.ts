import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: ["./drizzle/schema.ts", "./drizzle/notifications.ts", "./drizzle/providers.ts"],
  out: "./drizzle",
  // Migrations for new providers
  migrations: {
    table: "__drizzle_migrations__",
    schema: "public",
  },
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
  // Enable verbose logging for debugging
  verbose: false,
  strict: true,
});
