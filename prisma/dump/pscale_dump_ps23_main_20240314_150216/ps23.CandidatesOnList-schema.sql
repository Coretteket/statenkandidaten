CREATE TABLE `CandidatesOnList` (
  `candidateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `listId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL,
  UNIQUE KEY `CandidatesOnList_candidateId_listId_position_key` (`candidateId`,`listId`,`position`),
  KEY `CandidatesOnList_listId_idx` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
