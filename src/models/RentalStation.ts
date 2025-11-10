import { Schema, model, HydratedDocument } from "mongoose";

export interface IRentalStation {
  locationAddress: String;
  locationAbbreviation: String;
  createdAt: Date;
}

export type RentalStationDocument = HydratedDocument<IRentalStation>;

const rentalStationSchema = new Schema<IRentalStation>(
  {
    locationAddress: { type: String, required: true },
    locationAbbreviation: { type: String, required: true },
    createdAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export default model<IRentalStation>("RentalStation", rentalStationSchema);
