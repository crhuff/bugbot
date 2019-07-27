'use strict';
module.exports = (sequelize, DataTypes) => {
	var Users = sequelize.define('Users',
		{
			ID: {
				notNull: true,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			UserString: {
				notNull: true,
				type: DataTypes.STRING
			},
			ServerID: {
				notNull: true,
				type: DataTypes.INTEGER
			}
		}, {
			freezeTableName: true,
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['UserString', 'ServerID']
				}
			]
		});
	Users.associate = function (models) {
		// associations can be defined here
		Users.belongsTo(models.Servers, { foreignKey: 'ID', sourceKey: 'ServerID' });
		Users.hasMany(models.Admins, { foreignKey: 'UserID', sourceKey: 'ID' });
		Users.hasMany(models.PendingFacts, { foreignKey: 'UserID', sourceKey: 'ID' });
	};
	return Users;
};