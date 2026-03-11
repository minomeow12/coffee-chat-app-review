type Handler = (payload: any) => void;

export function createFakeSocket() {
  const handlers: Record<string, Handler[]> = {};

  return {
    on: jest.fn((event: string, cb: Handler) => {
      handlers[event] = handlers[event] || [];
      handlers[event].push(cb);
    }),
    off: jest.fn((event: string, cb?: Handler) => {
      if (!handlers[event]) return;
      handlers[event] = cb ? handlers[event].filter((h) => h !== cb) : [];
    }),
    emit: jest.fn(),
    trigger(event: string, payload: any) {
      (handlers[event] || []).forEach((cb) => cb(payload));
    },
  };
}
