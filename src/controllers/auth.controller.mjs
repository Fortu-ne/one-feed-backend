import UserModel from "../models/user.model.mjs";
import authModel from "../models/auth.model.mjs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();

export class AuthController{

static async signup(req, res) {
  try {
    const { username, email, bio, password } = req.body;

    const profileImageUrl = req.file ? req.file.path : null;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, Email and Password is required'
      });
    }

    const [emailTaken, usernameTaken] = await Promise.all([
      UserModel.ifEmailExists(email),
      UserModel.ifUserExists(username)
    ]);

    if (usernameTaken)
      return res.status(409).json({ Message: "Username is Taken" });

    if (emailTaken)
      return res.status(409).json({ Message: "Email is Already Taken" });

    const password_hash = await bcrypt.hash(password, 12);

    const user = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      bio: bio?.trim() || null,
      profile_url: profileImageUrl, // ← stored Cloudinary URL
      password: password_hash
    };

    const newUser = await authModel.signUp(user);

    const token = jwt.sign(
      { user: newUser },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message });
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

