export function safeServiceReturn(value: unknown) {
  return typeof value === "string" && /^\/services\/[\da-f]{24}$/i.test(value) ? value : undefined;
}

export function safeProfileReturn(value: unknown) {
  return value === "/dashboard/customer/profile-settings" || value === "/dashboard/vendor/profile-settings" ? value : undefined;
}
