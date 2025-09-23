import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";
import User_Quiz_Attempts from "./user_quiz_attempModel.js";
import Questions from "./questionsModel.js";
import Answers from "./answersModel.js";


class User_Answers extends Model { }

User_Answers.init({
    user_answer_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    attempt_id: {
        type: DataTypes.UUID,
    },
    question_id: {
        type: DataTypes.UUID,
    },
    answer_id: {
        type: DataTypes.UUID,
    }
}, {sequelize: db, modelName: "user_answers"})

User_Quiz_Attempts.hasMany(User_Answers, {foreignKey: "attempt_id", as: "attempt"})
User_Answers.belongsTo(User_Quiz_Attempts, {foreignKey: "attempt_id", as: "attempt"})

Questions.hasMany(User_Answers, {foreignKey: "question_id", as: "question"})
User_Answers.belongsTo(Questions, {foreignKey: "question_id", as: "question"})

Answers.hasMany(User_Answers, {foreignKey :"answer_id", as: "answer"})
User_Answers.belongsTo(Answers, {foreignKey: "answer_id", as: "answer_id"})

export default User_Answers;