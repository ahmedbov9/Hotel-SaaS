const router = require("express").Router();


router.use('/public', require("../modules/public/public.routes"));

router.use('/auth', require("../modules/auth/auth.routes"));
router.use('/hotels', require("../modules/hotels/hotel.routes"));
router.use('/room-types', require("../modules/room-types/room-type.routes"));
router.use('/rooms', require("../modules/rooms/room.routes"));
router.use('/guests', require("../modules/guests/guest.routes"));
router.use('/bookings' , require('../modules/bookings/booking.routes'))
router.use('/inventory', require('../modules/inventory/inventory.routes'));
router.use('/payments', require('../modules/payments/payment.routes'));
router.use('/memberships', require('../modules/memberships/membership.routes'));
router.use('/invoices', require('../modules/invoices/invoice.routes'));
router.use('/reports', require('../modules/reports/report.routes'));

module.exports = router;

