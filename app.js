const { Client, Collection, MessageEmbed} = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client();

const dtdd = axios.create({
	baseURL: 'https://www.doesthedogdie.com',
	headers: {
		'X-API-KEY': process.env.DTDD,
		'Accept': 'application/json'
	}
});

// When the client is ready
client.on('ready', async () => {
	// Logs a list of servers the bot is on
	console.log('Connected');
	const total = client.guilds.cache.size;
	console.log(`Total Servers: ${total}`);
	await client.user.setPresence({ activity: { name: `CW | ${process.env.PREFIX}[media-title] | Currently in ${total} servers` }, status: 'online' });
});

client.on('guildCreate', async guild => {
	const total = client.guilds.cache.size;
	await client.user.setPresence({ activity: { name: `CW | ${process.env.PREFIX}[media-title] | Currently in ${total} servers` }, status: 'online' });
});

client.on('guildDelete', async guild => {
	const total = client.guilds.cache.size;
	await client.user.setPresence({ activity: { name: `CW | ${process.env.PREFIX}[media-title] | Currently in ${total} servers` }, status: 'online' });
});

client.on('message', async message => {
	// Ignore messages by a bot
	if (message.author.bot) return;

	// Removes all @ mentions
	message.content = message.content.replace(/<@!?(\d+)>/g, '');
	message.content = message.content.trim();

	// If the message does not start with the prefix, ignore
	if (!message.content.startsWith(process.env.PREFIX)) return;

	// Get the command as well as the command arguments
	const args = message.content.slice(process.env.PREFIX.length);

	// If no arguments are provided, leave
	if (args === "") {
		let reply = 'No arguments provided.\n';
		reply += `Usage: ${process.env.PREFIX}[media-title]`;
		return message.channel.send(reply);
	}

	let data, warnings = [];
	let desc = '';

	try {
		let response = await dtdd.get('/search', {
			params: {
				q: args
			}
		});

		if (response.data.items.length === 0) {
			await message.reply('No results found.');

			return;
		}

		let id = response.data.items[0].id;
		response = await dtdd.get(`/media/${id}`);
		data = response.data;
	} catch (e) {
		console.error(e);
		return;
	}

	data.topicItemStats.sort((a,b) => b.yesSum - a.yesSum);

	for (const topic of data.topicItemStats) {
		if (topic.yesSum > 0) {
			if (!warnings.includes(topic.topic.TopicCategory.name))
				warnings.push(topic.topic.TopicCategory.name);
		}
	}

	message.channel.send(warnings.join('\n'));
});

client.login(process.env.TOKEN);