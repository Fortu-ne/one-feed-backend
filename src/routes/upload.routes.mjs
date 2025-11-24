import express from 'express';
import { upload } from '../config/cloudinary.mjs';
import { authenticateToken } from '../middleware/auth.mjs';
import pool from '../config/database.mjs';

const router = express.Router();

// Upload single image
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const userId = req.user.userId;
    const cloudinaryId = req.file.filename; 
    const imageUrl = req.file.path; 

  

    return res.status(200).json({
      success: true,
      data: {
        url: imageUrl,
        cloudinary_id: cloudinaryId
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});


router.post('/upload-multiple', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      });
    }

    const userId = req.user.userId;
    const uploadedImages = req.files.map(file => ({
      url: file.path,
      cloudinary_id: file.filename
    }));


    return res.status(200).json({
      success: true,
      data: uploadedImages
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    });
  }
});

export default router;