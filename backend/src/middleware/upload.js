import fs from "fs";
import path from "path";
import multer from "multer";

const ensureDirectory = (directory) => {
  fs.mkdirSync(directory, { recursive: true });
  return directory;
};

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const directory = ensureDirectory(path.join(process.cwd(), "src", "uploads", folder));
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
      cb(null, `${Date.now()}-${safeName}`);
    }
  });

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed."));
  }

  cb(null, true);
};

export const campaignImageUpload = multer({
  storage: createStorage("campaigns"),
  fileFilter: imageFileFilter,
  limits: { files: 10, fileSize: 5 * 1024 * 1024 }
});

export const animalImageUpload = multer({
  storage: createStorage("animals"),
  fileFilter: imageFileFilter,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 }
});

const expenseFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") {
    return cb(new Error("Only images and PDFs are allowed for expenses."));
  }
  cb(null, true);
};

export const expenseAttachmentUpload = multer({
  storage: createStorage("expenses"),
  fileFilter: expenseFileFilter,
  limits: { files: 3, fileSize: 10 * 1024 * 1024 }
});

export const medicalAttachmentUpload = multer({
  storage: createStorage("medical"),
  limits: { files: 1, fileSize: 10 * 1024 * 1024 }
});
