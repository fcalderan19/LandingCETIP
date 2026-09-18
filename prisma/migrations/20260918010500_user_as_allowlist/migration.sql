-- Add new User columns first so subsequent statements can populate them.
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();

-- Promote every previously-allowlisted email to an active admin User so no
-- one who could log in today loses access after we drop AllowedEmail.
INSERT INTO "User" ("id", "email", "role", "active", "createdAt", "updatedAt")
SELECT
  'usr_' || substr(md5(random()::text || clock_timestamp()::text), 1, 24),
  lower(a."email"),
  'admin',
  true,
  now(),
  now()
FROM "AllowedEmail" a
ON CONFLICT ("email") DO NOTHING;

-- Any pre-existing User rows without a role should keep admin (they only
-- existed because they had already been allowlisted). New rows default to
-- "viewer" once we change the column default below.
UPDATE "User" SET "role" = 'admin' WHERE "role" IS NULL OR "role" = '';
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'viewer';

-- Normalize existing emails to lowercase so the allowlist check is consistent.
UPDATE "User" SET "email" = lower("email") WHERE "email" <> lower("email");

-- Drop the old allowlist table — User is now the single source of truth.
DROP TABLE IF EXISTS "AllowedEmail";
