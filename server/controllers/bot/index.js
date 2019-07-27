var db = require('../../database/models');
var Bots = db.Bots;
var Facts = db.Facts;
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var moment = require('moment');

exports.findBot = (BotName, ServerID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var botInfo = await Bots.findOne({
				where: {
					BotName,
					ServerID
				}
			});

			if (botInfo) {
				resolve(botInfo);
			} else {
				newErr = new Error('Bot doesn\'t exist');
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.changeMaxTime = (botID, newTime) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var botInfo = await Bots.update(
				{
					BotTimer: newTime
				},
				{
					where: {
						ID: botID
					}
				}
			);

			if (botInfo) {
				resolve(botInfo);
			} else {
				newErr = new Error('Bot doesn\'t exist');
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.shareFact = (botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var randomFact = await Facts.findAll({
				where: {
					BotID: botID
				},
				order: [[Sequelize.fn('RANDOM')]],
				limit: 1
			});
			var botInfo = await Bots.findOne({
				where: {
					ID: botID
				}
			});
			if (randomFact.length > 0) {
				resolve(`${botInfo.RoleID} ${randomFact[0].FactString}`);
			} else {
				newErr = new Error('No facts stored yet for this bot');
				newErr.display = true;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			console.log(err);

			reject(err);
		}
	});
};

exports.checkBotFacts = (client) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			
			var bots = await Bots.findAll({
				where: {
					BotTimer: {
						[Op.gt]: 0
					}
				}
			});
			await Promise.all(bots.map(async bot => {
				var lastProcess = moment(new Date(bot.LastRandomFact)).add(bot.BotTimer, 'm').toDate();
				
				if (lastProcess < Date.now()) {
					
					var channel = client.channels.find('id', bot.ChannelRoom);
					var randomFact = await this.shareFact(bot.ID);

					await Bots.update({
						LastRandomFact: new Date()
					}, {
						where: {
							ID: bot.ID
						}
					});
					channel.send(randomFact);
					return;
				}
			}));
		} catch (err) {
			console.log(err);

			reject(err);
		}
	});
};