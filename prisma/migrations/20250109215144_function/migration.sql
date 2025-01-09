/*
  Warnings:

  - Added the required column `function_name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "function_name" TEXT NOT NULL,
ADD COLUMN     "function_params" TEXT;
