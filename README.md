# bugbot

To run bugbot (or a local version), follow the instructions here: https://www.howtogeek.com/364225/how-to-make-your-own-discord-bot/

The bot runs off a local.settings.json file, so create that in the root with the structure: 


{
    "Values": {
        "clientID": "yourID",
        "noticeRole": "yourRoleToMention"
    }
}


To retrieve "clientID", go to Discord's bot portal, create a new application, copy the Client ID into this field. Then continue by clicking the "Bot" tab and adding a new bot named whatever you want. Add the bot to whichever server you choose.

To get the noticeRole value, in Discord on your server, type \@<yourrolehere> and copy and paste the full value here

Run `npm i` to install all necessary dependencies.

Run `nodemon --inspect index.js` to start the bugbot.


Current Goals:

Maintain a local db that contains settings and data for the bot

Implement server owner setup (`!factbot create <BotName> <Moderators> <MaxTimeSecondsBeforeTrigger>`)

Implement adding random facts (if owner: `!<BotName> newFact <Fact>` )

Implement triggering bot (if no message since MaxTimeSecondsBeforeTrigger, send a random fact, if 0 disabled, otherwise whatever the trigger is, and only subscribers)

Implement subscribing to the bot (`!<BotName> subscribe`)

Implement deleting the bot (if owner `!<BotName> delete`)

Implement listing facts (if owner `!<BotName> list`) Returns all facts with id's for reference

Implement editing facts (if owner `!<BotName> edit <ID> "<New String>"`)

Implement deleting facts (if owner `!<BotName> deletefact <ID>`)

Implement suggesting facts (`!<BotName> suggest "<New String>"`)

Implement reviewing suggestions (if owner `!<BotName> suggestions`)

Implement accepting suggestions (if owner `!<BotName> approve <SuggestionID>`)

Implement declining suggestions (if owner `!<BotName> decline <SuggestionID>`)
