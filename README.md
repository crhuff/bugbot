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

How to use factbot

Server owner initialize `!factbot create <BotName> <MaxTimeSecondsBeforeTrigger> @Role [,<@Moderators>] | <@Moderator>`

Add moderators `!<BotName> addmoderator [,<NewModerator>] | <NewModerator>`

List moderators `!<BotName> listmoderators`

Delete moderators `!<BotName> deletemoderator <@Moderator>`

Edit max minutes before trigger `!<BotName> maxmime <MaxTimeMinutesBeforeTrigger>` 

Adding random facts if owner: `!<BotName> newFact "<Fact>"`

Triggering bot if no message since MaxTimeSecondsBeforeTrigger, send a random fact, if 0 disabled, otherwise whatever the trigger is, and only subscribers)

Subscribing to the bot `!<BotName> subscribe`

List Subscibers from the bot `!<BotName> listSubscribers`
Unsubscribe from the bot `!<BotName> unsubscribe`

Deleting the bot if owner `!<BotName> delete`

Listing facts if owner `!<BotName> list` Returns all facts with id's for reference

Editing facts if owner `!<BotName> editFact <ID> "<New String>"`

Deleting facts if owner `!<BotName> deleteFact <ID>`

Suggesting facts `!<BotName> suggestFact "<New String>"`

Reviewing suggestions if owner `!<BotName> suggestions`

Accepting suggestions if owner `!<BotName> approveFact <SuggestionID>`

Declining suggestions if owner `!<BotName> declineFact <SuggestionID>`
