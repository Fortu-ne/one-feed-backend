import pool from "../config/database.mjs";

export class PostModel  {

    static async createPost(post,userId){

        const { content, image_url} = post;
    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *`,
      [userId, content, image_url]
    );

    return result.rows[0];
    }

    static async delete(id){

        
       const result = await pool.query(`DELETE  FROM posts WHERE id = $1`,[id]);

       return result.rows[0];

    }

    static async getAll(){

        
       const result = await pool.query(`SELECT * FROM posts`);

       return result.rows;

    }
    static async getPostsByUser(id){

        
       const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[id]);

       return result.rows[0];

    }
    static async getPost(content){

       const result = await pool.query(`SELECT * FROM posts WHERE content =$1`,[content]);

       return result.rows[0];
    
    }
    static async getById(id){

       const result = await pool.query(`SELECT * FROM posts WHERE id = $1`,[id]);

       return result.rows[0];
    
    }


  
}

export default PostModel;