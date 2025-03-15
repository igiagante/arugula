import { sql } from "drizzle-orm";

export async function up(db: any) {
  // Add organizationId column to Indoor table
  await db.execute(
    sql`ALTER TABLE "Indoor" ADD COLUMN "organizationId" TEXT NOT NULL`
  );

  // Remove the default constraint after adding the column
  await db.execute(
    sql`ALTER TABLE "Indoor" ALTER COLUMN "organizationId" DROP DEFAULT`
  );
}

export async function down(db: any) {
  // Remove organizationId column from Indoor table
  await db.execute(sql`ALTER TABLE "Indoor" DROP COLUMN "organizationId"`);
}
