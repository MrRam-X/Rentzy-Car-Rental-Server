import { Schema, model, HydratedDocument } from "mongoose";

export interface IServiceBooking {
  fromDate: string;
  toDate: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceId: string;
  pickupLocation: string;
  carId: string;
  carType: string;
  carBrand: string;
  carModel: string;
  bookingInProgress: boolean;
  bookingConfirmed: boolean;
  orderId: string;
  paymentId: string;
  status: string;
  amount: number;
  numberOfDaysForRent: number;
  currency: string;
  priceCurrency: string;
}

export type ServiceBookingDocument = HydratedDocument<IServiceBooking>;

const serviceBookingSchema = new Schema<IServiceBooking>(
  {
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    serviceType: { type: String, required: true },
    serviceId: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    carId: { type: String, required: true },
    carType: { type: String, required: true },
    carBrand: { type: String, required: true },
    carModel: { type: String, required: true },
    bookingInProgress: { type: Boolean, required: false },
    bookingConfirmed: { type: Boolean, required: false },
    orderId: { type: String, required: false },
    paymentId: { type: String, required: false },
    status: { type: String, required: false },
    amount: { type: Number, required: false },
    numberOfDaysForRent: { type: Number, required: false },
    currency: { type: String, required: false },
    priceCurrency: { type: String, required: false },
  },
  { timestamps: true }
);

export default model<IServiceBooking>("ServiceBooking", serviceBookingSchema);
