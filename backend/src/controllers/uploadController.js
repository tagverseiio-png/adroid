const fileService = require('../services/fileService');
const { successResponse, errorResponse } = require('../utils/response');
const fs = require('fs').promises;
const path = require('path');

/**
 * Upload single image
 */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const tempFilePath = req.file.path;
    const targetFolder = req.body.folder || req.body.uploadType || 'temp';

    // Process image (convert to WebP, optimize)
    const processedPath = await fileService.processImage(tempFilePath, {
      width: 1920,
      quality: 85,
      format: 'webp'
    });

    // Create thumbnail
    const thumbnailPath = await fileService.createThumbnail(processedPath, 400);

    let finalImagePath = processedPath;
    let finalThumbnailPath = thumbnailPath;

    // If upload should go to a specific folder, move processed files there
    if (targetFolder && targetFolder !== 'temp') {
      const uploadsRoot = path.join(__dirname, '../../uploads');
      const destinationDir = path.join(uploadsRoot, targetFolder);

      await fs.mkdir(destinationDir, { recursive: true });

      const imageName = path.basename(processedPath);
      const thumbName = path.basename(thumbnailPath);

      finalImagePath = path.join(destinationDir, imageName);
      finalThumbnailPath = path.join(destinationDir, thumbName);

      await fs.rename(processedPath, finalImagePath);
      await fs.rename(thumbnailPath, finalThumbnailPath);
    }

    // Get file info
    const fileInfo = await fileService.getFileInfo(finalImagePath);

    // Convert paths to URLs
    const imageUrl = fileService.pathToUrl(finalImagePath, req);
    const thumbnailUrl = fileService.pathToUrl(finalThumbnailPath, req);

    successResponse(res, {
      url: imageUrl,
      thumbnail: thumbnailUrl,
      path: finalImagePath.replace(/^.*[\\/]uploads[\\/]/, '/uploads/'),
      thumbnailPath: finalThumbnailPath.replace(/^.*[\\/]uploads[\\/]/, '/uploads/'),
      size: fileInfo.size,
      width: fileInfo.width,
      height: fileInfo.height
    }, 'Image uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up on error
    if (req.file) {
      await fileService.deleteFile(req.file.path).catch(() => {});
    }
    errorResponse(res, 'Failed to upload image', 500);
  }
};

/**
 * Upload multiple images
 */
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const processedImages = [];

    for (const file of req.files) {
      try {
        const processedPath = await fileService.processImage(file.path, {
          width: 1920,
          quality: 85,
          format: 'webp'
        });

        const thumbnailPath = await fileService.createThumbnail(processedPath, 400);
        const fileInfo = await fileService.getFileInfo(processedPath);

        processedImages.push({
          url: fileService.pathToUrl(processedPath, req),
          thumbnail: fileService.pathToUrl(thumbnailPath, req),
          path: processedPath.replace(/^.*[\\/]uploads[\\/]/, '/uploads/'),
          thumbnailPath: thumbnailPath.replace(/^.*[\\/]uploads[\\/]/, '/uploads/'),
          size: fileInfo.size,
          width: fileInfo.width,
          height: fileInfo.height
        });
      } catch (error) {
        console.error('Error processing file:', file.originalname, error);
      }
    }

    successResponse(res, processedImages, `${processedImages.length} images uploaded successfully`, 201);
  } catch (error) {
    console.error('Multiple upload error:', error);
    errorResponse(res, 'Failed to upload images', 500);
  }
};

/**
 * Delete file
 */
exports.deleteFile = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return errorResponse(res, 'File path is required', 400);
    }

    const fullPath = path.join(__dirname, '../../uploads', filePath.replace('/uploads/', ''));
    const deleted = await fileService.deleteFile(fullPath);

    if (!deleted) {
      return errorResponse(res, 'File not found or already deleted', 404);
    }

    // Try to delete thumbnail if exists
    const ext = path.extname(fullPath);
    const thumbPath = fullPath.replace(ext, `-thumb${ext}`);
    await fileService.deleteFile(thumbPath).catch(() => {});

    successResponse(res, null, 'File deleted successfully');
  } catch (error) {
    console.error('Delete file error:', error);
    errorResponse(res, 'Failed to delete file', 500);
  }
};
