import { Schema, model, HydratedDocument } from "mongoose";

export interface IGetInTouch {
  fullName: String;
  email: String;
  contactNumber: String;
  subject: String;
  message: String;
  createdAt: Date;
}

export type AutoRentalDocument = HydratedDocument<IGetInTouch>;

const getInTouchSchema = new Schema<IGetInTouch>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, required: false },
  },
  { timestamps: true }
);

export default model<IGetInTouch>("GetInTouch", getInTouchSchema);
