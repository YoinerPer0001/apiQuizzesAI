import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";
import Questions from "./questionsModel.js";


class Answers extends Model { }

Answers.init({
    answer_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    question_id: {
        type: DataTypes.UUID,
    },
    text: {
        type: DataTypes.TEXT,
    },
    is_correct : {
        type: DataTypes.BOOLEAN
    }

}, {sequelize: db, modelName: "answers"})

Questions.hasMany(Answers, {foreignKey: "question_id", as: "question"})
Answers.belongsTo(Questions,{foreignKey: "question_id", as: "question"})

export default Answers;