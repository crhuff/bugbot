const Discord = require('discord.js'); // Required import to access discord API
const client = new Discord.Client(); // Connect to discord
const envVars = require('./local.settings.json').values; // Imports local.settings.json
const router = require('./server/router');
const Bot = require('./server/controllers/bot');
var { factBotID, debugUserID, clientID } = envVars; // Takes key/values from local.settings.json and returns them as a variable named itself

// Startup
//
// Set up all bot timers 
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	Bot.checkBotFacts(client);
	setInterval(() => {
		Bot.checkBotFacts(client);
	}, 60000);
	
});

// Routing
//
// Executes when any message is received
client.on('message', async msg => {
	var debugUser = (debugUserID) ? client.users.get(debugUserID) : null;
	// Generic outer try/catch to handle errors

	try {
		var returnMessage = await router.parseMessage(msg, client);
		if (returnMessage.messageType === 'channel') {
			msg.channel.send(returnMessage.text);
		} else if (returnMessage.messageType === 'dm') {
			var directUser = client.users.get(msg.author.id);
			directUser.send(returnMessage.text);
		} else if (returnMessage.messageType === 'reply') {
			msg.reply(returnMessage.text);
		} else {
			debugUser.send(JSON.stringify(returnMessage));
		}
	} catch (err) {
		// If a debug user is specified then it will send a print out of the error to them
		// Have to make sure the author isnt factbot or else it'll keep spamming messages
		if (msg.author.id !== factBotID) {
			if (err.display) {
				msg.reply(err.message);
			} else if ((msg.author.id !== factBotID) && err.debug) {
				if (debugUser)
					debugUser.send('There is an error with BugBot: ' + String(err));
	
				console.log(err); // At a minimum, if there is no debugUser, it will still print to console, consider adding logging to DB
			}
		}	
	}
	// if (msg.isMentioned(client.user)) {
	// 	msg.reply('pong');
	// } else if (msg.content === '!BugFact') {
	// 	msg.channel.send(`${envVars.Values.noticeRole} Hello Everybody`);
	// }
});


// Login
//
// Submits users login token for bot, edit in local.settings.json
client.login(clientID);