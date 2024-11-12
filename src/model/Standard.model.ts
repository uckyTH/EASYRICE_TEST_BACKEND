//Standard.model

export type StandardData ={
  key: string;
  minLength: number;
  maxLength: number;
  shape: string[];
  name: string;
  conditionMin: "GE" | "LE" | "GT" | "LT";
  conditionMax: "GE" | "LE" | "GT" | "LT";
}

export type Standard ={
  id: string;
  name: string;
  createDate: string;
  standardData: StandardData[];
}
