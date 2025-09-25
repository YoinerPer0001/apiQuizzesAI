import type { CreationAttributes } from "sequelize";
import Languages from "../models/languageModel.js";
import { dataResponseExclude } from "../core/utils/dataExclude.js";


class LanguageRepository {

    async create(data:CreationAttributes<Languages>): Promise<Languages | null>{
        return await Languages.create(data)
    }

    async getById(id:string): Promise<Languages | null>{
        return await Languages.findByPk(id, {attributes: {exclude: dataResponseExclude}})
    }

    async getAll(): Promise<Languages[]>{
        return await Languages.findAll({attributes: {exclude: dataResponseExclude}})
    }

    async findByName(name:string) : Promise<Languages | null> {
        return await Languages.findOne({where: {name:name}})
    }
}

export default new LanguageRepository;