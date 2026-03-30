const router = require("express").Router();
const validate = require("../../common/middlewares/validate.middleware");
const controller = require("./public.controller");
const {
  getPublicAvailabilitySchema,
  createPublicBookingSchema,
} = require("./public.validation");

router.get("/:slug", controller.getHotel);

router.get(
  "/:slug/availability",
  validate(getPublicAvailabilitySchema),
  controller.getAvailability
);

router.post(
  "/:slug/bookings",
  validate(createPublicBookingSchema),
  controller.createBooking
);

module.exports = router;