/**
 * Base class for errors raised by the domain when a business rule is violated.
 * Infrastructure (e.g. the HTTP layer) maps these to transport-specific codes;
 * the domain itself stays unaware of any transport.
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
