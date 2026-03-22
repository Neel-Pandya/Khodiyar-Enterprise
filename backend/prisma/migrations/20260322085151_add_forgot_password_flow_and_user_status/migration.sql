-- AlterTable
ALTER TABLE "password_resets" ADD COLUMN     "is_otp_verified" BOOLEAN NOT NULL DEFAULT false;
