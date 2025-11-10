import { Router } from "express";
import {
  getAllAutoRentals,
  createAutoRental,
} from "../controllers/autoRentalController";

const router = Router();

router.get("/", getAllAutoRentals);
router.post("/create", createAutoRental);

export default router;