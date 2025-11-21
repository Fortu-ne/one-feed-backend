import pool from "../config/database.mjs";


export class authModel {

    static async signUp(authModel){

        const {username,email,password,bio,profile_url} = authModel;

        const query = `
            INSERT INTO users (username,email,password_hash,bio,profile_image_url)
            VALUES($1,$2,$3,$4,$5)`;
        
        const result = await pool.query(query,[username,email,password,bio,profile_url]);

        return result.rows[0];

    }

    static async loginIn(authModel){

    }
}

export default authModel;