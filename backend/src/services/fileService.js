const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class FileService {
  /**
   * Process and optimize image
   */
  async processImage(filePath, options = {}) {
    try {
      const {
        width = 1920,
        quality = 85,
        format = 'webp'
      } = options;

      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const name = path.basename(filePath, ext);
      const outputPath = path.join(dir, `${name}.${format}`);

      await sharp(filePath)
        .resize(width, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality })
        .toFile(outputPath);

      // Delete original if format changed
      if (ext !== `.${format}`) {
        await fs.unlink(filePath);
      }

      return outputPath;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Create thumbnail
   */
  async createThumbnail(filePath, size = 400) {
    try {
      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const name = path.basename(filePath, ext);
      const thumbPath = path.join(dir, `${name}-thumb${ext}`);

      await sharp(filePath)
        .resize(size, size, { fit: 'cover' })
        .toFile(thumbPath);

      return thumbPath;
    } catch (error) {
      console.error('Thumbnail creation error:', error);
      throw new Error('Failed to create thumbnail');
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const metadata = await sharp(filePath).metadata();

      return {
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      };
    } catch (error) {
      console.error('File info error:', error);
      return null;
    }
  }

  /**
   * Convert path to URL
   */
  getBaseUrl(req) {
    const configured = process.env.API_URL;
    if (configured) {
      return configured.replace(/\/$/, '');
    }

    if (!req) {
      return '';
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');

    return host ? `${proto}://${host}` : '';
  }

  pathToUrl(filePath, req) {
    const relativePath = filePath.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/');
    const baseUrl = this.getBaseUrl(req);
    return baseUrl ? `${baseUrl}${relativePath}` : relativePath;
  }

  normalizePublicUrl(value, req) {
    if (!value) return value;

    const baseUrl = this.getBaseUrl(req);
    if (!baseUrl) return value;

    if (value.startsWith('/uploads/')) {
      return `${baseUrl}${value}`;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
      try {
        const parsed = new URL(value);
        if (parsed.pathname && parsed.pathname.startsWith('/uploads/')) {
          return `${baseUrl}${parsed.pathname}`;
        }
      } catch (error) {
        return value;
      }
    }

    return value;
  }
}

module.exports = new FileService();
