import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import ServiceBooking, { IServiceBooking } from "../models/ServiceBooking";
import Car from "../models/Car";
import { getDifferenceInDays } from "../utils/commonUtils";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Get all bookings
export const getAllServiceBookings = async (req: Request, res: Response) => {
  try {
    const serviceBookings = await ServiceBooking.find();
    res.json(serviceBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service bookings", error });
  }
};

// Create a booking
export const createServiceBooking = async (
  req: Request<IServiceBooking>,
  res: Response
) => {
  try {
    //STEP 1: Calculate the total amount from the car object rent price/day
    const { carId, fromDate, toDate } = req.body;
    const carInfo = await Car.findById(carId);
    const pricePerDay = carInfo?.pricePerDay || 1000;
    const priceCurrency = carInfo?.priceCurrency || "";
    const numberOfDaysForRent = getDifferenceInDays(fromDate, toDate);
    const amount = numberOfDaysForRent * pricePerDay * 100; // amount in paise
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // STEP 2: Create the razorpay order
    const order = await razorpay.orders.create(options);

    // STEP 3: Save the order in database
    const data = req.body;
    const serviceBooking = await ServiceBooking.create({
      ...data,
      orderId: order.id, // Razorpay order id
      bookingInProgress: true,
      bookingConfirmed: false,
      priceCurrency,
      currency: options.currency,
      amount: amount / 100, // Convert amount in rupees
      numberOfDaysForRent,
      status: "Created",
    });
    res.status(201).json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      success: true,
      statusCode: 201,
      message: `Booking successful. Your booking id is: ${serviceBooking._id}`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error occurred while making the booking", error });
  }
};

// Verify Booking Payment
export const verifyServiceBookingPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update booking order in db
      await ServiceBooking.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          bookingInProgress: false,
          bookingConfirmed: true,
          status: "Paid",
        }
      );
      res.json({
        statusCode: 200,
        success: true,
        message: "Payment Completed. Your Booking has been confirmed.",
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unexpected Error occured", error });
  }
};

// Delete a booking
export const deleteServiceBooking = async (req: Request, res: Response) => {
  try {
    const id = req.params?.id;
    const result = await ServiceBooking.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Booking with id: ${id} has been cancelled`,
      deleted: result.acknowledged,
    });
  } catch (error) {
    res.status(400).json({ message: "Error cancelling the booking", error });
  }
};
