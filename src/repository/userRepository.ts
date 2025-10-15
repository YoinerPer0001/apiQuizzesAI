import type { CreationAttributes, Transaction } from "sequelize";
import User from "../models/userModel.js";

const excludeInfo = ["createdAt", "updatedAt", "rol"]

class UserRepository {
    async findById(id:string, options?: {transaction:Transaction | null}): Promise<User | null>  {
        return await User.findByPk(id, {transaction: options?.transaction ?? null, attributes: {exclude: ["createdAt", "updatedAt", "rol", "name", "email", "premium_expiration"]}})
    }

    async getAll() {
        return await User.findAll()
    }

    async create(user:CreationAttributes<User>) : Promise<User | null> {
        return await User.create(user)
    }

    async update(id:string, data:Partial<CreationAttributes<User>>, options?:{transaction:Transaction | null}) : Promise<number> {
        const [affectedRows] = await User.update(data, {where: {user_id: id}, transaction: options?.transaction ?? null})
        return affectedRows
    }

    async drop(id:string) : Promise<number> {
        return await User.destroy({where: {user_id : id}})
    }
}

export default new UserRepository;