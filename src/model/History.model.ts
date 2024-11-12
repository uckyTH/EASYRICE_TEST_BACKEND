//History.model.ts
import { StandardData } from "./Standard.model";
import mongoose, { Document, Schema } from "mongoose";

export type CompositionData = {
  key: string;
  name: string;
  length: string;
  actual: number;
};

export type DefectRiceData = {
  name: string;
  actual: number;
};

interface History extends Document {
  inspectionID: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  note: string;
  standardName: string;
  samplingDate: Date;
  samplingPoint: string[];
  price: number;
  total_sample: number;
  imageLink: string;
  standardID: string;
  standardData: StandardData[];
  compositionData: CompositionData[];
  defectRiceData: DefectRiceData[];
}

const HistorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    standardID: { type: String, required: true },
    note: { type: String, required: false },
    standardName: { type: String, required: true },
    samplingDate: { type: Date, required: true },
    samplingPoint: { type: [String], required: true },
    price: { type: Number, required: true },
    imageLink: { type: String, required: true },
    total_sample: { type: Number, required: true },
    standardData: [
      {
        key: { type: String, required: true },
        minLength: { type: Number, required: true },
        maxLength: { type: Number, required: true },
        shape: { type: [String], required: true },
        name: { type: String, required: true },
        conditionMin: {
          type: String,
          enum: ["GE", "LE", "GT", "LT"],
          required: true,
        },
        conditionMax: {
          type: String,
          enum: ["GE", "LE", "GT", "LT"],
          required: true,
        },
      },
    ],
    compositionData: [
      {
        key: { type: String, required: true },
        name: { type: String, required: true },
        length: { type: String, required: true },
        actual: { type: Number, required: true },
      },
    ],

    defectRiceData: [
      {
        name: { type: String, required: true },
        actual: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

HistorySchema.pre("save", function (next) {
  this.set({ createdAt: Date.now(), updatedAt: null });
  next();
});

HistorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const virtual = HistorySchema.virtual("inspectionID");
virtual.get(function () {
  return this._id;
});
HistorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;
    if (ret.standardData) {
      ret.standardData.forEach((item: { id: any }) => delete item.id);
    }
    if (ret.compositionData) {
      ret.compositionData.forEach((item: { id: any }) => delete item.id);
    }
    if (ret.defectRiceData) {
      ret.defectRiceData.forEach((item: { id: any }) => delete item.id);
    }
  },
});
const HistoryModel = mongoose.model<History>("History", HistorySchema);

export default HistoryModel;
