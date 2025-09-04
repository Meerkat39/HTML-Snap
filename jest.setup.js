// jest.setup.js
// jsdom環境でResizeObserverをモック化

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
