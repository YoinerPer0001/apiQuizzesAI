import CategoryTranslations from "../models/categoryTranslations.js";


class CategoryTranslationsRepository {

    async getCategoryByLang(cat_id: string, code:string): Promise<CategoryTranslations | null> {
        return await CategoryTranslations.findOne({where: {category_id: cat_id, code}})
    }

    async getAllCategoryByCode(code:string): Promise<CategoryTranslations[] | null> {
        return await CategoryTranslations.findAll({where: {code}})
    }
}

export default new CategoryTranslationsRepository();