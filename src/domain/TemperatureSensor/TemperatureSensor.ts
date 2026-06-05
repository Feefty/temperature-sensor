export class TemperatureSensor {
  constructor(
    public id: string,
    public value: number,
    public state: string,
    public created_at: Date | null
  ) {}
}