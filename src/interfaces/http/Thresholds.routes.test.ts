import { ThresholdsRoutes } from './Thresholds.routes.js'

describe('Thresholds routes', () => {
  it('returns current thresholds from GET /', async () => {
    const getThresholds = { execute: jest.fn().mockResolvedValue({ cold: 18, hot: 30 }) }
    const postThresholds = { executeCold: jest.fn(), executeHot: jest.fn() }

    const app = ThresholdsRoutes({
      GetThresholds: getThresholds as any,
      PostThresholds: postThresholds as any,
    })

    const response = await app.request('http://localhost/')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ cold: 18, hot: 30 })
    expect(getThresholds.execute).toHaveBeenCalledTimes(1)
  })

  it('accepts a cold threshold update', async () => {
    const getThresholds = { execute: jest.fn() }
    const postThresholds = { executeCold: jest.fn().mockResolvedValue(undefined), executeHot: jest.fn() }

    const app = ThresholdsRoutes({
      GetThresholds: getThresholds as any,
      PostThresholds: postThresholds as any,
    })

    const response = await app.request('http://localhost/cold', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 16 }),
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(postThresholds.executeCold).toHaveBeenCalledWith(16)
  })

  it('rejects a non-numeric cold threshold value', async () => {
    const getThresholds = { execute: jest.fn() }
    const postThresholds = { executeCold: jest.fn(), executeHot: jest.fn() }

    const app = ThresholdsRoutes({
      GetThresholds: getThresholds as any,
      PostThresholds: postThresholds as any,
    })

    const response = await app.request('http://localhost/cold', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 'invalid' }),
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'value must be a number' })
    expect(postThresholds.executeCold).not.toHaveBeenCalled()
  })
})
