var db = require('../../database/models');
var Users = db.Users;
var Servers = db.Servers;

exports.createUsers = (serverID, userIDs) => {
	return new Promise(async (resolve, reject) => {
		try {
			var newUsers = [];
			var uniqueUserIDs = await Promise.all(
				userIDs
					.filter((item, index) => {
						return userIDs.indexOf(item) === index;
					}));

			await Promise.all(
				uniqueUserIDs.map(async user => {
					var [info] = await Users
						.findOrCreate({
							where: {
								UserString: user,
								ServerID: serverID
							},
							defaults: {
								UserString: user,
								ServerID: serverID
							}
						});
					newUsers.push(info);
					return;

				})
			);

			if (newUsers) {
				resolve(newUsers);
			}
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};


exports.createUser = (serverID, userString) => {
	return new Promise(async (resolve, reject) => {
		try {
			var [info,] = await Users
				.findOrCreate({
					where: {
						UserString: userString,
						ServerID: serverID
					},
					defaults: {
						UserString: userString,
						ServerID: serverID
					}
				});
			resolve(info);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};



exports.findServer = (ServerString) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		try {
			var serverInfo = await Servers.findOne({
				where: {
					ServerString
				}
			});

			if (serverInfo) {
				resolve(serverInfo);
			} else {
				newErr = new Error('Server doesn\'t exist');
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.findUser = (serverID, userString) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var info = await Users
				.findOne({
					where: {
						UserString: userString,
						ServerID: serverID
					}
				});

			if (info) {
				resolve(info);
			} else {
				newErr = new Error('User doesn\'t exist');
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

exports.findUserByID = (serverID, userID) => {
	return new Promise(async (resolve, reject) => {
		var newErr;

		try {
			var info = await Users
				.findOne({
					where: {
						ID: userID,
						ServerID: serverID
					}
				});

			if (info) {
				resolve(info);
			} else {
				newErr = new Error('User doesn\'t exist');
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};