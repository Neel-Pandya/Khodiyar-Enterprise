import cloudinary from '../configs/cloudinary.config.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import fs from 'node:fs/promises';
import { fileTypeFromFile } from 'file-type';

/**
 * Service class for handling image operations.
 * Provides methods for image validation, upload, deletion, and cleanup.
 */
class ImageService {
  /**
   * Initializes the ImageService with the provided Cloudinary instance.
   * @param {cloudinary} cloudinaryInstance - The Cloudinary instance to use for API operations
   */
  constructor(cloudinaryInstance) {
    this.cloudinary = cloudinaryInstance;
  }

  /**
   * Validates image files using magic byte validation for security
   * @param {Array} files - Array of file objects to validate
   * @throws {ApiError} Throws an error if any file is not a valid image
   */
  async validateImageFiles(files) {
    if (!files || files.length === 0) {
      return;
    }

    for (const file of files) {
      const type = await fileTypeFromFile(file.path);
      if (!type || !type.mime.startsWith('image/')) {
        throw new ApiError(
          400,
          `File ${file.originalname} is not a valid image`
        );
      }
    }
  }

  /**
   * Uploads a single file to Cloudinary
   * @param {string} filePath - The path of the file to upload
   * @param {string} folder - The folder to upload to (defaults to user_uploads)
   * @returns {Promise<import("cloudinary").UploadApiResponse>} The result of the upload operation
   * @throws {ApiError} Throws an error if the upload fails
   */
  async uploadFile(filePath, folder = 'user_uploads') {
    try {
      const result = await this.cloudinary.uploader.upload(filePath, {
        folder: folder,
      });
      return result;
    } catch (error) {
      logger.error('Failed to upload file to Cloudinary', {
        error: error.message,
        stack: error.stack,
        filePath,
        service: 'image-service',
      });
      throw new ApiError(500, 'Failed to upload file to Cloudinary', [
        error.message,
      ]);
    }
  }

  /**
   * Deletes a file from Cloudinary
   * @param {string} publicId - The public_id of the file to delete
   * @returns {Promise<import("cloudinary").DeleteApiResponse>} The result of the delete operation
   * @throws {ApiError} Throws an error if the delete fails
   */
  async deleteFile(publicId) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      logger.error('Failed to delete file from Cloudinary', {
        error: error.message,
        stack: error.stack,
        publicId,
        service: 'image-service',
      });
      throw new ApiError(500, 'Failed to delete file from Cloudinary', [
        error.message,
      ]);
    }
  }

  /**
   * Uploads multiple images to Cloudinary with validation and rollback on failure
   * @param {Array} files - Array of file objects to upload
   * @param {string} folder - The folder to upload to (defaults to user_uploads)
   * @returns {Promise<Object>} Object containing imageUrls and publicIds arrays
   * @throws {ApiError} Throws an error if validation fails or uploads fail
   */
  async uploadImages(files, folder = 'user_uploads') {
    let uploadedPublicIds = [];
    let imageUrls = [];

    try {
      if (!files || files.length === 0) {
        return { imageUrls: [], publicIds: [] };
      }

      // 1. Validate image files (magic byte validation for security)
      await this.validateImageFiles(files);

      // 2. Upload images to Cloudinary in parallel
      const uploadPromises = files.map((file) =>
        this.uploadFile(file.path, folder)
      );
      const settledResults = await Promise.allSettled(uploadPromises);

      // 3. Process upload results
      for (const settledResult of settledResults) {
        if (settledResult.status === 'fulfilled' && settledResult.value) {
          const { secure_url, public_id } = settledResult.value;
          if (secure_url && public_id) {
            imageUrls.push(secure_url);
            uploadedPublicIds.push(public_id);
          }
        }
      }

      // 4. Check for failed uploads and rollback if necessary
      const hasFailedUploads = settledResults.some(
        (result) => result.status === 'rejected'
      );

      if (hasFailedUploads) {
        await this.rollbackUploads(uploadedPublicIds);
        throw new ApiError(
          500,
          'Some image uploads failed, rolled back all uploaded images'
        );
      }

      // 5. Cleanup local files
      await this.cleanupLocalFiles(files);

      return {
        imageUrls,
        publicIds: uploadedPublicIds,
      };
    } catch (error) {
      // Rollback Cloudinary uploads on error
      if (uploadedPublicIds.length > 0) {
        await this.rollbackUploads(uploadedPublicIds);
      }

      // Cleanup local files on error
      await this.cleanupLocalFiles(files);

      if (error instanceof ApiError) throw error;

      logger.error('Failed to upload images', {
        error: error.message,
        service: 'image-service',
      });
      throw new ApiError(500, 'Failed to upload images');
    }
  }

  /**
   * Deletes multiple images from Cloudinary
   * @param {Array<string>} publicIds - Array of public_ids to delete
   * @returns {Promise<void>}
   */
  async deleteImages(publicIds) {
    if (!publicIds || publicIds.length === 0) {
      return;
    }

    const deletePromises = publicIds.map((publicId) =>
      this.deleteFile(publicId)
    );
    await Promise.allSettled(deletePromises);
  }

  /**
   * Cleans up local temporary files
   * @param {Array} files - Array of file objects to cleanup
   */
  async cleanupLocalFiles(files) {
    if (!files || files.length === 0) {
      return;
    }

    for (const file of files) {
      try {
        await fs.unlink(file.path);
      } catch (error) {
        // File already deleted or doesn't exist - ignore error
        logger.debug('Failed to delete local file (may already be deleted)', {
          filePath: file.path,
          error: error.message,
          service: 'image-service',
        });
      }
    }
  }

  /**
   * Rolls back uploaded images from Cloudinary (used on error)
   * @param {Array<string>} publicIds - Array of public_ids to delete
   */
  async rollbackUploads(publicIds) {
    if (!publicIds || publicIds.length === 0) {
      return;
    }

    for (const publicId of publicIds) {
      try {
        await this.deleteFile(publicId);
      } catch (error) {
        logger.error('Failed to rollback Cloudinary image', {
          publicId,
          error: error.message,
          service: 'image-service',
        });
      }
    }
  }
}

export default new ImageService(cloudinary);
