import User from "../../models/userModel.js";

class AuthRepository {

    async findUserById(user_id: string) {
        return await User.findByPk(user_id);
    }

    async createUser(user_id: string) {
        return await User.create({ user_id: user_id });
    }

    async resetUserAttempts(user_id: string) {
        const updated = await User.update({ attempts_remaining: 1, last_attempt_reset: new Date() }, {where:{ user_id: user_id }});
    }

}

export default new AuthRepository();