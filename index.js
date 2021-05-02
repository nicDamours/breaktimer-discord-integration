const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

const express = require('express')
const app = express()
const port = 3000

client.commands = new Discord.Collection();

client.once('ready', () => {
    console.log('BadlyDrawnGarlic is here to fuck bitches and give them bad breath');
});

app.listen(port, () => {
    console.log(`discord express app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    const channel = client.channels.cache.find(channel => channel.name === "general");
    if(channel) {
        channel.send('test');
    }

    res.send();
})

//Keep the client.login as the last line in the file
client.login(config.token);
