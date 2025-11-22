import pool from "../config/database.mjs";

export class commentModel {

    static async getAllComments(){

        const result = await pool.query(`SELECT * FROM comments WHERE id = $1`,[id]);

        return result.rows;
        
    }

    static async getCommentsByPost(id){
       
        const result = await pool.query(`SELECT * FROM comments WHERE post_id = $1`,[id]);

        return result.rows;
    }

    static async createComment(comment){

        const {content,user_id,post_id} = comment;
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