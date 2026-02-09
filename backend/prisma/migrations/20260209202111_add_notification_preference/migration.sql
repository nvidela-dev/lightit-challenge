-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "notificationPreference" "NotificationChannel" NOT NULL DEFAULT 'EMAIL';
