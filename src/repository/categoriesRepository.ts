import type { CreationAttributes } from "sequelize";
import Categories from "../models/categoriesModel.js";

const exludeAttr = ["createdAt","updatedAt"]

class CategoriesRepository {

    async findById(id:string) : Promise<Categories | null> {
        return await Categories.findByPk(id, {attributes : {exclude: exludeAttr}})
    }

    async findByName(name:string) : Promise<Categories | null> {
        return await Categories.findOne({where: {text:name}})
    }

    async getAll() : Promise<Categories[]> {
        return await Categories.findAll({attributes : {exclude: exludeAttr}})
        
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