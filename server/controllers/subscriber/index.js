var db = require('../../database/models');
var Bots = db.Bots;
var Users = db.Users;
var Admins = db.Admins;
var PendingFacts = db.PendingFacts;

exports.subscribe = (msg, userID, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var userInfo = await Users.findOne({
				where: {
					ID: userID
				}
			});

			var userString = userInfo.UserString;
			userString = userString.replace(/\W/g, '');

			var botInfo = await Bots.findOne({
				where: {
					ID: botID
				}
			});

			var botRole = botInfo.RoleID;
			botRole = botRole.replace(/\W/g, '');

			if (msg.guild.member(userString).roles.find(r => r.id === botRole)) {
				newErr = new Error('You have already subscribed');
				newErr.debug = false;
				newErr.display = true;
				throw newErr;
			} else {
				msg.guild.member(userString).addRole(botRole);
			}
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

exports.checkSubscriberStatus = (msg, userID, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var userInfo = await Users.findOne({
				where: {
					ID: userID
				}
			});

			var userString = userInfo.UserString;
			userString = userString.replace(/\W/g, '');

			var botInfo = await Bots.findOne({
				where: {
					ID: botID
				}
			});

			var botRole = botInfo.RoleID;
			botRole = botRole.replace(/\W/g, '');

			if (msg.guild.member(userString).roles.find(r => r.id === botRole)) {
				resolve(true);
			} else {
				newErr = new Error(`Please subscribe to ${botInfo.BotName}`);
				newErr.display = true;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.unsubscribe = (msg, userID, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var userInfo = await Users.findOne({
				where: {
					ID: userID
				}
			});

			var userString = userInfo.UserString;
			userString = userString.replace(/\W/g, '');

			var botInfo = await Bots.findOne({
				where: {
					ID: botID
				}
			});

			await Admins.destroy({
				where: {
					UserID: userID,
					BotID: botID
				}
			});

			var botRole = botInfo.RoleID;
			botRole = botRole.replace(/\W/g, '');

			if (msg.guild.member(userString).roles.find(r => r.id === botRole)) {
				msg.guild.member(userString).removeRole(botRole);
				resolve(true);
			} else {
				newErr = new Error(`You aren't subscribed, if you want to, try !${botInfo.BotName} subscribe`);
				newErr.debug = false;
				newErr.display = true;
				throw newErr;
			}
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

exports.suggestFact = (botID, userID, suggestedFactString) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			console.log(3);
			var [, creationStatus] = await PendingFacts.findOrCreate({
				where: {
					BotID: botID,
					UserID: userID,
					FactString: suggestedFactString
				},
				defaults: {
					BotID: botID,
					UserID: userID,
					FactString: suggestedFactString
				}
			});

			if (creationStatus) {
				resolve();
			} else {
				newErr = new Error('Fact is already suggested to this bot... By YOU');
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