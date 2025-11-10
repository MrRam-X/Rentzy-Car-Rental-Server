import { Request, Response } from "express";
import mongoose from "mongoose";
import AutoRental from "../models/AutoRental";
import RentalStation from "../models/RentalStation";
import { AutoRentalPayload } from "../types/AutoRentalType";

// GET all Auto Rental Data
export const getAllAutoRentals = async (req: Request, res: Response) => {
  try {
    const autoRentalData = await AutoRental.find();
    res.json(autoRentalData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Auto Rental Orders", error });
  }
};

// POST an Auto Rental
export const createAutoRental = async (
  req: Request<AutoRentalPayload>,
  res: Response
) => {
  try {
    const { email, pickupDate, dropoffDate, carType, pickupLocation } =
      req.body;
    if (!mongoose.Types.ObjectId.isValid(pickupLocation)) {
      return res.status(404).json({
        statusCode: 404,
        message: `Invalid location id format: ${pickupLocation}`,
      });
    }

    const locationData = await RentalStation.findById(pickupLocation || "");

    if (!locationData) {
      return res.status(404).json({
        statusCode: 404,
        message: `No location found by id: ${pickupLocation}`,
      });
    } else {
      const autoRentalObj = {
        email,
        pickupDate,
        dropoffDate,
        carType,
        locationId: locationData._id,
        locationAddress: locationData.locationAddress,
        locationAbbreviation: locationData.locationAbbreviation,
      };
      const autoRentalData = await AutoRental.create(autoRentalObj);
      if (autoRentalData)
        res.status(201).json({
          statusCode: 201,
          message: "Auto Rental Booking successful",
          data: autoRentalData,
        });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating Auto Rental Order", error });
  }
};
