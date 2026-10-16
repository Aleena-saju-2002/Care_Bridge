import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDirectory = path.resolve(
  process.cwd(),
  "private-uploads",
  "hospitals"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const upload = multer({
  storage,
  limits: {
fileSize: 5 * 1024 * 1024, 
    files: 8,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new Error("Only PDF, JPEG and PNG documents are allowed")
      );
    }

    callback(null, true);
  },
});

export const hospitalDocuments = upload.fields([
  { name: "registrationCertificate", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "nabhCertificate", maxCount: 1 },
  { name: "governmentCertificate", maxCount: 1 },
  { name: "bankProof", maxCount: 1 },
]);