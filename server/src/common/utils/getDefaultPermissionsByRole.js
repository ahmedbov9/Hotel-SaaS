function getDefaultPermissionsByRole(role) {
  switch (role) {
    case "owner":
      return ["*"];
    case "manager":
      return [
        "rooms.read",
        "rooms.create",
        "rooms.update",
        "guests.read",
        "guests.create",
        "guests.update",
        "bookings.read",
        "bookings.create",
        "bookings.update",
        "payments.read",
        "payments.create",
        "reports.read",
        "staff.read",
        "bookings.cancel",
        "bookings.checkin",
        "bookings.checkout",
      ];
    case "receptionist":
      return [
        "rooms.read",
        "guests.read",
        "guests.create",
        "guests.update",
        "bookings.read",
        "bookings.create",
        "bookings.update",
        "bookings.checkout",
        "bookings.cancel",
        "bookings.checkin",
        "payments.read",
        "payments.create",
        "reports.read",
      ];
    case "accountant":
      return [
        "bookings.read",
        "payments.read",
        "payments.create",
        "reports.read",
      ];
    default:
      return [];
  }
}

module.exports = {
  getDefaultPermissionsByRole,
};
