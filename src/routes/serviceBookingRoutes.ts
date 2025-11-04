import { Router } from "express";
import {
  getAllServiceBookings,
  createServiceBooking,
  deleteServiceBooking,
  verifyServiceBookingPayment,
  getServiceBookingReceipt,
} from "../controllers/serviceBookingController";

const router = Router();

router.get("/", getAllServiceBookings);
router.get("/payment-receipt/:orderId", getServiceBookingReceipt)
router.post("/create", createServiceBooking);
router.patch("/verify-payment", verifyServiceBookingPayment);
router.delete("/:id", deleteServiceBooking);

export default router;
