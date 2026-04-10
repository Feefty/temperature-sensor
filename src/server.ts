import { prisma } from "./infrastructure/database/PrismaClient";
import app from "./infrastructure/http/app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        prisma.$disconnect();
        process.exit(0);
    });
});