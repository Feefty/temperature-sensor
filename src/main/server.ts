import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { PgTemperatureSensor } from '../infrastructure/postgres/PgTemperatureSensor.js'
import { PgThresholds } from '../infrastructure/postgres/PgThresholds.js'
import { GetTemperatureSensor } from '../application/TemperatureSensor/GetTemperatureSensor.js'
import { GetFifteenLastedTemperatureState } from '../application/TemperatureSensor/GetFifteenLastedTemperatureState.js'
import { GetThresholds } from '../application/TemperatureSensor/GetThresholds.js'
import { PostThresholds } from '../application/TemperatureSensor/PostThresholds.js'
import { TemperatureSensorRoutes } from '../interfaces/http/TemperatureSensor.routes.js'
import { ThresholdsRoutes } from '../interfaces/http/Thresholds.routes.js'
import { db } from '../../db.js'

const temperatureSensorRepo = new PgTemperatureSensor(db)
const thresholdsRepo = new PgThresholds(db)

const app = new Hono()

app.route('/getSensors', TemperatureSensorRoutes({
  GetTemperatureSensor: new GetTemperatureSensor(temperatureSensorRepo, thresholdsRepo),
  GetFifteenLastedTemperatureState: new GetFifteenLastedTemperatureState(temperatureSensorRepo),
}))

app.route('/thresholds', ThresholdsRoutes({
  GetThresholds: new GetThresholds(thresholdsRepo),
  PostThresholds: new PostThresholds(thresholdsRepo),
}))

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Server running')