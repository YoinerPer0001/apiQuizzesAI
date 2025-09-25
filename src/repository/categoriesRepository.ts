import type { CreationAttributes, Transaction } from "sequelize";
import Categories from "../models/categoriesModel.js";
import { dataResponseExclude } from "../core/utils/dataExclude.js";


class CategoriesRepository {

    async findById(id:string, options?: {transaction?: Transaction | null}) : Promise<Categories | null> {
        return await Categories.findByPk(id, {transaction: options?.transaction ?? null})
    }

    async findByName(name:string) : Promise<Categories | null> {
        return await Categories.findOne({where: {text:name}})
    }

    async getAll() : Promise<Categories[]> {
        return await Categories.findAll({attributes : {exclude: dataResponseExclude}})
        
    }

    async create(category: CreationAttributes<Categories>): Promise<Categories>{
        return await Categories.create(category)
    }

    async update(id:string, data:Partial<CreationAttributes<Categories>>): Promise<number>{
        const [affectedCount] = await Categories.update(data, {where: {cat_id: id}})
        return affectedCount
    }

    async deleteCat(id:string) : Promise<number>{
        return await Categories.destroy({where: {cat_id: id}})
    }

}

export default new CategoriesRepository;