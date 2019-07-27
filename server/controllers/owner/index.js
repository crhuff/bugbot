var db = require('../../database/models');
var Servers = db.Servers;
var Bots = db.Bots;
var Admins = db.Admins;

// Attempt to create the server if it doesnt exist
exports.createServer = (serverID) => {
	return new Promise(async (resolve, reject) => {
		try {
			var [info,] = await Servers
				.findOrCreate({
					where: {
						ServerString: serverID
					},
					defaults: {
						ServerString: serverID
					}
				});
			resolve(info);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

// Check if bot on the server with same name exists, otherwise create it
exports.createBot = (ServerID, BotName, BotTimer, RoleID, ChannelRoom) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var [info, creationStatus] = await Bots
				.findOrCreate({
					where: {
						ServerID,
						BotName
					},
					defaults: {
						ServerID,
						BotName,
						BotTimer,
						RoleID,
						ChannelRoom,
						LastRandomFact: new Date()
					}
				});

			if (creationStatus) {
				resolve(info);
			} else {
				newErr = new Error('Bot already exists on this server');
				newErr.display = true;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

// Add all admins (plus person who created bot);
exports.createAdmins = (BotID, modIDs) => {
	return new Promise(async (resolve, reject) => {
		try {
			var adminData = await Promise.all(
				modIDs
					.filter((item, index) => {
						return modIDs.indexOf(item) === index;
					}));

			adminData = await Promise.all(

				adminData.map(async mod => {
					console.log(mod);
					var [info,] = await Admins
						.findOrCreate({
							where: {
								BotID,
								UserID: mod
							},
							defaults: {
								BotID,
								UserID: mod
							}
						});
					return info;
				})
			);
			if (adminData) {
				resolve(adminData);
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.addModerator = (botID, newModID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {

			var [info,creationStatus] = await Admins
				.findOrCreate({
					where: {
						BotID: botID,
						UserID: newModID
					},
					defaults: {
						BotID: botID,
						UserID: newModID
					}
				});

			if (creationStatus) {
				resolve(info);
			} else {
				newErr = new Error('Mod already exists on this server');
				newErr.display = true;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};