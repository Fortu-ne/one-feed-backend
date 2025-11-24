import pool from "../config/database.mjs";

export class commentModel {

    static async getAllComments(){

        const result = await pool.query(`SELECT * FROM comments WHERE id = $1`,[id]);

        return result.rows;
        
    }

    static async getCommentsByPost(id){
       
        const result = await pool.query(
      `SELECT 
        c.id AS comment_id,
        c.content,
        c.created_at,
        u.id AS user_id,
        u.username AS username,
        u.profile_url AS profile_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC`
      , [id] );

        return result.rows;
    }


    static async createComment(comment){

        const {user_id,post_id,content} = comment;
        const result = await pool.query(`
            INSERT INTO comments (content,user_id,post_id)
            VALUES ($1,$2,$3)`,[content,user_id,post_id]);

        return result.rows[0];


    }
    
    static async getComment(id){

         const result = await pool.query(`SELECT * FROM comments WHERE id = $1`,[id]);

        return result.rows[0];

    }

  

    static async deleteComment(id){

        const result = await pool.query(`DELETE FROM comments WHERE id = $1`,[id]);

        return result.rows[0];

    }

}

export default commentModel;