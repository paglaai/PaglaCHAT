import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Extended providers table for new LLM providers
 * Supports cloud-based and local model providers
 */
export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(), // e.g., "Gemini", "OpenRouter", "Ollama"
  type: mysqlEnum("type", ["cloud", "local", "hybrid"]).notNull(), // cloud, local, or hybrid
  baseUrl: varchar("baseUrl", { length: 512 }), // API base URL for cloud providers
  description: text("description"),
  isEnabled: int("isEnabled").default(1).notNull(),
  requiresAuth: int("requiresAuth").default(1).notNull(), // whether API key is required
  supportedFormats: json("supportedFormats").$type<string[]>().default([]), // ["gguf", "mlx", "safetensors"]
  maxTokens: int("maxTokens").default(4096), // default max tokens
  temperature: varchar("temperature", { length: 10 }).default("0.7"), // default temperature
  metadata: json("metadata").$type<Record<string, unknown>>().default({}), // provider-specific settings
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

/**
 * Local models table for .gguf and .mlx models
 * Stores information about locally available models
 */
export const localModels = mysqlTable("localModels", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // user who owns/uploaded this model
  providerId: int("providerId").notNull(), // reference to providers table
  name: varchar("name", { length: 128 }).notNull(), // e.g., "Llama 2 7B"
  modelPath: varchar("modelPath", { length: 512 }).notNull(), // local file path
  format: mysqlEnum("format", ["gguf", "mlx", "safetensors", "other"]).notNull(),
  fileSize: int("fileSize"), // in MB
  quantization: varchar("quantization", { length: 64 }), // e.g., "Q4_K_M", "Q5_K_S"
  parameters: varchar("parameters", { length: 64 }), // e.g., "7B", "13B", "70B"
  isAppleSiliconOptimized: int("isAppleSiliconOptimized").default(0),
  metalAcceleration: int("metalAcceleration").default(0), // Metal GPU acceleration enabled
  coreMLConversion: int("coreMLConversion").default(0), // CoreML conversion available
  memoryRequired: int("memoryRequired"), // in GB
  estimatedLatency: int("estimatedLatency"), // in ms, for M2 Pro
  description: text("description"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LocalModel = typeof localModels.$inferSelect;
export type InsertLocalModel = typeof localModels.$inferInsert;

/**
 * Provider credentials table for API keys and authentication
 */
export const providerCredentials = mysqlTable("providerCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  providerId: int("providerId").notNull(),
  apiKey: varchar("apiKey", { length: 512 }).notNull(), // encrypted
  apiEndpoint: varchar("apiEndpoint", { length: 512 }), // custom endpoint for self-hosted
  isActive: int("isActive").default(1).notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProviderCredential = typeof providerCredentials.$inferSelect;
export type InsertProviderCredential = typeof providerCredentials.$inferInsert;

/**
 * Apple Silicon optimization settings
 */
export const appleSiliconSettings = mysqlTable("appleSiliconSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  enableMetalAcceleration: int("enableMetalAcceleration").default(1),
  enableCoreMLConversion: int("enableCoreMLConversion").default(1),
  maxMemoryUsage: int("maxMemoryUsage").default(12), // in GB, for 16GB M2 Pro
  enableMemoryMapping: int("enableMemoryMapping").default(1),
  threadCount: int("threadCount").default(8), // CPU threads for inference
  batchSize: int("batchSize").default(1),
  preferredFormat: mysqlEnum("preferredFormat", ["gguf", "mlx", "auto"]).default("auto"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppleSiliconSetting = typeof appleSiliconSettings.$inferSelect;
export type InsertAppleSiliconSetting = typeof appleSiliconSettings.$inferInsert;
