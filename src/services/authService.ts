import authRepository from "../repository/authRepository.js";

class AuthService {
    async login(user_id: string){
        
        //verify if user exist
        const exist = await authRepository.findUserById(user_id)
        if(exist == null){ //user dont exist
            //register
            const created = await authRepository.createUser(user_id)
            if(!created){
                return {code: 500, message:"Error to register user", data: {}}
            }
            return {code: 200, message:"Success registered", data: {attempts_remaining: parseInt(created.dataValues.attempts_remaining)}} 

        }else{

            //login 
            console.log("logueado con exito")
            return {code: 201, message:"", data: {attempts_remaining: parseInt(exist.dataValues.attempts_remaining)}}  

        }

    }
}

export default new AuthService;