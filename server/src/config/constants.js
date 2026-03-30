const PLATFORM_ROLES = {
  PLATFORM_OWNER: "platform_owner",
  PLATFORM_ADMIN: "platform_admin",
  HOTEL_OWNER: "hotel_owner",
  HOTEL_STAFF: "hotel_staff",
};

const HOTEL_MEMBERSHIP_ROLES = {
  OWNER: "owner",
  MANAGER: "manager",
  RECEPTIONIST: "receptionist",
  ACCOUNTANT: "accountant",
};

const HOTEL_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
};

const ROOM_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  MAINTENANCE: "maintenance",
  INACTIVE: "inactive",
}

const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};
const BOOKING_SOURCE = {
  DIRECT : "direct",
  ADMIN : "admin",
  OTA : "ota",
  WALK_IN : "walk_in",
}

const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  FAILED: "failed",
  REFUNDED: "refunded",
}

const PAYMENT_METHOD = {
  CASH : "cash",
  CARD : "card",
  BANK_TRANSFER : "bank_transfer",
  ONLINE : "online",
}

const PAYMENT_PROVIDER = {
  MANUAL : "manual",
  STRIPE : "stripe",
  PAYPAL : "paypal",
  MOYASAR : "moyasar",
}

const INVOICE_STATUS = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
  VOID: "void",
}

module.exports = {
  PLATFORM_ROLES,
  HOTEL_MEMBERSHIP_ROLES,
  HOTEL_STATUS,
  ROOM_STATUS,
  BOOKING_STATUS,
  BOOKING_SOURCE,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_PROVIDER,
  INVOICE_STATUS,
};