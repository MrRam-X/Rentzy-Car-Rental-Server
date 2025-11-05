import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import path from "path";
import ServiceBooking, { IServiceBooking } from "../models/ServiceBooking";
import Car from "../models/Car";
import {
  getDifferenceInDays,
  getCarInfoBasedOnPayload,
  getDateString,
} from "../utils/commonUtils";

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
    const { carId, carType, carBrand, carModel, fromDate, toDate } = req.body;
    const carsDataList = await Car.find();
    // Find Cars based on carId || type, brand and model || provide random Car info
    const carInfo = getCarInfoBasedOnPayload(
      carId,
      carType,
      carBrand,
      carModel,
      carsDataList
    );

    if (!carInfo) {
      res.send({
        message: "No Cars Available at the moment",
      });
      return;
    } else {
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
        carId: carInfo._id,
        carType: carInfo.carType,
        carBrand: carInfo.brand,
        carModel: carInfo.model,
        carRentPerDay: carInfo.pricePerDay,
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
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while making the booking", error });
  }
};

// Verify Booking Payment
export const verifyServiceBookingPayment = async (
  req: Request,
  res: Response
) => {
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

// Generate PDF invoice for payment
export const getServiceBookingReceipt = async (req: Request, res: Response) => {
  const bookingOrder = await ServiceBooking.findOne({
    orderId: req.params.orderId,
  });
  if (!bookingOrder)
    return res.status(404).json({
      statusCode: 404,
      message: "Order not found",
    });

  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });

  // Register Unicode fonts
  doc.registerFont(
    "Regular",
    path.join(__dirname, "../assets/fonts/Roboto-Regular.ttf")
  );
  doc.registerFont(
    "SemiBold",
    path.join(__dirname, "../assets/fonts/Roboto-SemiBold.ttf")
  );

  // Set headers so browser downloads it
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${bookingOrder.orderId}.pdf`
  );

  // Pipe PDF to response
  doc.pipe(res);

  // Header
  doc
    .font("SemiBold")
    .fontSize(20)
    .fillColor("#444")
    .text("Rentzy - Car Rental", { align: "center" })
    .moveDown();
  doc
    .font("SemiBold")
    .fontSize(24)
    .fillColor("#3399cc")
    .text("Payment Receipt", { align: "center" })
    .moveDown();

  // Order details
  doc.font("Regular").fontSize(18).fillColor("black");
  doc.table({
    rowStyles: (i) => {
      return {
        border: false,
        backgroundColor: i % 2 === 0 ? "#ccc" : "#ddd",
      };
    },
    data: [
      ["Order ID", bookingOrder.orderId],
      ["Payment ID", bookingOrder.paymentId],
      ["Booking Date", getDateString(bookingOrder.createdAt)],
      ["Customer Name", bookingOrder.fullName],
      ["Customer Email", bookingOrder.email],
      ["Car Pickup Date", bookingOrder.fromDate],
      ["Car Return Date", bookingOrder.toDate],
      ["Days Booked For", bookingOrder.numberOfDaysForRent.toString()],
      [
        "Rent Per Day",
        `${bookingOrder.priceCurrency}${bookingOrder.carRentPerDay}.00`,
      ],
      ["Car Booked", `${bookingOrder.carBrand} ${bookingOrder.carModel}`],
      ["Purpose (Service Type)", bookingOrder.serviceType],
      ["Total Paid", `${bookingOrder.priceCurrency}${bookingOrder.amount}.00`],
    ],
  });
  doc.moveDown();
  doc.moveDown();

  // Footer
  doc
    .fontSize(16)
    .fillColor("gray")
    .text("Thank you for your payment!", { align: "center" });

  // Get page dimensions
  const pageHeight = doc.page.height;
  const pageWidth = doc.page.width;
  const bottomY = pageHeight - 70; // 50px above bottom margin

  // Left side: contact info
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("gray")
    .text("Contact: support@example.com | +91-9876543210", 50, bottomY, {
      align: "left",
    });

  // Right side: current date/time
  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("gray")
    .text(now, -50, bottomY, {
      align: "right",
      width: pageWidth - 20, // ensures right alignment
    });

  // Finalize PDF
  doc.end();
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
