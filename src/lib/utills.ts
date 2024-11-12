import { Response } from "express";
import { CompositionData, DefectRiceData } from "../model/History.model";
import { StandardData } from "../model/Standard.model";

export interface Grain {
  length: number;
  weight: number;
  shape: string;
  type: string;
}
export async function ClassifyData(
  grains: Grain[],
  standardData: StandardData[]
): Promise<{
  compositionData: CompositionData[];
  defectRiceData: DefectRiceData[];
  total_sample: number;
}> {
  let compositionData: CompositionData[] = [];
  let defectRiceData: DefectRiceData[] = [
    { name: "yellow", actual: 0 },
    { name: "red", actual: 0 },
    { name: "damage", actual: 0 },
    { name: "paddy", actual: 0 },
    { name: "chalky", actual: 0 },
    { name: "glutinous", actual: 0 },
    { name: "total", actual: 0 },
  ];
  let totalWeight = 0;
  let totalSample = 0;
  grains.forEach((grain) => {
    totalWeight += grain.weight;
    totalSample++;

    standardData.forEach((standard: StandardData) => {
      const matchesMin = checkCondition(
        standard.conditionMin,
        grain.length,
        standard.minLength
      );
      const matchesMax = checkCondition(
        standard.conditionMax,
        grain.length,
        standard.maxLength
      );
      if (matchesMin && matchesMax && standard.shape.includes(grain.shape)) {
        let compositionCategory = compositionData.find(
          (c) => c.key === standard.key
        );
        if (!compositionCategory) {
          const lengthFormat =
            standard.maxLength === 99
              ? `>= ${standard.minLength}`
              : `${standard.minLength} - ${standard.maxLength}`;
          compositionCategory = {
            key: standard.key,
            name: standard.name,
            length: lengthFormat,
            actual: 0,
          };
          compositionData.push(compositionCategory);
        }
        compositionCategory.actual += grain.weight;
      }
    });
    if (grain.type !== "white") {
      const defectCategory = defectRiceData.find((d) => d.name === grain.type);
      if (defectCategory) {
        defectCategory.actual += grain.weight;
      }
    } else {
      const defectCategory = defectRiceData.find((d) => d.name === "total");
      if (defectCategory) {
        defectCategory.actual += grain.weight;
      }
    }
  });
  compositionData = compositionData.map((grain) => ({
    ...grain,
    actual: Number(((grain.actual / totalWeight) * 100).toFixed(2)),
  }));
  defectRiceData = defectRiceData.map((grain) => ({
    ...grain,
    actual: Number(((grain.actual / totalWeight) * 100).toFixed(2)),
  }));

  return { compositionData, defectRiceData, total_sample: totalSample };
}

function checkCondition(
  condition: string,
  value: number,
  threshold: number
): boolean {
  switch (condition) {
    case "GE":
      return value >= threshold;
    case "GT":
      return value > threshold;
    case "LE":
      return value <= threshold;
    case "LT":
      return value < threshold;
    default:
      return false;
  }
}

//handleError
export const handleError = (error: unknown, res: Response): void => {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
