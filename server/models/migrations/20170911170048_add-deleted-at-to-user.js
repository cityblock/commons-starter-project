exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "deletedAt" timestamptz;
    ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_email_unique";
    ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_athenaproviderid_unique";
    CREATE INDEX IF NOT EXISTS "user_deletedat_index" ON "user" ("deletedAt");
  `)
  .raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT constraint_name
                     FROM information_schema.constraint_column_usage
                     WHERE table_name = 'user' AND constraint_name = 'user_deletedat_email_unique')
      THEN
        EXECUTE 'ALTER TABLE "user" ADD CONSTRAINT "user_deletedat_email_unique" UNIQUE ("deletedAt", "email");';
      END IF;
    END $$;
  `)
  .raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT constraint_name
                     FROM information_schema.constraint_column_usage
                     WHERE table_name = 'user' AND constraint_name = 'user_deletedat_athenaproviderid_unique')
      THEN
        EXECUTE 'ALTER TABLE "user" ADD CONSTRAINT "user_deletedat_athenaproviderid_unique" UNIQUE ("deletedAt", "athenaProviderId");';
      END IF;
    END $$;
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema;
};
