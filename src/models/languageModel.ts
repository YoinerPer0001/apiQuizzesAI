import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";



class Languages extends Model {}

Languages.init(
    {
       language_id:{
        type: DataTypes.UUIDV4,
        primaryKey:true,
        defaultValue: UUIDV4,
        allowNull: false
       },
       name: {
        type:DataTypes.STRING(50),
        allowNull: false
       },
       nativeName: {
        type:DataTypes.STRING(50),
        allowNull: false
       }
    },{sequelize: db, modelName: "languages"}
)

export default Languages;