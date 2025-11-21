import UserModel from "../models/user.model.mjs";
import authModel from "../models/auth.model.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();

export class AuthController{

    static async signup(req,res,next){

        try {
            
         const saltRounds = process.env.SALT_ROUNDS || 20;
         const {username,email,bio,password,profile_url} = req.body;

            if(!username || !email || !password){
            return res.status(400).json({
            error: 'Username, Email and Password is required'
            });
             }

         const [emailTaken, usernameTaken] = await Promise.all([
         UserModel.ifEmailExists(email),
         UserModel.ifUserExists(username)
          ]);
            
           if(usernameTaken){
             res.status(409).json({
              Success: false,
              Message: "Username is Taken"
            })
                          
         }else if(emailTaken){
           res.status(409).json({
            Success: false,
            Message: "Email Is Already Taken"
           });
         }
        



    const password_hash = await bcrypt.hash(password,12);

     const user = {
        username : username.trim(),
        email : email.toLowerCase().trim(),
        bio: bio.trim() || null,
        profile_url: profile_url?.trim() || null,
        password : password_hash,
        created_at : new Date(),
        updated_at : new Date()
    }

    const newUser = await authModel.signUp(user);


    
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );
        
    
    res.status(201).json({
      token,newUser
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

   static async login(req,res,next){

    try {
      
      const {username,password} = req.body;

      const user = await UserModel.ifUsernameExists(username);

      if(!user){
        res.status(404).json({
          Error : "User not found"
        })
      }

      const compare = await bcrypt.compare(password,user.password_hash);

      if(!compare){
        res.status(409).json(
          {
            Error: "Invalid Credentials"
          }
        )
      }

       const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

     res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_image_url: user.profile_image_url,
      },
    });






    } catch (error) {
      
     console.error(error);
    res.status(500).json({ error: 'Server error' });
    }

   }

}

