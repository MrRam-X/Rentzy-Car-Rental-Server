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
