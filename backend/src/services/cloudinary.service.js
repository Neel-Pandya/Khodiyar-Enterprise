import cloudinary from '../configs/cloudinary.config.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Service class for handling Cloudinary operations.
 * Provides methods to interact with Cloudinary API, such as uploading files.
 */
class CloudinaryService {
  /**
   * Initializes the CloudinaryService with the provided Cloudinary instance.
   * @param {cloudinary} cloudinary - The Cloudinary instance to use for API operations
   */
  constructor(cloudinary) {
    this.cloudinary = cloudinary;
  }

  /**
   * Uploads a file to Cloudinary
   * @param {string} filePath - The path of the file to upload
   * @param {string} folder - The folder to upload to (defaults to user_uploads)
   * @returns {Promise<import("cloudinary").UploadApiResponse>} The result of the upload operation
   * @throws {Error} Throws an error if the upload fails
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
        service: 'cloudinary-upload',
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
   * @throws {Error} Throws an error if the delete fails
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
        service: 'cloudinary-delete',
      });
      throw new ApiError(500, 'Failed to delete file from Cloudinary', [
        error.message,
      ]);
    }
  }
}

export default new CloudinaryService(cloudinary);
