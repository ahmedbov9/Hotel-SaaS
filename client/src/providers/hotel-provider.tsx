"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
  setHotelId: (hotelId: string | null) => Promise<void>;
  refreshHotel: () => Promise<void>;
  clearHotel: () => void;
};

export const HotelContext = createContext<HotelContextValue | null>(null);

type HotelProviderProps = {
  children: React.ReactNode;
};

export function HotelProvider({ children }: HotelProviderProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [hotelId, setHotelIdState] = useState<string | null>(null);
  const [availableHotels, setAvailableHotels] = useState<AccessibleHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearHotel = useCallback(() => {
    removeCurrentHotelId();
    setHotel(null);
    setMembership(null);
    setHotelIdState(null);
    setAvailableHotels([]);
  }, []);

  const refreshHotel = useCallback(async () => {
    if (!isAuthenticated) {
      clearHotel();
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const myHotels = await getMyHotels();
      setAvailableHotels(myHotels);

      let storedHotelId = getCurrentHotelId();

      if (!storedHotelId && myHotels.length > 0) {
        storedHotelId = myHotels[0].hotel._id;
        setCurrentHotelId(storedHotelId);
      }

      if (!storedHotelId) {
        setHotel(null);
        setMembership(null);
        setHotelIdState(null);
        return;
      }

      setHotelIdState(storedHotelId);

      const current = await getCurrentHotel();
      setHotel(current.hotel);
      setMembership(current.membership);
    } catch {
      clearHotel();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, clearHotel]);

  useEffect(() => {
    if (isAuthLoading) return;
    void refreshHotel();
  }, [isAuthLoading, refreshHotel]);

  const setHotelId = useCallback(
    async (nextHotelId: string | null) => {
      if (!nextHotelId) {
        clearHotel();
        return;
      }

      setCurrentHotelId(nextHotelId);
      setHotelIdState(nextHotelId);
      await refreshHotel();
    },
    [clearHotel, refreshHotel],
  );

  const value = useMemo<HotelContextValue>(
    () => ({
      hotel,
      membership,
      hotelId,
      availableHotels,
      isLoading,
      setHotelId,
      refreshHotel,
      clearHotel,
    }),
    [hotel, membership, hotelId, availableHotels, isLoading, setHotelId, refreshHotel, clearHotel],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}