ALTER TABLE "Candidatures" ADD COLUMN IF NOT EXISTS "EvaluationDetails" TEXT;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") VALUES ('20260228015942_AddEvaluationDetails', '10.0.3') ON CONFLICT DO NOTHING;
