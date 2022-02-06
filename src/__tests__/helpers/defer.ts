export function defer(callback: () => void, ms = 0): void {
  global.setTimeout(() => callback(), ms);
}
