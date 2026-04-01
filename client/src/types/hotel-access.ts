export type AccessibleHotel = {
  hotel: {
    _id: string;
    name: string;
    slug: string;
    city?: string | null;
    country?: string | null;
    status?: string;
  };
  membership: {
    _id: string;
    role: string;
    permissions: string[];
    isActive: boolean;
  };
};