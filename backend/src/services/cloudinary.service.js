import cloudinary from '../configs/cloudinary.config';
import ApiError from '../utils/ApiError';
import logger from '../utils/logger';

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
   * @returns {Promise<import("cloudinary").UploadApiResponse>} The result of the upload operation
   * @throws {Error} Throws an error if the upload fails
   */
  async uploadFile(filePath) {
    try {
      const result = await this.cloudinary.uploader.upload(filePath, {
        folder: 'user_uploads',
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
}

export default new CloudinaryService(cloudinary);
