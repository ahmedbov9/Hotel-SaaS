import { ENV } from "@/lib/constants/env";
import { ApiClientError } from "@/lib/api/errors";
import type { ApiClientOptions } from "@/lib/api/types";
import type { ApiResponse } from "@/types/common";
import { getAccessToken, getCurrentHotelId } from "@/lib/api/storage";

function buildHeaders(options: ApiClientOptions): Headers {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  const token = options.token ?? getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const hotelId = options.hotelId ?? getCurrentHotelId();
  if (hotelId) {
    headers.set("x-hotel-id", hotelId);
  }

  return headers;
}

export async function apiRequest<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const response = await fetch(`${ENV.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: buildHeaders(options),
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  const payload = isJson
    ? ((await response.json()) as ApiResponse<T>)
    : null;

  if (!response.ok) {
    const message =
      payload && "message" in payload
        ? payload.message
        : "Something went wrong";

    const details =
      payload && "details" in payload ? payload.details : undefined;

    throw new ApiClientError(message, response.status, details);
  }

  if (!payload || !("success" in payload) || payload.success !== true) {
    throw new ApiClientError("Invalid API response", 500);
  }

  return payload.data;
}

export const api = {
  get: <T>(path: string, options: Omit<ApiClientOptions, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options: Omit<ApiClientOptions, "method" | "body"> = {},
  ) => apiRequest<T>(path, { ...options, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options: Omit<ApiClientOptions, "method" | "body"> = {},
  ) => apiRequest<T>(path, { ...options, method: "PATCH", body }),

  put: <T>(
    path: string,
    body?: unknown,
    options: Omit<ApiClientOptions, "method" | "body"> = {},
  ) => apiRequest<T>(path, { ...options, method: "PUT", body }),

  delete: <T>(path: string, options: Omit<ApiClientOptions, "method" | "body"> = {}) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};