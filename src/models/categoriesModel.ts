import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";


class Categories extends Model {}

Categories.init({
    cat_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},{
    modelName: "categories",
    sequelize: db
})

export default Categories;