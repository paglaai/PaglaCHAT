CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`enableNotifications` boolean DEFAULT true,
	`enableSoundNotifications` boolean DEFAULT true,
	`enableBadgeNotifications` boolean DEFAULT true,
	`enableEmailNotifications` boolean DEFAULT false,
	`notificationTypes` json,
	`quietHoursStart` varchar(5),
	`quietHoursEnd` varchar(5),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('info','success','warning','error','custom') NOT NULL DEFAULT 'info',
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`icon` varchar(64),
	`action` varchar(255),
	`actionLabel` varchar(64),
	`isRead` boolean DEFAULT false,
	`isPinned` boolean DEFAULT false,
	`expiresAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
