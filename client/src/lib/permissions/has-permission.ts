export function hasPermission(
  permissions: string[] | undefined,
  requiredPermission: string,
): boolean {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(requiredPermission);
}