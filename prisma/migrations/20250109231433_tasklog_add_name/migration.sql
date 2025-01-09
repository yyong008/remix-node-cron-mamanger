/*
  Warnings:

  - Added the required column `name` to the `TaskLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskLog" ADD COLUMN     "name" TEXT NOT NULL;
