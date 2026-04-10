
import 'dotenv/config';
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "db/prisma.schema",
    migrations: {
        path: "db/migrations",
        seed: "tsx db/seed.ts",
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});