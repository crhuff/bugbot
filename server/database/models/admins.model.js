'use strict';
module.exports = (sequelize, DataTypes) => {
	var Admins = sequelize.define('Admins',
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				notNull: true,
				autoIncrement: true,
			},
			UserID: {
				type: DataTypes.INTEGER,
				notNull: true,
			},
			BotID: {
				type: DataTypes.INTEGER,
				notNull: true,
			},
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['UserID', 'BotID']
				}
			]
		});
	Admins.associate = function (models) {
		// associations can be defined here
		Admins.belongsTo(models.Bots, { foreignKey: 'ID', sourceKey: 'BotID' });
		Admins.belongsTo(models.Users, { foreignKey: 'ID', sourceKey: 'UserID' });
	};
	return Admins;
};