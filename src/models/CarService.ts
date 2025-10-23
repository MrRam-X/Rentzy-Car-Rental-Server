import { Schema, model, HydratedDocument } from "mongoose";

export interface ICarService {
  serviceTitle: string;
  serviceDescription: string;
  serviceDetails: {
    title: string;
    description: string;
  }[];
  benefitPoints: string[];
  serviceConditions: {
    title: string;
    description: string;
  }[];
}

export type CarServiceDocument = HydratedDocument<ICarService>;

const carServiceSchema = new Schema<ICarService>(
  {
    serviceTitle: { type: String, required: true },
    serviceDescription: { type: String, required: true },
    serviceDetails: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    benefitPoints: { type: [String], default: [] },
    serviceConditions: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<ICarService>("CarService", carServiceSchema);
