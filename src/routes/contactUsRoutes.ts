import { Router } from "express";
import {
    getAllGetInTouch,
createGetInTouchData,
} from "../controllers/contactUsController";

const router = Router();

router.get("/get-in-touch", getAllGetInTouch);
router.post("/get-in-touch/send", createGetInTouchData);

export default router;