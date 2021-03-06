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

client.on('ready', async () => {
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
	if (message.author.bot) return;

	message.content = message.content.replace(/<@!?(\d+)>/g, '');
	message.content = message.content.trim();

	if (!message.content.startsWith(process.env.PREFIX)) return;

	const args = message.content.slice(process.env.PREFIX.length).trim();

	if (args === "") {
		let reply = 'No arguments provided.\n';
		reply += `Usage: ${process.env.PREFIX}[media-title]`;
		return message.channel.send(reply);
	}

	let data, name, id, year, media_type, warnings = [];

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

		name = response.data.items[0].name;
		id = response.data.items[0].id;
		year = response.data.items[0].releaseYear;
		media_type = response.data.items[0].itemType.name;

		response = await dtdd.get(`/media/${id}`);
		data = response.data;
	} catch (e) {
		console.error(e);
		return;
	}

	data.topicItemStats.sort((a,b) => b.yesSum - a.yesSum);

	for (const topic of data.topicItemStats) {
		if (topic.isYes === 1 && topic.topic.isSensitive) {
			if (!warnings.includes(topic.topic.TopicCategory.name))
				warnings.push(topic.topic.TopicCategory.name);
		}
	}

	if (warnings.length === 0) {
		warnings.push('Seems safe!')
	}

	const embed = new MessageEmbed()
		.setTitle(`CW: ${name} (${year}) | ${media_type}`)
		.setDescription(warnings.join('\n') + `\n\n[See more](https://www.doesthedogdie.com/media/${id})`);
		
	message.channel.send(embed);
});

client.login(process.env.TOKEN);