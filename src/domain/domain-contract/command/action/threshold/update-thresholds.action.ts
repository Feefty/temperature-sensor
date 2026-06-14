import { ICommand } from '@nestjs/cqrs';

export class UpdateThresholdsAction implements ICommand {
  constructor(
    public readonly coldMax: number,
    public readonly hotMin: number,
  ) {}
}
