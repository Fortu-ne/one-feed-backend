import LikeModel from "../models/like.model.mjs";

export class LikeController {

   static async toggleLike (req, res, next) {
    try {
        const {id} = req.params;
        const userId = req.user.userId;

        console.log('✅ userId extracted:', userId);

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Valid id is required' 
            });
        }
        
        const result = await LikeModel.toggleLike(userId, id);
        const likeCount = await LikeModel.getLikeCount(id);

        console.log(`Results:`, result);
        
      
        const io = req.app.get('io');
        io.emit('post-liked', {
            postId: parseInt(id),
            liked: result.liked,
            likeCount: likeCount,
            userId: userId 
        });
        
        return res.status(200).json({ 
            success: true, 
            data: {
                liked: result.liked,
                likeCount: likeCount
            }
        });
        
    } catch (error) {
        console.error('Toggle like error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
   }

    static async getAllByPost (req, res, next) {
        try {
            const {id} = req.params;
            
            if (!id) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Valid id is required' 
                });
            }
            
            const users = await LikeModel.getUsersWhoLiked(id);
            
            return res.status(200).json({ 
                success: true, 
                data: users 
            });
            
        } catch (error) {
            console.error('Get likes error:', error);
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

export default LikeController;