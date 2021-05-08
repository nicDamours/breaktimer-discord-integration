const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const DiscordGateway = require("./gateway/discord.gateway.js");

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const jsonParser = bodyParser.json()

client.commands = new Discord.Collection();

client.once('ready', () => {
    console.log('Breaktimer integration bot ready to roll ! ');
});

app.patch('/nickname/:guild', jsonParser, async (req, res) => {
    const {guild} = req.params;
    const {suffix} = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token) {
        throw new Error("Couldn't fetch request token, abording.");
    }
    const discordGateway = new DiscordGateway(token);

    try {
        const [currentUserId, currentGuild] = await Promise.all([
            discordGateway.getCurrentUserId(),
            client.guilds.fetch(guild)
        ]);

        if (currentGuild && currentUserId) {
            await currentGuild.members.fetch();
            const givenGuildMember = currentGuild.members.cache.find(item => item.user.id === `${currentUserId}`);

            if (givenGuildMember) {
                let newDisplayName;
                if (!givenGuildMember.displayName.includes(suffix)) {
                    newDisplayName = `${givenGuildMember.displayName}${suffix}`;
                } else {
                    newDisplayName = givenGuildMember.displayName.replace(suffix, "");
                }

                await givenGuildMember.setNickname(newDisplayName);

                res.json({success: true});
            } else {
                res.status(404).json({success: false, message: "could not find user"});
            }
        } else {
            res.status(404).json({success: false, message: "Could not fetch user id or guild."});
        }
    } catch (e) {
        res.status(400).json({success: false, message: e.message, path: e.path});
    }
});


app.listen(port, () => {
    console.log(`discord express app listening at http://localhost:${port}`)
})

//Keep the client.login as the last line in the file
client.login(config.token);
