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
Implement server owner setup (!factbot create <Name> <Trigger> <Moderators> <MaxTimeSecondsBeforeTrigger>)
Implement adding random facts (if owner: !factbot <Name> newFact <Fact> )
Implement triggering bot (if no message since MaxTimeSecondsBeforeTrigger, send a random fact, if 0 disabled, otherwise whatever the trigger is, and only subscribers)
Implement subscribing to the bot (!factbot subscribe <Name>)
Implement deleting the bot (if owner !factbot <Name> delete)
Implement listing facts (if owner !factbot <Name> list) Returns all facts with id's for reference
Implement editing facts (if owner !factbot <Name> edit <ID> "<New String>")
Implement deleting facts (if owner !factbot <Name> delete <ID>)
Implement suggesting facts (!factbot <Name> suggest "<New String>")
Implement reviewing suggestions (if owner !factbot <Name> suggestions)
Implement accepting suggestions (if owner !factbot <Name> approve <SuggestionID>)
Implement declining suggestions (if owner !factbot <Name> decline <SuggestionID>)
