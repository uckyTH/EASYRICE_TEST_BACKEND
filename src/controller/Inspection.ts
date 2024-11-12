import { Request, Response } from "express";

export const calculateInspection = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "" });
    }
  }
};

export const fetchInspection = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "" });
    }
  }
};

export const fetchInspectionByid = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "" });
    }
  }
};

export const saveInspectionResult = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "" });
    }
  }
};
