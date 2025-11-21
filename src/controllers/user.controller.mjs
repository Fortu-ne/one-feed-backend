import UserModel from "../models/user.model.mjs";

export class UserController {

    static async getAllUsers(req,res,next){
        
         try {

        const users = await UserModel.getAllUsers();

        if(!users) return res.status(404);

        res.json(users);
        
    } catch (error) {
       next(error); 
    }
    }

     static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserModel.getUserById(id);

            if (!user) {
                return res.status(404).json({
                    message: "User Not Found"
                });
            }

            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    static async getUser(req,res,next){

        try {

            const {username,email} = req.body

            const user = await UserModel.ifUserExists(email,username);

            if(!user){
            return res.status(404).json({
                Message: "User Not Found"
            })
        }


        return res.json(user);
            
        } catch (error) {
            
        }
    }


}