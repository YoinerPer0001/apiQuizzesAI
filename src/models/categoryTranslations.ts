import { DataTypes, Model } from "sequelize";
import { db } from "../core/db.js";
import Categories from "./categoriesModel.js";


class CategoryTranslations extends Model {}

CategoryTranslations.init({
    id: {
        type:DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },

    code: {
        type: DataTypes.STRING(10),
        allowNull: false

    },
    translation: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false
    }

}, { modelName: "category_translations" , sequelize: db })


Categories.hasMany(CategoryTranslations, {foreignKey: "category_id", as: "translations"})
CategoryTranslations.belongsTo(Categories, {foreignKey: "category_id", as: "category"})

export default CategoryTranslations;