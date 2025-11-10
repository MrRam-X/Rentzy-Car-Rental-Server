import { Schema, model, HydratedDocument } from "mongoose";

export interface IAutoRental {
  email: String;
  pickupDate: String;
  dropoffDate: String;
  carType: String;
  locationId: String;
  locationAddress: String;
  locationAbbreviation: String;
  createdAt: Date;
}

export type AutoRentalDocument = HydratedDocument<IAutoRental>;

const autoRentalSchema = new Schema<IAutoRental>(
  {
    email: { type: String, required: true },
    pickupDate: { type: String, required: true },
    dropoffDate: { type: String, required: true },
    carType: { type: String, required: true },
    locationId: { type: String, required: true },
    locationAddress: { type: String, required: true },
    locationAbbreviation: { type: String, required: true },
    createdAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export default model<IAutoRental>("AutoRental", autoRentalSchema);
