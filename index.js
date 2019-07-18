const Discord = require('discord.js');
const client = new Discord.Client();
const envVars = require('./local.settings.json');


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.isMentioned(client.user)) {
		msg.reply('pong');
	} else if (msg.content === '!BugFact') {
		msg.channel.send(`${envVars.Values.noticeRole} Hello Everybody`);
	}
});

client.login(envVars.Values.clientID);