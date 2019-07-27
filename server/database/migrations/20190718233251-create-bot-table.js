'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Bots', {
			ID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			ServerID: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Servers',
					key: 'ID'
				}
			},
			BotName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			BotTimer: {
				type: Sequelize.INTEGER
			},
			RoleID: {
				allowNull: false,
				type: Sequelize.STRING
			},
			LastRandomFact: {
				allowNull: false,
				type: Sequelize.DATE
			},
			ChannelRoom: {
				allowNull: false,
				type: Sequelize.STRING
			}
		}).then(() => queryInterface.addIndex('Bots', ['ServerID', 'BotName'], { unique: true }));
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Bots');
	}
};