/**
 * Supplies the current time. Injected as a port so use cases stay deterministic
 * under test; infrastructure provides the real `() => new Date()`.
 */
export type Clock = () => Date;
