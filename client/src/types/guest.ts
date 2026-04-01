export type Guest = {
  _id: string;
  hotelId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  idType: string | null;
  idNumber: string | null;
  dateOfBirth: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateGuestPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  notes?: string;
  tags?: string[];
};