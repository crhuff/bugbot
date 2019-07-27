'use strict';
module.exports = (sequelize, DataTypes) => {
	var Facts = sequelize.define('Facts',
		{
			ID: {
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			BotID: {
				notNull: true,
				type: DataTypes.INTEGER
			},
			FactString: {
				notNull: true,
				type: DataTypes.INTEGER
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['BotID', 'FactString']
				}
			]
		}
	);
	Facts.associate = function (models) {
		// associations can be defined here
		Facts.belongsTo(models.Bots, { foreignKey: 'ID', sourceKey: 'BotID' });
	};
	return Facts;
};