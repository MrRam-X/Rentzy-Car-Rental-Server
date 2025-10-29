import { Router } from "express";
import {
  getAllServiceBookings,
  createServiceBooking,
  deleteServiceBooking,
  verifyServiceBookingPayment,
} from "../controllers/serviceBookingController";

const router = Router();

router.get("/", getAllServiceBookings);
router.post("/create", createServiceBooking);
router.patch("/verify-payment", verifyServiceBookingPayment);
router.delete("/:id", deleteServiceBooking);

export default router;
