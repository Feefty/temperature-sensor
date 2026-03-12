# Temperature Sensor API

API REST pour la lecture de température, la classification d'état (HOT/COLD/WARM) et la gestion des seuils.

## Stack

- **TypeScript** + **Express**
- **PostgreSQL** + **Prisma**
- **Jest** + **Supertest**
- **Zod** (validation) + **Swagger** (documentation)
- **Docker**

## Architecture

Architecture hexagonale organisée par couche :

```
src/
  domain/          → Entités, ports (interfaces), erreurs métier
  application/     → Use cases (orchestration)
  infrastructure/  → Adapters (sensor, repositories), HTTP (controllers, routes), config
```

Le domaine n'a aucune dépendance sur l'infrastructure. Les use cases dépendent uniquement des ports (interfaces). L'infrastructure implémente les ports.

## Prérequis

- Node.js >= 20
- Docker & Docker Compose

## Installation

```bash
# Cloner le repo
git clone <repo-url>
cd Harvest

# Installer les dépendances
npm install

# Démarrer PostgreSQL
docker compose up -d

# Lancer les migrations
npx prisma migrate dev

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.
La documentation Swagger est disponible sur `http://localhost:3000/api-docs`.

## Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/temperature` | Lire la température, classifier et sauvegarder |
| GET | `/temperature/history` | Historique des 15 dernières lectures |
| GET | `/temperature/thresholds` | Seuils actuels |
| PUT | `/temperature/thresholds` | Modifier les seuils |

## Tests

```bash
# Tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration

# Avec couverture
npm run test:coverage
```

## Docker (déploiement complet)

```bash
docker compose --profile full up --build
```

Cela démarre PostgreSQL + l'application sur le port 3000.
