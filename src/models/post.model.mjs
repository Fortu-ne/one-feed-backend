import pool from "../config/database.mjs";

export class PostModel  {

    static async createPost(post,userId){

        const {title, content, image_url} = post;
    const result = await pool.query(
      `INSERT INTO posts (user_id, title, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title, content, image_url]
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
    static async getPostsByUsers(id){

        
       const result = await pool.query(`SELECT * FROM posts WHERE user_id = $1`,id);

       return result.rows;

    }
    static async getPost(title,content){

       const result = await pool.query(`SELECT * FROM posts WHERE title = $1 AND content =$2`,[title,content]);

       return result.rows[0];
    
    }
    static async getById(id){

       const result = await pool.query(`SELECT * FROM posts WHERE id = $1`,[id]);

       return result.rows[0];
    
    }


  
}

export default PostModel;