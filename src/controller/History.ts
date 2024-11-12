import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { ClassifyData, handleError } from "../lib/utills";
import HistoryModel from "../model/History.model";

const standardsFilePath = path.join(__dirname, "..", "mock", "standards.json");

const loadStandardsData = (): any[] => {
  try {
    const data = fs.readFileSync(standardsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Failed to read or parse the standards data");
  }
};

export const createInspection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, standardID, note, samplingDate, samplingPoint, price } =
      req.body;

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const standards = loadStandardsData();
    const standard = standards.find((standard) => standard.id === standardID);
    if (!standard) {
      res.status(404).json({ message: "Standard not found" });
      return;
    }
    const raws = JSON.parse(req.file.buffer.toString());
    if (!raws.grains || !Array.isArray(raws.grains)) {
      res.status(400).json({ message: "Invalid file format" });
      return;
    }
    const { compositionData, defectRiceData, total_sample } =
      await ClassifyData(raws.grains, standard.standardData);
    const formData = {
      name: name,
      note: note,
      standardName: standard.name,
      samplingDate: samplingDate,
      samplingPoint: samplingPoint,
      price: price,
      total_sample: total_sample,
      imageLink: raws.imageURL,
      standardID: standardID,
      standardData: standard.standardData,
      compositionData: compositionData,
      defectRiceData: defectRiceData,
    };
    const newInspection = new HistoryModel(formData);
    await newInspection.save();
    res.status(200).json({
      message: "Inspection created successfully",
      data: newInspection,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const fetchHistories = async (req: Request, res: Response) => {
  try {
    const inspections = await HistoryModel.find().select(
      "-standardData -compositionData -defectRiceData"
    );
    res.status(200).json(inspections);
  } catch (error) {
    handleError(error, res);
  }
};

export const fetchHistoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const inspections = await HistoryModel.find();

    const matchingInspections = inspections.filter((inspection) =>
      inspection.inspectionID.toString().includes(id)
    );
    if (matchingInspections.length === 0) {
      res
        .status(200)
        .json({ message: "No inspections found matching the criteria" });
      return;
    }

    res.status(200).json(matchingInspections);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { note, price, samplingDate, samplingPoint } = req.body;
    const updatedInspection = await HistoryModel.findOneAndUpdate(
      { _id: id },
      { note, samplingDate, samplingPoint, price },
      { new: true }
    );

    if (!updatedInspection) {
      res.status(404).json({ message: "Inspection not found" });
      return;
    }
    res.status(200).json({
      message: "Inspection updated successfully",
      data: updatedInspection,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;

    const result = await HistoryModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "No inspections found to delete" });
      return;
    }
    res.status(200).json({ message: "Inspections deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
