import { Schema, model, HydratedDocument } from "mongoose";

export interface ICar {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  priceCurrency: string;
  carType: string; // Luxury | Sports | etc
  generalInformation: string;
  benefitPoints: string[];
  doors: number;
  passengers: number;
  transmission: string;
  luggage: number;
  airCondition: boolean;
  minAgeForDrive: number;
  primaryImageUri: string;
  imageGalleryUris: string[];
  rentalConditions: {
    title: string;
    description: string;
  }[]
  available: boolean;
}

export type CarDocument = HydratedDocument<ICar>;

const carSchema = new Schema<ICar>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    priceCurrency: { type: String, required: true },
    carType: { type: String, required: true },
    generalInformation: { type: String, required: true },
    benefitPoints: { type: [String], default: [] },
    doors: { type: Number, required: true },
    passengers: { type: Number, required: true },
    transmission: { type: String, required: true },
    luggage: { type: Number, required: true },
    airCondition: { type: Boolean, default: true },
    minAgeForDrive: { type: Number, required: true },
    primaryImageUri: { type: String, required: true },
    imageGalleryUris: { type: [String], default: [] },
    rentalConditions: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);


export default model<ICar>("Car", carSchema);