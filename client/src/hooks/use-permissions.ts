"use client";

import { useHotel } from "@/hooks/use-hotel";
import { hasPermission } from "@/lib/permissions/has-permission";

export function usePermissions() {
  const { membership } = useHotel();

  const permissions = membership?.permissions ?? [];
  function can(permission: string) {
    return hasPermission(permissions, permission);
  }

  return {
    permissions,
    can,
    role: membership?.role ?? null,
  };
}