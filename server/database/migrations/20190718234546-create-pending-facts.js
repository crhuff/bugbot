'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('PendingFacts', {
			ID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			BotID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Bots',
					key: 'ID'
				}
			},
			UserID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'ID'
				}
			},
			FactString: {
				allowNull: false,
				type: Sequelize.STRING
			}
		}).then(() => queryInterface.addIndex('PendingFacts', ['BotID', 'FactString'], { unique: true }));
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('PendingFacts');
	}
};