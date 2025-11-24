import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { upload } from '../config/cloudinary.mjs';
import pool from '../config/database.mjs';

const profileRouter = express.Router();


profileRouter.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        id, 
        username, 
        email, 
        bio, 
        profile_url,
        created_at
      FROM users 
      WHERE id = $1
    `, [userId]);



    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    
    const postCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = $1',
      [userId]
    );
    const postCount = parseInt(postCountResult.rows[0].count);


    const posts = await pool.query(`
      SELECT 
        posts.id,
        posts.user_id,
        posts.content,
        posts.image_url,
        posts.created_at,
        posts.updated_at,
        COUNT(DISTINCT likes.id) as like_count,
        COUNT(DISTINCT comments.id) as comment_count,
        EXISTS(
          SELECT 1 FROM likes 
          WHERE likes.post_id = posts.id 
          AND likes.user_id = $1
        ) as user_has_liked
      FROM posts
      LEFT JOIN likes ON posts.id = likes.post_id
      LEFT JOIN comments ON posts.id = comments.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
    `, [userId]);

    
    
    const user = {
      ...result.rows[0],
      post_count: postCount,
      posts: posts.rows  
    };



 
    const response = {
      success: true,
      data: user
    };


    return res.json(response);

  } catch (error) {
    console.error('❌ Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});


profileRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
   
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        id, 
        username, 
        bio, 
        profile_url,
        created_at
      FROM users 
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }


    const postCount = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = $1',
      [profileId]
    );

   
    const posts = await pool.query(`
      SELECT 
        posts.id,
        posts.content,
        posts.image_url,
        posts.created_at,
        COUNT(DISTINCT likes.id) as like_count,
        COUNT(DISTINCT comments.id) as comment_count
      FROM posts
      LEFT JOIN likes ON posts.id = likes.post_id
      LEFT JOIN comments ON posts.id = comments.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
      LIMIT 20
    `, [userId]);

    const user = {
      ...result.rows[0],
      post_count: parseInt(postCount.rows[0].count),
      posts: posts.rows
    };

    return res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

profileRouter.put('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET 
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, username, email, bio, profile_url
    `, [username?.trim(), bio?.trim(), userId]);

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Username already taken'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});


profileRouter.put('/me/picture', authenticateToken, upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const userId = req.user.userId;
    const profile_url = req.file.path;

    const result = await pool.query(`
      UPDATE users 
      SET profile_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, username, email, bio, profile_url
    `, [profile_url, userId]);

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile picture error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile picture'
    });
  }
});

export default profileRouter;