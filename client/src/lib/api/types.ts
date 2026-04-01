export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiClientOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  hotelId?: string | null;
  headers?: HeadersInit;
  cache?: RequestCache;
};
