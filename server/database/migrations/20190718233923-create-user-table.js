'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			ID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			UserString: {
				allowNull: false,
				type: Sequelize.STRING
			},
			ServerID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Servers',
					key: 'ID'
				}
			}
		}).then(() => queryInterface.addIndex('Users', ['UserString', 'ServerID'], { unique: true }));
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Users');
	}
};