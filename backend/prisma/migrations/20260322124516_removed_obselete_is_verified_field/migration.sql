/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'suspended';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_verified",
ALTER COLUMN "status" SET DEFAULT 'inactive';
