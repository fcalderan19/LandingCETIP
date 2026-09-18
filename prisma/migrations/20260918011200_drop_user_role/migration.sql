-- Only admins exist; drop the role column. Anyone in User + active=true is
-- an admin, and auto-created rows now default to active=false so a random
-- Google account cannot self-provision.
ALTER TABLE "User" DROP COLUMN IF EXISTS "role";
ALTER TABLE "User" ALTER COLUMN "active" SET DEFAULT false;
