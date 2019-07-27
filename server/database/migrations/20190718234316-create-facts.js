'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Facts', {
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
			FactString: {
				allowNull: false,
				type: Sequelize.STRING
			}
		}).then(() => queryInterface.addIndex('Facts', ['BotID', 'FactString'], { unique: true }));
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Facts');
	}
};