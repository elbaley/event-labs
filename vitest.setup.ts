import { vi } from "vitest";

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, "hasPointerCapture", {
  configurable: true,
  value: vi.fn(() => false),
});

Object.defineProperty(window.HTMLElement.prototype, "releasePointerCapture", {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLElement.prototype, "setPointerCapture", {
  configurable: true,
  value: vi.fn(),
});
