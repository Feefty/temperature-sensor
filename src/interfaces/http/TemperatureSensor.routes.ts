import { Hono } from 'hono'
import type { GetTemperatureSensor } from '../../application/TemperatureSensor/GetTemperatureSensor.js'
import type { GetFifteenLastedTemperatureState } from '../../application/TemperatureSensor/GetFifteenLastedTemperatureState.js'

export const TemperatureSensorRoutes = (deps: {
  GetTemperatureSensor: GetTemperatureSensor
  GetFifteenLastedTemperatureState: GetFifteenLastedTemperatureState
}) => {
  const app = new Hono()

  app.get('/', async (c) => {
    const temperatureSensor = await deps.GetTemperatureSensor.execute()
    return c.json(temperatureSensor)
  })

  app.get('/last15', async (c) => {
    const temperatureStates = await deps.GetFifteenLastedTemperatureState.execute()
    return c.json(temperatureStates)
  })

  return app
}