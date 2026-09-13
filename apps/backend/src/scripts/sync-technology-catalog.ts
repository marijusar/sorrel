import { DbClient } from "@/db/client";
import { dbEnv } from "@/db/env";
import { LoggerFactory } from "@/logging/logger";
import { TechnologyFingerprints } from "@/crawler/technology-fingerprints";
import { TechnologyCatalogRepository, type CatalogEntry } from "@/modules/technology/catalog-repository";

class SyncTechnologyCatalogCommand {
  static async run(): Promise<void> {
    const logger = LoggerFactory.create("sync-technology-catalog");
    const db = DbClient.create(dbEnv.DATABASE_URL);
    const fingerprints = await TechnologyFingerprints.load();

    const entries: CatalogEntry[] = [...fingerprints.technologies.entries()].map(([name, tech]) => ({
      name,
      category: tech.category,
    }));

    await TechnologyCatalogRepository.upsertMany(db, entries);
    logger.info({ count: entries.length }, "technology catalog synced");

    await db.destroy();
  }
}

await SyncTechnologyCatalogCommand.run();
