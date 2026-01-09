CREATE TABLE `animal_mortalite` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateObservation` date NOT NULL,
	`departement` varchar(100),
	`nombreMorts` int NOT NULL DEFAULT 0,
	`espece` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `animal_mortalite_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fvr_animal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`annee` int NOT NULL,
	`cas` int NOT NULL DEFAULT 0,
	`espece` varchar(100),
	`region` varchar(100),
	`localisation` varchar(100),
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fvr_animal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fvr_humain` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateBilan` date NOT NULL,
	`casConfirmes` int NOT NULL DEFAULT 0,
	`deces` int NOT NULL DEFAULT 0,
	`gueris` int NOT NULL DEFAULT 0,
	`region` varchar(100),
	`district` varchar(100),
	`tauxLetalite` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fvr_humain_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grippe_aviaire` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` varchar(100) NOT NULL,
	`dateRapport` date NOT NULL,
	`region` varchar(100),
	`espece` varchar(100),
	`maladie` text,
	`casConfirmes` int NOT NULL DEFAULT 0,
	`deces` int NOT NULL DEFAULT 0,
	`statutEpidemie` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grippe_aviaire_id` PRIMARY KEY(`id`),
	CONSTRAINT `grippe_aviaire_reportId_unique` UNIQUE(`reportId`)
);
--> statement-breakpoint
CREATE TABLE `malaria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`indicatorCode` varchar(100) NOT NULL,
	`indicatorName` text NOT NULL,
	`year` int NOT NULL,
	`value` varchar(100),
	`numericValue` varchar(50),
	`lowValue` varchar(50),
	`highValue` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `malaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pluviometrie` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateObservation` date NOT NULL,
	`region` varchar(100),
	`pluieMoyenne` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pluviometrie_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pollution_air` (
	`id` int AUTO_INCREMENT NOT NULL,
	`annee` int NOT NULL,
	`zone` varchar(50) NOT NULL,
	`concentrationPm25` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pollution_air_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nom` varchar(100) NOT NULL,
	`code` varchar(10) NOT NULL,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `regions_id` PRIMARY KEY(`id`),
	CONSTRAINT `regions_nom_unique` UNIQUE(`nom`),
	CONSTRAINT `regions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `tuberculose` (
	`id` int AUTO_INCREMENT NOT NULL,
	`indicatorCode` varchar(100) NOT NULL,
	`indicatorName` text NOT NULL,
	`year` int NOT NULL,
	`value` varchar(100),
	`numericValue` varchar(50),
	`lowValue` varchar(50),
	`highValue` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tuberculose_id` PRIMARY KEY(`id`)
);
