import type { Request, Response } from "express";


class AuthController {

    public login(req : Request, res: Response){
        try {

            console.log("Hello World");
            res.status(200).json({message: "Login route"});
            
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
    }
}

export default new AuthController;