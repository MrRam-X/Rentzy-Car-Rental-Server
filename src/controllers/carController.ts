import { Request, Response } from "express";
import Car, { ICar } from "../models/Car";

// GET all cars
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

// GET one car
export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car", error });
  }
};

// POST one or multiple cars
export const createCar = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const cars = Array.isArray(data) ? await Car.insertMany(data) : await Car.create(data);
    res.status(201).json(cars);
  } catch (error) {
    res.status(400).json({ message: "Error creating car(s)", error });
  }
};

// PATCH update car
export const updateCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: "Error updating car", error });
  }
};

// DELETE one or multiple cars
export const deleteCar = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids || [req.params.id];
    const result = await Car.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Car(s) deleted", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(400).json({ message: "Error deleting car(s)", error });
  }
};