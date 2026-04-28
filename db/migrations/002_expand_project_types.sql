-- Расширяет допустимые типы проектов:
-- industrial, warehouse, cottage, design, other
-- Применение: psql "$DATABASE_URL" -f db/migrations/002_expand_project_types.sql

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT c.conname
  INTO constraint_name
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE t.relname = 'projects'
    AND n.nspname = current_schema()
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) LIKE '%CHECK ((type = ANY%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE projects DROP CONSTRAINT %I', constraint_name);
  END IF;

  ALTER TABLE projects
    ADD CONSTRAINT projects_type_check
    CHECK (
      type IN (
        'industrial',
        'warehouse',
        'cottage',
        'design',
        'other'
      )
    );
END $$;
