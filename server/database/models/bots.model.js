'use strict';
module.exports = (sequelize, DataTypes) => {
	var Bots = sequelize.define('Bots',
		{
			ID: {
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			ServerID: {
				notNull: true,
				type: DataTypes.INTEGER
			},
			BotName: {
				notNull: true,
				type: DataTypes.STRING
			},
			BotTimer: {
				notNull: true,
				type: DataTypes.INTEGER
			},
			RoleID: {
				notNull: true,
				type: DataTypes.STRING
			},
			LastRandomFact: {
				notNull: true,
				type: DataTypes.DATE
			},
			ChannelRoom: {
				notNull: true,
				type: DataTypes.STRING
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['ServerString', 'BotName']
				}
			]
		});
	Bots.associate = function (models) {
		// associations can be defined here
		Bots.belongsTo(models.Servers, { foreignKey: 'ID', sourceKey: 'ServerID' });
		Bots.hasMany(models.Admins, { foreignKey: 'BotID', sourceKey: 'ID' });
		Bots.hasMany(models.Facts, { foreignKey: 'BotID', sourceKey: 'ID' });
		Bots.hasMany(models.PendingFacts, { foreignKey: 'BotID', sourceKey: 'ID' });
	};
	return Bots;
};