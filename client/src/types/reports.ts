export type BookingListItem = {
  _id?: string;
  bookingNumber: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: string;
  guestSnapshot?: {
    fullName?: string;
  };
  roomSnapshot?: {
    roomNumber?: string;
    roomTypeName?: string;
  };
};

export type DashboardMetrics = {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  checkedInBookings: number;
  totalGuests: number;
  totalRooms: number;
  totalRoomTypes: number;
  totalRevenue: number;
};

export type DashboardLists = {
  upcomingBookings: BookingListItem[];
  todayCheckIns: BookingListItem[];
  todayCheckOuts: BookingListItem[];
};

export type DashboardSummary = {
  metrics: DashboardMetrics;
  lists: DashboardLists;
};