"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false,
                },
            });
            models.Post.hasMany(models.Comment, {
                onDelete: "cascade",
            });
        }
    }
    Post.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            articleUrl: {
                type: DataTypes.STRING,
            },
        },

        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
