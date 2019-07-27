var db = require('../../database/models');
var Admins = db.Admins;
var Users = db.Users;
var Bots = db.Bots;
var Facts = db.Facts;
var PendingFacts = db.PendingFacts;
exports.checkAdminStatus = (userID, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var info = await Admins
				.findOne({
					where: {
						UserID: userID,
						BotID: botID
					}
				});

			if (info) {
				resolve(info);
			} else {
				newErr = new Error('You aren\'t an admin');
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

// var subscriberList = await Admin.listSubscribers(serverInfo.ID, botInfo.ID);
exports.listSubscribers = (msg, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var info = await Bots
				.findOne({
					where: {
						ID: botID
					}
				});

			var RoleID = info.RoleID;
			var userRole = RoleID.replace(/\W/g, '');
			var parsedMembers = [];

			await Promise.all(
				msg.guild.members
					.filter(async member => {
						var roles = await Promise.all(member.roles
							.filter(role => {
								return (role.id === userRole);
							}));
						if (roles.length > 0) {
							parsedMembers.push(member.displayName);
						}
					})
			);

			resolve(parsedMembers);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

exports.deleteBot = (botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			await Admins.destroy({
				where: {
					BotID: botID
				}
			});

			await Facts.destroy({
				where: {
					BotID: botID
				}
			});

			await Bots.destroy({
				where: {
					ID: botID
				}
			});

			resolve();

		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

exports.addFact = (botID, factString) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {

			var [, creationStatus] = await Facts.findOrCreate({
				where: {
					BotID: botID,
					FactString: factString
				},
				defaults: {
					BotID: botID,
					FactString: factString
				}
			});

			if (creationStatus) {
				resolve();
			} else {
				newErr = new Error('Fact is already added to this bot');
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

exports.listFacts = (botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var factList = await Facts
				.findAll({
					where: {
						BotID: botID
					}
				});

			if (factList.length > 0) {
				var factString = '';
				await factList.map(fact => { factString = factString + 'ID ' + fact.ID + ' | fact ' + fact.FactString + '\n'; });
				resolve(factString);
			} else {
				newErr = new Error('There are no facts yet for your bot, try adding some');
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

exports.editFact = (botID, factID, newFactString) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var updated = await Facts.update(
				{
					FactString: newFactString
				}, {
					where: {
						ID: factID,
						BotID: botID,
					},
				});

			if (updated) {
				resolve();
			} else {
				newErr = new Error('Fact isn\'t on this bot');
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

exports.destroyFact = (botID, factID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var updated = await Facts.destroy({
				where: {
					ID: factID,
					BotID: botID,
				}
			}
			);

			if (updated) {
				resolve();
			} else {
				newErr = new Error('Fact isn\'t on this bot');
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


exports.listSuggestions = (msg, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {

			var factList = await PendingFacts
				.findAll({
					where: {
						BotID: botID
					}
				});


			var userList = {};
			await Promise.all(factList.map(async fact => {
				var user = await Users.findOne({
					where: {
						ID: fact.UserID
					}
				});
				userList[fact.UserID] = await msg.guild.fetchMember(user.UserString.replace(/\W/g, ''));

			}));

			if (factList.length > 0) {
				var factString = '';
				await factList.map(fact => {
					factString = factString + 'ID ' + fact.ID + ' | user ' + userList[fact.UserID] + ' | fact ' + fact.FactString + '\n'; 
				});
				
				resolve(factString);
			} else {
				newErr = new Error('There are no suggested facts yet for your bot, try adding some');
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


exports.approveFact = (botID, approvedFactID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {

			var pendingFact = await PendingFacts.findOne({
				where: {
					ID: approvedFactID,
					BotID: botID
				}
			});

			if (pendingFact) {

				var [, creationStatus] = await Facts.findOrCreate({
					where: {
						BotID: botID,
						FactString: pendingFact.FactString
					},
					defaults: {
						BotID: botID,
						FactString: pendingFact.FactString
					}
				});

				await PendingFacts.destroy({
					where: {
						ID: approvedFactID
					}
				});

				if (creationStatus) {
					resolve();
				} else {
					newErr = new Error('Fact is already added to this bot');
					newErr.display = true;
					newErr.debug = false;
					throw newErr;
				}

			} else {
				newErr = new Error('That fact doesn\'t exist for this bot');
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

exports.declineFact = (botID, declinedFactID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var updated = await PendingFacts.destroy({
				where: {
					ID: declinedFactID,
					BotID: botID,
				}
			}
			);

			if (updated) {
				resolve();
			} else {
				newErr = new Error('Suggested fact isn\'t on this bot');
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

exports.listModerators = (msg, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {

			var adminList = await Admins
				.findAll({
					where: {
						BotID: botID
					}
				});
			

			var userList = {};
			await Promise.all(adminList.map(async admin => {
				var user = await Users.findOne({
					where: {
						ID: admin.UserID
					}
				});
				userList[admin.UserID] = await msg.guild.fetchMember(user.UserString.replace(/\W/g, ''));

			}));

			if (adminList.length > 0) {
				var adminString = '';
				await adminList.map(admin => {
					adminString = adminString + 'ID ' + admin.ID + ' | user ' + userList[admin.UserID] + '\n'; 
				});
				resolve(adminString);
			} else {
				newErr = new Error('There are no suggested facts yet for your bot, try adding some');
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

exports.deleteFact = (botID, factID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var updated = await Facts.destroy({
				where: {
					ID: factID,
					BotID: botID,
				}
			}
			);

			if (updated) {
				resolve();
			} else {
				newErr = new Error('Attempted fact to delete isn\'t on this bot');
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


exports.demodUser = (deletedModID, botID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var updated = await Admins.destroy({
				where: {
					UserID: deletedModID,
					BotID: botID,
				}
			}
			);

			if (updated) {
				resolve();
			} else {
				newErr = new Error('Attempted fact to delete isn\'t on this bot');
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