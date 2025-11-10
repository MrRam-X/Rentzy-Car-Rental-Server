import { Router } from "express";
import {
  getAllRentalStations,
  createRentalStations,
} from "../controllers/rentalStationController";

const router = Router();

router.get("/", getAllRentalStations);
router.post("/create", createRentalStations);

export default router;