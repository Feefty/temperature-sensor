```
# Temperature Sensor API

## Prérequis
- Node.js 20+
- pnpm
- Docker Desktop / Docker Engine

## 1. Démarrer la base de données avec Docker
```bash
docker compose up -d
```

La base PostgreSQL sera disponible sur `localhost:5432` avec les identifiants :
- utilisateur : `admin`
- mot de passe : `password`
- base : `appdb`

## 2. Exécuter les migrations
```bash
pnpm install
pnpm migrate
```

## 3. Lancer l'application
```bash
pnpm dev
```

L'API sera disponible sur :
```text
http://localhost:3000
```

## 4. Routes disponibles
- GET `/getSensors` : retourne une mesure courante et son état.
- GET `/getSensors/last15` : retourne les 15 dernières mesures.
- GET `/thresholds` : retourne les seuils froid et chaud.
- POST `/thresholds/cold` : définit le seuil froid.
- POST `/thresholds/hot` : définit le seuil chaud.

## 5. Tests Jest
```bash
pnpm test
```

Les tests couvrent les routes HTTP avec des mocks de dépendances, sans besoin de base de données réelle.

