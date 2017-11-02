exports.up = async function(knex, Promise) {
  const dropStatements = await knex.schema.raw(`
  SELECT 'ALTER TABLE "'||nspname||'"."'||relname||'" DROP CONSTRAINT "'||conname||'";' AS statement
   FROM pg_constraint
   INNER JOIN pg_class ON conrelid=pg_class.oid
   INNER JOIN pg_namespace ON pg_namespace.oid=pg_class.relnamespace
   ORDER BY CASE WHEN contype='f' THEN 0 ELSE 1 END,contype,nspname,relname,conname;
  `);

  const createStatements = await knex.schema.raw(
    `
  SELECT 'ALTER TABLE "'||nspname||'"."'||relname||'" ADD CONSTRAINT "'||conname||'" '||
     pg_get_constraintdef(pg_constraint.oid)||';' AS statement
   FROM pg_constraint
   INNER JOIN pg_class ON conrelid=pg_class.oid
   INNER JOIN pg_namespace ON pg_namespace.oid=pg_class.relnamespace
   ORDER BY CASE WHEN contype='f' THEN 0 ELSE 1 END DESC,contype DESC,nspname DESC,relname DESC,conname DESC;

  `,
  );

  const typeAlteringStatements = await knex.schema.raw(
    `
  SELECT
  'ALTER TABLE "' || table_schema || '"."' || table_name || '" ALTER COLUMN "' || column_name || '" TYPE uuid USING "'
  || column_name || '"::uuid;' AS statement
  FROM information_schema.columns
  WHERE table_schema = 'public' AND data_type = 'character varying'
        AND column_name = 'id' OR
        column_name LIKE '%Id' AND
        NOT column_name IN ('athenaPatientId', 'departmentId', 'athenaProviderId')
  `,
  );

  // Drop constraints
  for (let dropStatement of dropStatements.rows) {
    await knex.schema.raw(dropStatement.statement);
  }
  // Change varchar keys to UUID keys
  for (let typeAlteringStatement of typeAlteringStatements.rows) {
    await knex.schema.raw(typeAlteringStatement.statement);
  }
  // Recreate constraints
  for (let createStatement of createStatements.rows) {
    await knex.schema.raw(createStatement.statement);
  }
};

exports.down = async function(knex, Promise) {
  const dropStatements = await knex.schema.raw(`
  SELECT 'ALTER TABLE "'||nspname||'"."'||relname||'" DROP CONSTRAINT "'||conname||'";' AS statement
   FROM pg_constraint
   INNER JOIN pg_class ON conrelid=pg_class.oid
   INNER JOIN pg_namespace ON pg_namespace.oid=pg_class.relnamespace
   ORDER BY CASE WHEN contype='f' THEN 0 ELSE 1 END,contype,nspname,relname,conname;
  `);

  const createStatements = await knex.schema.raw(
    `
  SELECT 'ALTER TABLE "'||nspname||'"."'||relname||'" ADD CONSTRAINT "'||conname||'" '||
     pg_get_constraintdef(pg_constraint.oid)||';' AS statement
   FROM pg_constraint
   INNER JOIN pg_class ON conrelid=pg_class.oid
   INNER JOIN pg_namespace ON pg_namespace.oid=pg_class.relnamespace
   ORDER BY CASE WHEN contype='f' THEN 0 ELSE 1 END DESC,contype DESC,nspname DESC,relname DESC,conname DESC;

  `,
  );

  const typeAlteringStatements = await knex.schema.raw(
    `
  SELECT
  'ALTER TABLE "' || table_schema || '"."' || table_name || '" ALTER COLUMN "' || column_name || '" TYPE varchar(255) USING "'
  || column_name || '"::varchar;' AS statement
  FROM information_schema.columns
  WHERE table_schema = 'public' AND data_type = 'uuid'
        AND column_name = 'id' OR
        column_name LIKE '%Id' AND
        NOT column_name IN ('athenaPatientId', 'departmentId', 'athenaProviderId')
  `,
  );

  // Drop constraints
  for (let dropStatement of dropStatements.rows) {
    await knex.schema.raw(dropStatement.statement);
  }
  // Change UUID keys to varchar keys
  for (let typeAlteringStatement of typeAlteringStatements.rows) {
    await knex.schema.raw(typeAlteringStatement.statement);
  }
  // Recreate constraints
  for (let createStatement of createStatements.rows) {
    await knex.schema.raw(createStatement.statement);
  }
};
