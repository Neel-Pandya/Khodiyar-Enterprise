-- AlterTable
ALTER TABLE "password_resets" ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "verifications" ALTER COLUMN "otp" SET DATA TYPE TEXT;
