import { Request, Response } from "express";
import CarService from "../models/CarService";

// GET All Car Services
export const getAllCarServices = async (req: Request, res: Response) => {
  try {
    const cars = await CarService.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Car Services", error });
  }
};

// GET One Car Service
export const getCarServiceById = async (req: Request, res: Response) => {
  try {
    const car = await CarService.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Service not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Car Service ", error });
  }
};

// POST one or multiple Car Service
export const createCarService = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const cars = Array.isArray(data) ? await CarService.insertMany(data) : await CarService.create(data);
    res.status(201).json(cars);
  } catch (error) {
    res.status(400).json({ message: "Error creating Car Service(s)", error });
  }
};

// PATCH update Car Service
export const updateCarService = async (req: Request, res: Response) => {
  try {
    const car = await CarService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: "Car Service not found" });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: "Error updating Car Service", error });
  }
};

// DELETE one or multiple cars
export const deleteCarService = async (req: Request, res: Response) => {
  try {
    const ids = req.body?.ids || [req.params?.id];
    const result = await CarService.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Car Service(s) deleted", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(400).json({ message: "Error deleting Car Service(s)", error });
  }
};