const roles = require('./roles.json'); // Imports local.settings.json
const Owner = require('./controllers/owner'); // Controls Owner related things
const Other = require('./controllers/other'); // Controls misc tasks that dont under anything else
const Bot = require('./controllers/bot'); // Controls bot tasks
const Subscriber = require('./controllers/subscriber'); // Controls subscriber
const Admin = require('./controllers/Admin'); // Controls subscriber

/**
 * parseMessage
 * 
 * @param {object} msg Message sent to server
 * @param {object} client Client object from discord
 * 
 * @returns {Promise} returns error or message or a return message with channel property, dm property, message property
 *  error : {
 *      debug : {bool} // does it send to debug ID
 *      display : {bool} // does it respond in the server
 *      message : {string} // error message
 *  } 
 *  message : {
 *      text : {string} // message to share with user
 *      messageType : {string} // 'channel' responds to channel, 'dm' responds directly to user, 'reply' responds to user in channel
 *  }
 * 
 */
exports.parseMessage = (msg, client) => {
	var newErr;
	var message;

	return new Promise(async (resolve, reject) => {
		try {
			var serverInfo;
			var botInfo;

			// Make sure the command is formatted with exclamation, or ignore it
			if (msg.content.charAt(0) === '!') {
				var messageArray = msg.content.split(' ').filter((current) => current != '');
				var botName = messageArray[0].substring(1);
				var command = String(messageArray[1]).toLowerCase();

				var serverString = (msg.channel.guild) ? msg.channel.guild.id : null;

				var userID = (`<@${msg.author.id}>`);

				if (botName !== 'factbot') {
					serverInfo = await Other.findServer(serverString); // Make sure server is logged already for the bot
					botInfo = await Bot.findBot(botName, serverInfo.ID); // If bot exists, then check commands
				}

				await this.checkAuth(userID, serverString, botName, command, msg); // Pass to local check auth command that will pass to necessary controller

				// If specifically calling out factbot, then check available commands, otherwise see if bot called out exists
				if (botName === 'factbot') {
					switch (command) {
						case 'create':
							var newBotName = messageArray[2];
							var botTimer = messageArray[3];
							var role = messageArray[4];
							var moderators = messageArray.slice(5, messageArray.length + 1);
							var channel = msg.channel.id;

							if (!newBotName || botTimer == null || botTimer == 'undefined' || !role) {
								newErr = new Error('Not enough arguments for command');
								newErr.display = true;
								newErr.debug = false;
								throw newErr;
							}

							moderators.push(userID); // format like how it's passed

							serverInfo = await Owner.createServer(serverString); // Attempt to create the server if it doesnt exist

							var serverID = serverInfo.ID; // get the db id of the server

							botInfo = await Owner.createBot(serverID, newBotName, botTimer, role, channel);    // Check if bot on the server with same name exists, otherwise create it

							var botID = botInfo.ID; // get the db id of the bot

							var userInfo = await Other.createUsers(serverID, moderators); // create all the users

							var modIDs = userInfo.map(user => user.ID); // get list of all IDs made for users

							await Owner.createAdmins(botID, modIDs); // Add all admins (plus person who created bot);

							message = {
								text: `Successfully created ${newBotName}! See what you can do with !${newBotName} help`,
								messageType: 'reply'
							};

							resolve(message);
							break;
						case 'help':
							// Send user a list of things they can do with the bot
							message = {
								text: this.helpList('factbot'),
								messageType: 'channel'
							};
							resolve(message);
							break;
						default:
							newErr = new Error('Missing command: ' + msg.content);
							newErr.display = true;
							newErr.debug = false;
							throw newErr;
					}
				} else {
					if (command !== 'undefined' && command) {
						switch (command) {
							case 'subscribe':
								// Since bot + server exists, try to check if the user exists, otherwise make them
								// Check if the user is subscribed, if so subscribe them
								userInfo = await Other.createUser(serverInfo.ID, userID);
								await Subscriber.subscribe(msg, userInfo.ID, botInfo.ID);

								message = {
									text: 'You\'ve successfully subscribed!',
									messageType: 'reply'
								};

								resolve(message);
								break;
							case 'listsubscribers':
								// Since bot + server exists, and user has already been checked if they're admin
								// DM them a list of subscribers
								var subscriberList = await Admin.listSubscribers(msg, botInfo.ID);
								message = {
									text: `Here's a list of subscribers for ${botName}: ${subscriberList}`,
									messageType: 'dm'
								};

								resolve(message);

								break;
							case 'unsubscribe':
								userInfo = await Other.createUser(serverInfo.ID, userID);
								await Subscriber.unsubscribe(msg, userInfo.ID, botInfo.ID);
								message = {
									text: 'You\'ve successfully unsubscribed :(',
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'maxtime':
								var newTime = messageArray[2];
								await Bot.changeMaxTime(botInfo.ID, newTime);
								message = {
									text: `You've changed ${botName} message timer to ${newTime} seconds`,
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'delete':
								await Admin.deleteBot(botInfo.ID);
								message = {
									text: `So long cruel world, I will miss you -${botName}`,
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'newfact':
								var factString = msg.content.split(/"/)[1];
								if (factString == null) {
									newErr = new Error('Please share a fact with the class');
									newErr.display = true;
									newErr.debug = false;
									reject(newErr);
								}
								await Admin.addFact(botInfo.ID, factString);
								message = {
									text: 'You\'ve added a new fact',
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'listfacts':
								var factList = await Admin.listFacts(botInfo.ID);
								message = {
									text: factList,
									messageType: 'dm'
								};
								resolve(message);
								break;
							case 'editfact':
								var factID = messageArray[2];
								var newFactString = msg.content.split(/"/)[1];
								await Admin.editFact(botInfo.ID, factID, newFactString);
								message = {
									text: 'We at botcorp have updated your fact',
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'deletefact':
								var deletedFact = messageArray[2];
								await Admin.deleteFact(botInfo.ID, deletedFact);
								message = {
									text: 'Goodbye old fact, I hope you weren\'t wrong',
									messageType: 'reply'
								};
								resolve(message);
								break;
							case 'suggestfact':
								var suggestedFactString = msg.content.split(/"/)[1];

								if (suggestedFactString == null) {
									newErr = new Error('Please share a fact with the class');
									newErr.display = true;
									newErr.debug = false;
									reject(newErr);
								}

								userInfo = await Other.findUser(serverInfo.ID, userID);
								await Subscriber.suggestFact(botInfo.ID, userInfo.ID, suggestedFactString);

								message = {
									text: 'You\'ve suggested a new fact, I wonder if it\'s approved',
									messageType: 'reply'
								};

								resolve(message);
								break;
							case 'suggestions':
								var suggestedFactList = await Admin.listSuggestions(msg, botInfo.ID);
								message = {
									text: suggestedFactList,
									messageType: 'dm'
								};
								resolve(message);
								break;
							case 'approvefact':
								var approvedFactID = messageArray[2];
								await Admin.approveFact(botInfo.ID, approvedFactID);

								message = {
									text: 'New fact approved!...',
									messageType: 'reply'
								};

								resolve(message);
								break;
							case 'declinefact':
								var declinedFactID = messageArray[2];
								await Admin.declineFact(botInfo.ID, declinedFactID);

								message = {
									text: 'Must not have been a fact?',
									messageType: 'reply'
								};

								resolve(message);
								break;
							case 'addmoderator':

								var modString = messageArray[2];
								var newMod = await Other.findUser(serverInfo.ID, modString);

								await Owner.addModerator(botInfo.ID, newMod.ID);

								message = {
									text: `There's a new mod in town ${modString}`,
									messageType: 'reply'
								};

								resolve(message);
								break;
							case 'listmoderators':
								var moderatorsList = await Admin.listModerators(msg, botInfo.ID);

								message = {
									text: moderatorsList,
									messageType: 'dm'
								};

								resolve(message);
								break;
							case 'deletemoderator':
								var idToDelete = messageArray[2];
								var deletedMod = await Other.findUser(serverInfo.ID, idToDelete);


								if (userID === deletedMod.UserString) {
									await Admin.checkAdminStatus(deletedMod.ID, botInfo.ID);
									await Admin.demodUser(deletedMod.ID, botInfo.ID);

									message = {
										text: `You're no longer a mod ${deletedMod.UserString}`,
										messageType: 'reply'
									};

									resolve(message);
								} else {
									if (msg.member.hasPermission('MANAGE_GUILD')) {
										await Admin.demodUser(deletedMod.ID, botInfo.ID);

										message = {
											text: 'That user is no longer a mod',
											messageType: 'reply'
										};

										resolve(message);
									} else {
										newErr = new Error('You don\'t have permission to do that, you have to be able to manage the server');
										newErr.display = true;
										newErr.debug = false;
										throw newErr;
									}
								}
								break;
							case 'help':
								message = {
									text: this.helpList('other'),
									messageType: 'channel'
								};
								resolve(message);
								break;
							default:
								newErr = new Error('Missing command: ' + msg.content);
								newErr.display = true;
								newErr.debug = false;
								throw newErr;
						}
					} else {
						var sharedFact = await Bot.shareFact(botInfo.ID);
						message = {
							text: sharedFact,
							messageType: 'channel'
						};
						resolve(message);
					}
				}
			} else {
				newErr = new Error('Improperly formatted command: ' + msg.content);
				newErr.display = false;
				newErr.debug = false;
				throw newErr;
			}
		} catch (err) {
			reject(err);
		}
	});
};

exports.helpList = (botType) => {
	if (botType === 'factbot') {
		return `How to use factbot

		Server owner initialize 
		\`!factbot create <BotName> <MaxTimeSecondsBeforeTrigger> @Role [,<@Moderators>] | <@Moderator>\`
		
		Get more help 
		\`!factbot help\`
		
		Get more help about your bot 
		\`!<BotName> help\``;
	} else {
		return `How to use your personal factbot
		
		Add moderators (req: MANAGE_GUILD permission) 
		\`!<BotName> addmoderator [,<NewModerator>] | <NewModerator>\`
		
		List moderators (req: moderator) 
		\`!<BotName> listmoderators\`
		
		Delete moderators (req: can delete self, otherwise MANAGE_GUILD) 
		\`!<BotName> deletemoderator <@Moderator>\`
		
		Edit max minutes before triggering a random fact in the channel your bot was initialized in 
		\`!<BotName> maxtime <MaxTimeMinutesBeforeTrigger>\` 
		
		Adding random facts (req: MANAGE_GUILD permission): 
		\`!<BotName> newFact "<Fact>"\`
		
		Subscribing to the bot 
		\`!<BotName> subscribe\`
		
		List Subscibers from the bot (req: moderator) 
		\`!<BotName> listSubscribers\`
		Unsubscribe from the bot 
		\`!<BotName> unsubscribe\`
		
		Deleting the bot (req: MANAGE_GUILD) 
		\`!<BotName> delete\`
		
		Listing facts (req: moderator) 
		\`!<BotName> list\` Returns all facts with id's for reference
		
		Editing facts (req: moderator) 
		\`!<BotName> editFact <ID> "<New String>"\`
		
		Deleting facts (req: moderator) 
		\`!<BotName> deleteFact <ID>\`
		
		Suggesting facts 
		\`!<BotName> suggestFact "<New String>"\`
		
		Reviewing suggestions (req: moderator) 
		\`!<BotName> suggestions\`
		
		Accepting suggestions (req: moderator) 
		\`!<BotName> approveFact <SuggestionID>\`
		
		Declining suggestions (req: moderator) 
		\`!<BotName> declineFact <SuggestionID>\``;
	}
};

/**
 * checkAuth
 * 
 * Based on the role.json, returns whether a user is authorized to use a command
 * 
 * @param {string} userID users discord unique key
 * @param {string} serverID
 * 
 * @return {Promise} returns true if passes, rejects false if failure
 */
exports.checkAuth = (userID, serverID, botName, command, msg) => {
	return new Promise(async (resolve, reject) => {
		var newErr;
		var serverInfo;
		var userInfo;
		var botInfo;

		try {

			if (!userID || !serverID || !botName) {
				newErr = new Error(`Command ${command} is missing arguments`);
				newErr.display = false;
				newErr.debug = true;
				throw newErr;
			}

			// If the command isn't passed, then the user 
			if (command !== null && command !== undefined && command !== 'undefined') {
				var reqRole = (botName === 'factbot') ? roles['factbot'][command] : roles['other'][command]; // Check the required role

				switch (reqRole) {
					case 'owner':
						if (msg.member.hasPermission('MANAGE_GUILD'))
							resolve(true);
						else {
							newErr = new Error('You don\'t have permission to do that, you have to be able to manage the server');
							newErr.display = true;
							newErr.debug = false;
							throw newErr;
						}
						return;
					case 'admin':
						serverInfo = await Other.findServer(serverID);
						botInfo = await Bot.findBot(botName, serverInfo.ID);
						userInfo = await Other.findUser(serverInfo.ID, userID);
						await Admin.checkAdminStatus(userInfo.ID, botInfo.ID); // Make user passed user is bot admin
						resolve(true);
						return;
					case 'sub':
						serverInfo = await Other.findServer(serverID);
						botInfo = await Bot.findBot(botName, serverInfo.ID);
						userInfo = await Other.findUser(serverInfo.ID, userID);
						await Subscriber.checkSubscriberStatus(msg, userInfo.ID, botInfo.ID); // Make sure user is subscribed to bot

						resolve(true);
						return;
					case 'any':
						resolve(true); // Always succeed
						return;
					default:
						newErr = new Error(`Command ${command} is not valid`);
						newErr.display = true;
						newErr.debug = false;
						throw newErr;
				}
			} else {
				// Used for triggering a factbot fact
				serverInfo = await Other.findServer(serverID);
				botInfo = await Bot.findBot(botName, serverInfo.ID);
				userInfo = await Other.findUser(serverInfo.ID, userID);
				await Subscriber.checkSubscriberStatus(msg, userInfo.ID, botInfo.ID); // Must be a subscriber to trigger 
				resolve(true);
			}
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};