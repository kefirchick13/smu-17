-- Полная схема и начальные данные (проекты + админы).
-- Локально: psql "$DATABASE_URL" -f db/migrations/001_init.sql
-- Docker: скрипт подхватывается из /docker-entrypoint-initdb.d при первом старте
-- пустого тома. После смены схемы: docker compose down -v && docker compose up -d

-- --- Проекты ---
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  detail_text TEXT,
  type TEXT NOT NULL CHECK (type IN ('industrial', 'angar', 'warehouse', 'cottage', 'design', 'other')),
  status TEXT NOT NULL CHECK (status IN ('done', 'in_progress')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  area_m2 INTEGER,
  completed_text TEXT,
  image_src TEXT,
  -- image_src / gallery_src: абсолютные URL (https://…), не пути к public
  gallery_src TEXT[] DEFAULT ARRAY[]::TEXT[],
  client_name TEXT,
  address TEXT,
  work_date_start DATE,
  work_date_end DATE,
  work_stages TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- --- Администраторы ---
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email_lower ON admin_users (lower(trim(email)));

INSERT INTO admin_users (email, password_hash)
VALUES (
  'admin@smu17.local',
  '6077ed3d3b281037e923def4cb6b63ec:4ac1958be20c593ef3905ad822b59e7e17bb854f1f8bbf3e8dc805614cb4942940b8174517ec7a7d3fe69ffd5e7d1add543358b17af466c75ddc9fef95c18ee6'
)
ON CONFLICT (email) DO NOTHING;
