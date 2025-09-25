import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";
import Categories from "./categoriesModel.js";

class Quizzes extends Model {}

Quizzes.init({
    quiz_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    creator_id:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title : {
        type: DataTypes.STRING(255),
    },
    language: {
        type: DataTypes.STRING(100),
    },
    is_public : {
        type: DataTypes.BOOLEAN,
    },
    difficult: {
        type: DataTypes.ENUM("hard", "medium", "easy")
    },
    category_id: {
        type: DataTypes.UUID,
    },
    resources: {
        type: DataTypes.ENUM("handwritten", "pdf"),
    }
},{
    modelName: "quizzes",
    sequelize: db
})

User.hasMany(Quizzes, {foreignKey: "creator_id", as: "creator"})
Quizzes.belongsTo(User, {foreignKey: "creator_id", as: "creator"})

Categories.hasMany(Quizzes, {foreignKey: "category_id", as: "category"})
Quizzes.belongsTo(Quizzes, {foreignKey: "category_id", as: "category"})

export default Quizzes;