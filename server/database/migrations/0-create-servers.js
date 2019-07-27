'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Servers', {
			ID: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			ServerString: {
				type: Sequelize.STRING,
				allowNull: false
			}
		}).then(() => queryInterface.addIndex('Servers', ['ServerString'], { unique: true }));
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Servers');
	}
};