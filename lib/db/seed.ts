import { sql } from "drizzle-orm";

export async function seed(db: any) {
  // Seed businesses
  const businesses = await db.query.businesses.findMany().limit(1);
  if (businesses.length > 0) {
    console.log("Database already seeded");
    return;
  }

  // This is a migration helper, not actual seed data
  // Real seed data should be managed separately
}
