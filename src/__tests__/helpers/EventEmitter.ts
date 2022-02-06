export type EmitterListener<T = string> = (event: T, value: unknown) => void;

export class EventEmitter<T = string> {
  private readonly listeners: Map<T, Set<EmitterListener<T>>>;

  constructor() {
    this.listeners = new Map<T, Set<EmitterListener<T>>>();
  }

  emit(event: T, value?: unknown): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(event, value));
    }
  }

  on(event: T, listener: EmitterListener<T>) {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      this.listeners.set(event, new Set<EmitterListener<T>>([listener]));
    } else {
      listeners.add(listener);
    }
  }

  off(event: T, listener: EmitterListener<T>) {
    const listeners = this.listeners.get(event);
    if (listeners && listeners.has(listener)) {
      listeners.delete(listener);
    }
  }

  clear() {
    this.listeners.clear();
  }
}
