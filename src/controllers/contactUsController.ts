import { Request, Response } from "express";
import GetInTouch from "../models/GetInTouch";
import { GetInTouchPayload } from "../types/ContactUsType";

// GET all message sent data
export const getAllGetInTouch = async (req: Request, res: Response) => {
  try {
    const contactedData = await GetInTouch.find();
    res.json(contactedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contacted data list", error });
  }
};

// POST a get in touch message
export const createGetInTouchData = async (
  req: Request<GetInTouchPayload>,
  res: Response
) => {
  try {
    const { email, fullName, contactNumber, subject, message } = req.body;
    if (
      !email.trim() ||
      !fullName.trim() ||
      !contactNumber.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      res.status(400).json({
        statusCode: 400,
        message:
          "Email, Full Name, Contact No., Subject and Message are required fields",
      });
      return;
    }
    const getInTouchRes = await GetInTouch.create(req.body);
    if (getInTouchRes)
      res.status(201).json({
        statusCode: 201,
        message: "Sent Message Sucessfully",
        data: getInTouchRes,
      });
  } catch (error) {
    res.status(400).json({ message: "Error sending message", error });
  }
};
