import multer from 'multer';
import path from 'path';
import os from 'os';
import ApiError from '../utils/ApiError.js';

/**
 * Multer storage configuration using system temporary directory
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

/**
 * File filter to allow only images
 */
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed!'), false);
  }
};

/**
 * Multer upload instance for multiple images
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024, // 500 KB limit per image
  },
  fileFilter: fileFilter,
});

/**
 * Middleware to handle 1-4 product images
 */
export const uploadProductImages = upload.array('images', 4);

/**
 * Middleware to validate the number of uploaded images (min 1, max 4)
 */
export const validateImageCount = (req, _res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ApiError(400, 'Minimum 1 product image is required'));
  }
  if (req.files.length > 4) {
    return next(new ApiError(400, 'Maximum 4 product images allowed'));
  }
  next();
};

/**
 * Middleware to handle user avatar upload
 */
export const uploadAvatar = upload.single('avatar');
