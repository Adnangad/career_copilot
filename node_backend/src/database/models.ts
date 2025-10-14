import { Model, DataTypes } from "sequelize";
import { sequelize } from "./init";

class Jobs extends Model {
    declare id: number;
    declare title: string;
    declare company: string;
    declare description: string;
    declare requirements: string;
    declare category: string;
    declare tags: string;
    declare link: string;
    declare created_at: Date;
}

Jobs.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
    },
    company: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    requirements: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
},
    {
        sequelize: sequelize,
        timestamps: false,
        tableName: "jobs",
        indexes: [
            {
                unique: true,
                fields: ['title', 'company']
            }
        ]
    });

export default Jobs