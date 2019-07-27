'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Admins', {
			ID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			UserID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'ID'
				}
			},
			BotID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Bots',
					key: 'ID'
				}
			}
		}).then(() => queryInterface.addIndex('Admins', ['UserID', 'BotID'], { unique: true }));
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Admins');
	}
};