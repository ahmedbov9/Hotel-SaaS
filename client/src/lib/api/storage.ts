const ACCESS_TOKEN_KEY = "hotel_saas_access_token";
const CURRENT_HOTEL_ID_KEY = "hotel_saas_current_hotel_id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getCurrentHotelId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(CURRENT_HOTEL_ID_KEY);
}

export function setCurrentHotelId(hotelId: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CURRENT_HOTEL_ID_KEY, hotelId);
}

export function removeCurrentHotelId(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CURRENT_HOTEL_ID_KEY);
}

export function clearSessionStorage(): void {
  removeAccessToken();
  removeCurrentHotelId();
}