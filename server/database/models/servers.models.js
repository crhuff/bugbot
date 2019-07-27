'use strict';
module.exports = (sequelize, DataTypes) => {
	var Servers = sequelize.define('Servers',
		{
			ID: {
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			ServerString: {
				notNull: true,
				type: DataTypes.STRING
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['ServerString']
				}
			]
		});
	Servers.associate = function (models) {
		// associations can be defined here
		Servers.hasMany(models.Users, { foreignKey: 'ServerID', sourceKey: 'ID' });
		Servers.hasMany(models.Bots, { foreignKey: 'ServerID', sourceKey: 'ID' });
	};
	return Servers;
};