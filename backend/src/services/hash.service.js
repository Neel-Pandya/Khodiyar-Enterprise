import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class HashService {
  /**
   * Hash a password using bcrypt
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a password using bcrypt
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Hash an OTP/Token using SHA-256
   * @param {string} data
   * @returns {string} Hashed data
   */
  hashOTP(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Compare an OTP/Token using SHA-256
   * @param {string} rawData
   * @param {string} hashedData
   * @returns {boolean}
   */
  compareOTP(rawData, hashedData) {
    const hashedRaw = this.hashOTP(rawData);
    return hashedRaw === hashedData;
  }
}

export default new HashService();
