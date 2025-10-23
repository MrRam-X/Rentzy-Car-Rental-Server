import { Router } from "express";
import {
  getAllCarServices,
  getCarServiceById,
  createCarService,
  updateCarService,
  deleteCarService,
} from "../controllers/carServiceController";

const router = Router();

router.get("/", getAllCarServices);
router.get("/:id", getCarServiceById);
router.post("/", createCarService);         // single or multiple
router.patch("/:id", updateCarService);
router.delete("/:id", deleteCarService);    // single (via param)
router.delete("/", deleteCarService);       // multiple (via body.ids)

export default router;