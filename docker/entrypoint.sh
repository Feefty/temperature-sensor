#!/bin/sh
set -e


echo "🔄 Syncing database schema..."
pnpm db:migrate

echo "🌱 Seeding database..."
pnpm db:seed

echo "🚀 Starting application..."
exec pnpm run dev
