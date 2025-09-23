import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";
import Quizzes from "./quizzesModel.js";


class Questions extends Model { }

Questions.init({
    question_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    quiz_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
    },
    time_limit: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.ENUM("mopt", "tf", "both")
    }
}, { sequelize: db, modelName: "questions" })

Quizzes.hasMany(Questions, {foreignKey: "quiz_id", as: "quiz"})
Questions.belongsTo(Quizzes, {foreignKey: "quiz_id", as: "quiz"})

export default Questions;