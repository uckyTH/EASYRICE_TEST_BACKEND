//Historty.router.ts
import express from "express";
import {
  createInspection,
  deleteHistory,
  fetchHistories,
  fetchHistoryById,
  updateHistory,
} from "../controller/History";
import { Request, Response } from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();

// กำหนดให้ไฟล์ต้องเป็น JSON เท่านั้น
const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype === "application/json") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JSON files are allowed!"), false);
  }
};

// สร้าง instance ของ multer
const upload = multer({ storage, fileFilter });

router.post("/", upload.single("rawData"), createInspection);
router.get("/", fetchHistories);
router.get("/:id", fetchHistoryById);
router.put("/:id", updateHistory);
router.delete("/", deleteHistory);

export default router;
