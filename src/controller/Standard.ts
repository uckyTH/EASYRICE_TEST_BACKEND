import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Standard } from "../model/Standard.model";


const standardsFilePath = path.join(__dirname, "..", "mock", "standards.json");

const loadStandardsData = (): any[] => {
  try {
    const data = fs.readFileSync(standardsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Failed to read or parse the standards data");
  }
};

export const fetchStandard = async (req: Request, res: Response) => {
  try {
    const standards:Standard[] = loadStandardsData();

    res.status(200).json(standards);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const fetchStandardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const standards = loadStandardsData();
    const standard = standards.find(
      (standard: { id: string }) => standard.id === id
    );
    if (standard) {
      res.status(200).json(standard);
    } else {
      res.status(404).json({ message: "Standard not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
