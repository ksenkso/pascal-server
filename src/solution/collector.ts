import { type EventEmitter } from 'events';

export class Collector {
  private buffer = '';

  constructor(stream: EventEmitter) {
    stream.on('data', (chunk: string) => {
      this.buffer += chunk;
    });
  }

  getAll(): string {
    return this.buffer;
  }

  hasData(): boolean {
    return !!this.buffer;
  }

  clear(): void {
    this.buffer = '';
  }
}
