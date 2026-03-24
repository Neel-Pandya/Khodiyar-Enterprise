-- AlterTable
ALTER TABLE "users" ADD COLUMN "phone" VARCHAR(15);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
