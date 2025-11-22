import PostModel from "../models/post.model.mjs";

export class postController {


    static async createPost(req,res,next){

        try {
            
            const {title,content,image_url} = req.body;
            const userId = req.user.userId;

            console.log('✅ userId extracted:', userId);


            if(!title || !content){
                res.status(409).json({
                    Message: "Title, Content is required"
                })
            }


            const postModel = await PostModel.getPost(title,content);

            if(postModel){
              res.status(409).json({
              Success: false,
              Message: "Post already exists"
            })
            }

            const newPost = {
                title: title.trim(),
                content: content.trim(),
                image_url: image_url?.trim() || null,
                created_at : new Date(),
                updated_at : new Date()
            }

            

            const post = await PostModel.createPost(newPost,userId);


           res.status(201).json(post);
          }  catch (error) {
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
            
             const userId = req.user.userId;

            const post = await PostModel.getPostsByUsers(userId);

      if (!post) {
      return res.status(404).json({ error: 'Posts not found' });
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

    static async getAllPosts(req,res,next){

        try {
            
           

        const post = await PostModel.getAll();


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