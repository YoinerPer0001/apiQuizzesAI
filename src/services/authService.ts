import authRepository from "../repository/authRepository.js";

class AuthService {
    async login(user_id: string, email: string, name: string): Promise<{code: number, message: string, data: any}> {
        
        //verify if user exist
        const exist = await authRepository.findUserById(user_id)
        
        if(exist == null){ //user dont exist
            const data = {
                user_id: user_id,
                email: email,
                name: name,
            }
            //register
            const created = await authRepository.createUser(data)
            if(!created){
                return {code: 500, message:"Error to register user", data: {}}
            }
            const sendData = {
                user_id: created.dataValues.user_id,
                attempts_remaining: parseInt(created.dataValues.attempts_remaining),
                isPremium: created.dataValues.isPremium,
            }
            return {code: 200, message:"Success registered", data: sendData} 

        }else{

            const sendData = {
                user_id: exist.dataValues.user_id,
                attempts_remaining: parseInt(exist.dataValues.attempts_remaining),
                isPremium: exist.dataValues.isPremium,
            }

            //login 
            console.log("logueado con exito")
            return {code: 201, message:"", data: sendData}  

        }

    }
}

export default new AuthService;