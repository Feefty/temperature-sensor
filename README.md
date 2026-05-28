🌡️ Temperature Sensor API

Une API Node.js en TypeScript basée sur une architecture hexagonale pour simuler un système de capteur de température avec historique et seuils dynamiques.

🚀 Fonctionnalités
📊 Capture de température aléatoire
🧠 Détermination de l’état :
COLD
WARM
HOT
📚 Historique des températures (15 dernières)
⚙️ Seuils dynamiques modifiables via API
🧱 Architecture hexagonale (clean architecture)
📦 Installation
npm install
▶️ Lancer le projet
npm run dev

Serveur disponible sur :

http://localhost:3000
📡 API Endpoints
🌡️ Capturer une température
GET /temperature/capture
Réponse
{
  "value": 23,
  "state": "WARM",
  "timestamp": "2026-05-28T12:00:00.000Z"
}
📚 Historique des températures
GET /temperature/history
Réponse
[
  {
    "value": 30,
    "state": "HOT",
    "timestamp": "..."
  }
]
⚙️ Mettre à jour les seuils
PUT /temperature/thresholds
Body JSON
{
  "coldMax": 18,
  "hotMin": 30
}
Réponse
204 No Content
🧠 Logique métier

Les seuils définissent l’état :

value < coldMax → COLD
value >= hotMin → HOT
sinon → WARM
🧪 Tests
npm test
🏗️ Architecture
src/
├── domain/         # Entities + ports + services
├── application/    # Use cases
├── infrastructure/ # Express + repositories
└── main.ts         # Bootstrap
🧩 Exemple d’utilisation
# 1. Capturer une valeur
curl http://localhost:3000/temperature/capture

# 2. Voir l’historique
curl http://localhost:3000/temperature/history

# 3. Modifier les seuils
curl -X PUT http://localhost:3000/temperature/thresholds \
  -H "Content-Type: application/json" \
  -d '{"coldMax":18,"hotMin":30}'