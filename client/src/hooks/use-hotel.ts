"use client";

import { HotelContext } from "@/providers/hotel-provider";
import { useContext } from "react";


export function useHotel() {
    const context = useContext(HotelContext);

    if (!context) {
        throw new Error("useHotel must be used within HotelProvider");
    }
    return context;
}