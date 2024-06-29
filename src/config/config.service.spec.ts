import { ConfigService } from './config.service'

describe('ConfigService', () => {
    let configService: ConfigService

    beforeEach(() => {
        configService = new ConfigService()
    })

    it('should return default hot threshold', () => {
        expect(configService.getHotThreshold()).toBe(35)
    })

    it('should return default cold threshold', () => {
        expect(configService.getColdThreshold()).toBe(22)
    })

    it('should set new hot threshold', () => {
        configService.setHotThreshold(40)
        expect(configService.getHotThreshold()).toBe(40)
    })

    it('should set new cold threshold', () => {
        configService.setColdThreshold(18)
        expect(configService.getColdThreshold()).toBe(18)
    })
})
