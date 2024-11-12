import { StandardData } from "./Standard.model";


declare type inspectionData = {
  name: string;
  standardName: string;
  standardID: string;
  standardData: StandardData[];
  rawData: File
};
