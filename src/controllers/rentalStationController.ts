import { Request, Response } from "express";
import RentalStation from "../models/RentalStation";

// GET all Rental Stations
export const getAllRentalStations = async (req: Request, res: Response) => {
  try {
    const rentalStations = await RentalStation.find();
    res.json(rentalStations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Rental Stations", error });
  }
};

// POST one or multiple Rental Stations
export const createCarService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const rentalStations = Array.isArray(data)
      ? await RentalStation.insertMany(data)
      : await RentalStation.create(data);
    res.status(201).json(rentalStations);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating Rental Station(s)", error });
  }
};
