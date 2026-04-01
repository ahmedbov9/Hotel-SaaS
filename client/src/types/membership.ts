export type MembershipUser = {
  _id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
};

export type MembershipInvitedBy = {
  _id: string;
  fullName: string;
  email: string;
};

export type Membership = {
  _id: string;
  hotelId: string;
  userId: MembershipUser;
  role: "owner" | "manager" | "receptionist" | "accountant";
  permissions: string[];
  isActive: boolean;
  invitedBy: MembershipInvitedBy | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMembershipPayload = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: "owner" | "manager" | "receptionist" | "accountant";
  permissions?: string[];
};

export type UpdateMembershipPayload = {
  role?: "owner" | "manager" | "receptionist" | "accountant";
  permissions?: string[];
  isActive?: boolean;
};