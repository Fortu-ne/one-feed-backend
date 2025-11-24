import commentModel from "../models/comment.model.mjs";
import UserModel from "../models/user.model.mjs";

export class CommentController {

    static async create(req,res,next){

        try {

            const {id} = req.params;
            const {content} = req.body;
            const userId = req.user.userId;

            if(!content){
                res.status(409).json({
                    Message: "Content is required"
                })
            }

            const newComment = {
                post_id: id,
                user_id: userId,
                content: content.trim()
            }

            const user = await UserModel.getUserById(userId);

           await commentModel.createComment(newComment);

      const commentWithUser = {
      comment_id: newComment.id,  
      content: newComment.content,
      created_at: newComment.created_at,
      user_id: newComment.user_id,
      username: user.username,     
      profile_url: user.profile_url 
    };

     const io = req.app.get('io');
        io.emit('new-comment', {
            id: id,
            comment: commentWithUser
        });

    return res.status(201).json({
      success: true,
      data: commentWithUser
    });
            
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


     static async getCommentUser(req,res,next){

        try {

            const {id} = req.params;

            const comment = await commentModel.getCommentUser(id);
     
           if (!comment) {
      return res.status(404).json({ error: 'User not found' });
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

            res.status(201).json({data: comments});
            
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
    

            res.status(201).json({data: comments});
            
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