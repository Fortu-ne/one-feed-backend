import pool from "../config/database.mjs";


export class LikeModel {


    
    static async toggleLike(user_id, post_id) {
        
        
        const checkQuery = `
            SELECT id FROM likes 
            WHERE user_id = $1 AND post_id = $2
        `;
        const existing = await pool.query(checkQuery, [user_id, post_id]);
        
        if (existing.rows.length > 0) {
            await pool.query(
                'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
                [user_id, post_id]
            );
            return { liked: false };
        } else {
            
            await pool.query(
                'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
                [user_id, post_id]
            );
            return { liked: true };
        }
    }
    

    static async getLikeCount(post_id) {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM likes WHERE post_id = $1',
            [post_id]
        );
        return parseInt(result.rows[0].count);
    }
    

    static async hasUserLiked(user_id, post_id) {
        const result = await pool.query(
            'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
            [user_id, post_id]
        );
        return result.rows.length > 0;
    }
    
   
    static async getUsersWhoLiked(post_id) {
        const result = await pool.query(`
            SELECT 
                users.id,
                users.username,
                users.profile_url,
                likes.created_at as liked_at
            FROM likes
            JOIN users ON likes.user_id = users.id
            WHERE likes.post_id = $1
            ORDER BY likes.created_at DESC
        `, [post_id]);
        
        return result.rows;
    }
}

export default  LikeModel;
