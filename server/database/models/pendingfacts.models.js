'use strict';
module.exports = (sequelize, DataTypes) => {
	var PendingFacts = sequelize.define('PendingFacts',
		{
			ID: {
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			BotID: {
				type: DataTypes.INTEGER,
				notNull: true,
			},
			UserID: {
				type: DataTypes.INTEGER,
				notNull: true,
			},
			FactString: {
				type: DataTypes.STRING,
				notNull: true,
			},
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['BotID', 'FactString']
				}
			]
		});
	PendingFacts.associate = function (models) {
		// associations can be defined here
		PendingFacts.belongsTo(models.Bots, { foreignKey: 'ID', sourceKey: 'BotID' });
		PendingFacts.belongsTo(models.Users, { foreignKey: 'ID', sourceKey: 'UserID' });
	};
	return PendingFacts;
};