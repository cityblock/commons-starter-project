/**
 * Mock local storage for tests using auth token
 */
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key];
  }

  removeItem(key) {
    this.store[key] = null;
    return this.store;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }
}

global.localStorage = new LocalStorageMock();

/**
 * jsdom doesn't implement matchMedia, so just mock it here
 */

global.window = (typeof window === 'object') ? window : {};
window.matchMedia = jest.fn().mockImplementation(() => true);
