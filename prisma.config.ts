
import 'dotenv/config';
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "db/prisma.schema",
    migrations: {
        path: "db/migrations",
        seed: process.env.NODE_ENV === "production" ? "node dist/db/seed.js" : "tsx db/seed.ts",
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});