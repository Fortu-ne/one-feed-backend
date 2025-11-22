import commentModel from "../models/comment.model.mjs";

export class CommentController {

    static async create(req,res,next){

        try {

            const {post_id} = req.params;
            const {content} = req.body;
            const userId = req.user.userId;

            if(!content){
                res.status(409).json({
                    Message: "Content is required"
                })
            }

            const newComment = {
                post_id: post_id,
                user_id: userId,
                content: content.trim()
            }

            await commentModel.createComment(newComment);

            res.status(201).json(newComment);
            
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

     
    static async getComment(req,res,next){

        try {

            const {id} = req.params;

            const comment = await commentModel.getComment(id);
     
           if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
      }

        res.status(201).json(comment);
            
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

     
    static async getAll(req,res,next){

        try {

        const comments = await commentModel.getAllComments();

            res.status(201).json(comments);
            
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

    static async getCommentsByPost(req,res,next){

        try {

        const {id} = req.params;
        const comments = await commentModel.getCommentsByPost(id);

            res.status(201).json(comments);
            
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

     
    static async delete(req,res,next){

        try {

            const {id} = req.params;

        const comment = await commentModel.getComment(id);

        if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
      }

      await commentModel.deleteComment(id);
    
      return res.status(201).json({
            Message: "Comment deleted successfully",
            Comment: comment})

            
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

export default CommentController;