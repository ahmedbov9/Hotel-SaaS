"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCurrentHotel, getMyHotels } from "@/features/hotels/api";
import {
  getCurrentHotelId,
  removeCurrentHotelId,
  setCurrentHotelId,
} from "@/lib/api/storage";
import { useAuth } from "@/hooks/use-auth";
import type { Hotel, Membership } from "@/types/hotel";
import type { AccessibleHotel } from "@/types/hotel-access";

type HotelContextValue = {
  hotel: Hotel | null;
  membership: Membership | null;
  hotelId: string | null;
  availableHotels: AccessibleHotel[];
  isLoading: boolean;
  isBootstrapped: boolean;
  setHotelId: (hotelId: string | null) => Promise<void>;
  refreshHotel: () => Promise<void>;
  clearHotel: () => void;
};

export const HotelContext = createContext<HotelContextValue | null>(null);

type HotelProviderProps = {
  children: ReactNode;
};

export function HotelProvider({ children }: HotelProviderProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [hotelId, setHotelIdState] = useState<string | null>(null);
  const [availableHotels, setAvailableHotels] = useState<AccessibleHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const activeRequestIdRef = useRef(0);

  const clearHotel = useCallback(() => {
    removeCurrentHotelId();
    setHotel(null);
    setMembership(null);
    setHotelIdState(null);
    setAvailableHotels([]);
    setIsBootstrapped(true);
  }, []);

  const loadCurrentHotel = useCallback(async (requestId: number) => {
    const current = await getCurrentHotel();

    if (requestId !== activeRequestIdRef.current) return false;

    setHotel(current.hotel);
    setMembership(current.membership);
    return true;
  }, []);

  const refreshHotel = useCallback(async () => {
    if (isAuthLoading) return;

    const requestId = ++activeRequestIdRef.current;

    if (!isAuthenticated) {
      clearHotel();
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const myHotels = await getMyHotels();

      if (requestId !== activeRequestIdRef.current) return;

      setAvailableHotels(myHotels);

      let storedHotelId = getCurrentHotelId();

      const hotelExists = storedHotelId
        ? myHotels.some((item) => item.hotel._id === storedHotelId)
        : false;

      if (!hotelExists) {
        storedHotelId = myHotels[0]?.hotel._id ?? null;

        if (storedHotelId) {
          setCurrentHotelId(storedHotelId);
        }
      }

      if (!storedHotelId) {
        setHotel(null);
        setMembership(null);
        setHotelIdState(null);
        setIsBootstrapped(true);
        return;
      }

      setHotelIdState(storedHotelId);

      const applied = await loadCurrentHotel(requestId);
      if (!applied) return;

      setIsBootstrapped(true);
    } catch (error) {
      if (requestId !== activeRequestIdRef.current) return;
      console.error("Failed to refresh hotel context:", error);
      setHotel(null);
      setMembership(null);
      setHotelIdState(null);
      setIsBootstrapped(true);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, isAuthLoading, clearHotel, loadCurrentHotel]);

  useEffect(() => {
    void refreshHotel();
  }, [refreshHotel]);

  const setHotelId = useCallback(async (nextHotelId: string | null) => {
    if (!nextHotelId) {
      removeCurrentHotelId();
      setHotel(null);
      setMembership(null);
      setHotelIdState(null);
      return;
    }

    const requestId = ++activeRequestIdRef.current;
    const previousHotelId = hotelId;

    try {
      setIsLoading(true);

      setCurrentHotelId(nextHotelId);
      setHotelIdState(nextHotelId);

      const applied = await loadCurrentHotel(requestId);
      if (!applied) return;
    } catch (error) {
      console.error("Failed to switch hotel:", error);

      if (previousHotelId) {
        setCurrentHotelId(previousHotelId);
        setHotelIdState(previousHotelId);
      } else {
        removeCurrentHotelId();
        setHotelIdState(null);
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [hotelId, loadCurrentHotel]);

  const value = useMemo<HotelContextValue>(
    () => ({
      hotel,
      membership,
      hotelId,
      availableHotels,
      isLoading,
      isBootstrapped,
      setHotelId,
      refreshHotel,
      clearHotel,
    }),
    [
      hotel,
      membership,
      hotelId,
      availableHotels,
      isLoading,
      isBootstrapped,
      setHotelId,
      refreshHotel,
      clearHotel,
    ],
  );

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  );
}