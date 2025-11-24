import PostModel from "../models/post.model.mjs";
import pool from "../config/database.mjs";

export class postController {


  

     static async createPost(req, res, next) {
    try {
      const userId = req.user.userId;
      const { content } = req.body;
      
     const image_url = req.file ? req.file.path : null;

    const hasContent = content && content.trim().length > 0;
    const hasImage = image_url !== null;


    if (!hasContent && !hasImage) {
      return res.status(400).json({
        success: false,
        error: 'Post must have content or image'
      });
    }

      const result = await pool.query(`
        INSERT INTO posts (user_id, content, image_url)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, content?.trim() || null, image_url]);

      const newPost = result.rows[0];


      const userResult = await pool.query(`
        SELECT username, profile_url FROM users WHERE id = $1
      `, [userId]);

      const completePost = {
        id: newPost.id,
        user_id: newPost.user_id,
        content: newPost.content,
        image_url: newPost.image_url, 
        created_at: newPost.created_at,
        username: userResult.rows[0].username,
        profile_url: userResult.rows[0].profile_url,
        like_count: 0,
        comment_count: 0,
        user_has_liked: false
      };

      

    
      const io = req.app.get('io');
      if (io) {
        io.emit('new-post', completePost);
      }

      return res.status(201).json({
        success: true,
        data: completePost
      });

    } catch (error) {
      console.error('Create post error:', error);

      const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message;

      return res.status(500).json({ 
        success: false,
        error: errorMessage 
      });
    }
    }

    static async getPost(req,res,next){

        try {
            
            const {id} = req.params;

            const post = await PostModel.getById(id);

      if (!post) {
      return res.status(404).json({ error: 'Post not found' });
      }

        res.status(201).json(post);

        } catch (error) {
         console.error('Registration error:', error);

         const errorMessage = process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message;

         return res.status(500).json({ 
     success: false,
      error: errorMessage 
      });
   
        }

    }
    static async getAllPostsByUser(req,res,next){

        try {
            
           const {id} = req.params;

            const user = await PostModel.getPostsByUser(id);


      if (!user) {
      return res.status(404).json({ error: 'User not found' });
      }

        res.status(201).json(user);

        } catch (error) {
         console.error('Registration error:', error);

         const errorMessage = process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message;

         return res.status(500).json({ 
     success: false,
      error: errorMessage 
      });
   
        }

    }

    static async getAllPosts(req,res,next){

        try {
            
           

        const post = await PostModel.getAll();


        res.status(201).json(
            {
                data: post
            }
        );

        } catch (error) {
         console.error('Registration error:', error);

         const errorMessage = process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message;

         return res.status(500).json({ 
     success: false,
      error: errorMessage 
      });
   
        }

    }

    static async deletePost(req,res,next){

        try {
            
            const {id} = req.params;

            const post = await PostModel.getById(id);

            if (!post) {
            return res.status(404).json({ error: 'Post not found' });
            }

            await PostModel.delete(id);



           return res.status(201).json({
            Message: "Post deleted successfully",
            Post: post
        })

        } catch (error) {
         console.error('Registration error:', error);

         const errorMessage = process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message;

         return res.status(500).json({ 
     success: false,
      error: errorMessage 
      });
   
        }

    }

    

}

export default postController;