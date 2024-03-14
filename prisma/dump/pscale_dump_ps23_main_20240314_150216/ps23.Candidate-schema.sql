CREATE TABLE `Candidate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `initials` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `incumbent` tinyint(1) DEFAULT NULL,
  `elected` tinyint(1) DEFAULT NULL,
  `locality` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deputy` tinyint(1) DEFAULT NULL,
  `parliament` tinyint(1) DEFAULT NULL,
  `senate` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Candidate_initials_surname_locality_key` (`initials`,`surname`,`locality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
