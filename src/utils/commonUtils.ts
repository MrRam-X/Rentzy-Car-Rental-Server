import { Types } from "mongoose";
import { ICar } from "../models/Car";
import { IServiceBooking } from "../models/ServiceBooking";

export type CarsListObject = ICar & {
  _id: Types.ObjectId;
};

export const getDifferenceInDays = (date1: string, date2: string) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();

  const diffDays = (d2 - d1) / (1000 * 60 * 60 * 24);

  return diffDays;
};

export const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

export const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0‑based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const generatePaymentReceiptTemplate = (
  bookingOrder: IServiceBooking
) => {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Payment Receipt</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #3399cc;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-weight: 800;
          }
          .app-platform-title {
            font-size: 20px;
          }
          .color-brand-gold {
            color: #f5b754;
          }
          .title {
            font-size: 24px;
            margin-top: 10px;
            color: #3399cc;
          }
          .details {
            margin-bottom: 20px;
          }
          .details table {
            width: 100%;
            border-collapse: collapse;
          }
          .details th, .details td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          .total {
            text-align: right;
            font-size: 18px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="app-platform-title"><span class="color-brand-gold">Rent</span>zy - <span class="color-brand-gold">Car</span> Rental</p>
          <div class="title">Payment Receipt</div>
        </div>

        <div class="details">
          <table>
            <tr>
              <th>Order ID</th>
              <td>${bookingOrder.orderId}</td>
            </tr>
            <tr>
              <th>Payment ID</th>
              <td>${bookingOrder.paymentId}</td>
            </tr>
            <tr>
              <th>Booking Date</th>
              <td>${getDateString(bookingOrder.createdAt)}</td>
            </tr>
            <tr>
              <th>Customer Name</th>
              <td>${bookingOrder.fullName}</td>
            </tr>
            <tr>
              <th>Customer Email</th>
              <td>${bookingOrder.email}</td>
            </tr>
            <tr>
              <th>Car Pickup Date</th>
              <td>${bookingOrder.fromDate}</td>
            </tr>
            <tr>
              <th>Car Return Date</th>
              <td>${bookingOrder.toDate}</td>
            </tr>
            <tr>
              <th>Days Booked For</th>
              <td>${bookingOrder.numberOfDaysForRent}</td>
            </tr>
            <tr>
              <th>Rent Per Day</th>
              <td>${bookingOrder.priceCurrency}${
                bookingOrder.carRentPerDay
              }</td>
            </tr>
            <tr>
              <th>Car Booked</th>
              <td>${bookingOrder.carBrand} ${bookingOrder.carModel}</td>
            </tr>
            <tr>
              <th>Purpose (Service Type)</th>
              <td>${bookingOrder.serviceType}</td>
            </tr>
          </table>
        </div>

        <div class="total">
          <strong>Total Paid: ${bookingOrder.priceCurrency}${
            bookingOrder.amount
          }</strong>
        </div>

        <div class="footer">
          Thank you for your payment!<br />
          For support, contact support@rentzy.com
        </div>
      </body>
    </html>
  `;
};

export const getCarInfoBasedOnPayload = (
  carId: string,
  carType: string,
  carBrand: string,
  carModel: string,
  carsDataList: CarsListObject[]
) => {
  const filteredCarList = carId
    ? carsDataList.filter((carItem) => carItem._id.toString() === carId)
    : carsDataList.filter(
        (carItem) =>
          (!carType || carItem.carType === carType) &&
          (!carBrand || carItem.brand === carBrand) &&
          (!carModel || carItem.model === carModel)
      );

  const filteredCarInfo =
    filteredCarList.length > 0
      ? filteredCarList[0]
      : getRandomElement(carsDataList);

  return filteredCarInfo;
};
