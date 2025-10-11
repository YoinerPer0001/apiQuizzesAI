import { Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";
import Quizzes from "./quizzesModel.js";

class User_Quiz_Attempts extends Model { }

User_Quiz_Attempts.init({
    attempt_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quiz_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
    }

}, {
    modelName: 'user_quiz_attempts',
    sequelize: db,
})

User.hasMany(User_Quiz_Attempts, {foreignKey : "user_id", as: "user"})
User_Quiz_Attempts.belongsTo(User, {foreignKey : "user_id", as: "user"})

Quizzes.hasMany(User_Quiz_Attempts, {foreignKey : "quiz_id", as: "quiz"})
User_Quiz_Attempts.belongsTo(Quizzes, {foreignKey : "quiz_id", as: "quiz"})

export default User_Quiz_Attempts;