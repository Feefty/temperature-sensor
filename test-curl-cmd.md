# A simple file with curl cmd to test API endpoint 

## GET /api/health
```bash 
curl -s  http://localhost:3000/api/health | jq 
```
## GET /api/temperature
```bash
 curl -s http://localhost:3000/api/temperature | jq
```

## GET /api/temperature/history
```bash
 curl -s http://localhost:3000/api/temperature/history | jq
```

## GET /api/thresholds
```bash 
curl -s "http://localhost:3000/api/thresholds" | jq
```

## PUT  /api/thresholds
```bash
curl -X PUT "http://localhost:3000/api/thresholds" \
  -H "Content-Type: application/json" \
  -d '{"hotThreshold": 34, "coldThreshold": 12}' | jq
```
