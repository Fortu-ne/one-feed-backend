import pool from "../config/database.mjs";

export class UserModel {

  static async getAllUsers(){

    const query = `SELECT * FROM users`;

    const result = await pool.query(query);

    return result.rows;
  }

  static async getUserById(id){

    const query = `SELECT * FROM users where id = $1`;

    const result = await pool.query(query,[id]);

    return result.rows;

  }

  static async updateUser(id,userModel){

  }

  static async ifUserExists(email,username)
  {
     const result = await pool.query(`SELECT * FROM users WHERE username = $1 OR email = $2`,[username,email]);

      return result.rows[0];
  }

 static async ifEmailExists(email)
  {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);

      return result.rows[0];
  }

 static async ifUsernameExists(username)
  {
      const result = await pool.query(`SELECT * FROM users WHERE username = $1`,[username]);

      return result.rows[0];
  }

  static async getUserPosts(id){
    
  }


    
}

export default UserModel;