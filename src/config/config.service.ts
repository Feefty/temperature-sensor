import { Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService {
    private hotThreshold: number = 35
    private coldThreshold: number = 22

    getHotThreshold(): number {
        return this.hotThreshold
    }

    getColdThreshold(): number {
        return this.coldThreshold
    }

    setHotThreshold(value: number): void {
        this.hotThreshold = value
    }

    setColdThreshold(value: number): void {
        this.coldThreshold = value
    }
}
