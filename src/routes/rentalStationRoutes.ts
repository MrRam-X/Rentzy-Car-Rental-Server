import { Router } from "express";
import {
  getAllRentalStations,
  createCarService,
} from "../controllers/rentalStationController";

const router = Router();

router.get("/", getAllRentalStations);
router.post("/create", createCarService);

export default router;