export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ThresholdsInvariantError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ThresholdsInvariantError';
  }
}
