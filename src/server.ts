import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import carRoutes from "./routes/carRoutes";
import carServiceRoutes from "./routes/carServiceRoutes";
import serviceBookingRoutes from "./routes/serviceBookingRoutes"
import rentalStationRoutes from "./routes/rentalStationRoutes"
import { BASE_URL, ROUTES } from "./appConstant";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use(`${BASE_URL}/${ROUTES.CARS}`, carRoutes);
app.use(`${BASE_URL}/${ROUTES.SERVICES}`, carServiceRoutes);
app.use(`${BASE_URL}/${ROUTES.BOOKINGS}`, serviceBookingRoutes);
app.use(`${BASE_URL}/${ROUTES.RENTAL_STATIONS}`, rentalStationRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});