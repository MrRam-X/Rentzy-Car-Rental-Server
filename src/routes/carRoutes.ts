import { Router } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController";

const router = Router();

router.get("/", getAllCars);
router.get("/:id", getCarById);
router.post("/", createCar);         // single or multiple
router.patch("/:id", updateCar);
router.delete("/:id", deleteCar);    // single (via param)
router.delete("/", deleteCar);       // multiple (via body.ids)

export default router;