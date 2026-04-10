import { prisma } from "./infrastructure/database/PrismaClient";
import { createApp } from "./infrastructure/http/app";
import { router } from "./infrastructure/http/routes";

const PORT = process.env.PORT || 3000;
const app = createApp(router);

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const shutdown = () => {
    server.close(() => {
        prisma.$disconnect();
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);