CREATE TABLE `appleSiliconSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`enableMetalAcceleration` int DEFAULT 1,
	`enableCoreMLConversion` int DEFAULT 1,
	`maxMemoryUsage` int DEFAULT 12,
	`enableMemoryMapping` int DEFAULT 1,
	`threadCount` int DEFAULT 8,
	`batchSize` int DEFAULT 1,
	`preferredFormat` enum('gguf','mlx','auto') DEFAULT 'auto',
	`metadata` json DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appleSiliconSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `localModels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`providerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`modelPath` varchar(512) NOT NULL,
	`format` enum('gguf','mlx','safetensors','other') NOT NULL,
	`fileSize` int,
	`quantization` varchar(64),
	`parameters` varchar(64),
	`isAppleSiliconOptimized` int DEFAULT 0,
	`metalAcceleration` int DEFAULT 0,
	`coreMLConversion` int DEFAULT 0,
	`memoryRequired` int,
	`estimatedLatency` int,
	`description` text,
	`metadata` json DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `localModels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providerCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`providerId` int NOT NULL,
	`apiKey` varchar(512) NOT NULL,
	`apiEndpoint` varchar(512),
	`isActive` int NOT NULL DEFAULT 1,
	`metadata` json DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providerCredentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`type` enum('cloud','local','hybrid') NOT NULL,
	`baseUrl` varchar(512),
	`description` text,
	`isEnabled` int NOT NULL DEFAULT 1,
	`requiresAuth` int NOT NULL DEFAULT 1,
	`supportedFormats` json DEFAULT ('[]'),
	`maxTokens` int DEFAULT 4096,
	`temperature` varchar(10) DEFAULT '0.7',
	`metadata` json DEFAULT ('{}'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`),
	CONSTRAINT `providers_name_unique` UNIQUE(`name`)
);
