export function safeServiceReturn(value: unknown) {
  return typeof value === "string" && /^\/services\/[\da-f]{24}$/i.test(value) ? value : undefined;
}
