import { DataTypes, Model } from "sequelize"
import { db } from "../core/db.js"

class User extends Model { }

// Cuando se crea un user, algunos campos pueden ser opcionales
// interface UserCreationAttributes extends Optional<UserAttributes, "attempts_remaining" | "last_attempt_reset"> {}

User.init({
    user_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
    },
    attempts_remaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    last_attempt_reset: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    rol: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user"
    }
},
    {
        modelName: 'users',
        sequelize: db,
    },

)

export default User;

