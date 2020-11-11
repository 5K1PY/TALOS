const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'addcompetition',
			aliases: [],
			group: 'competitions',
			memberName: 'addcompetition',
            description: 'Creates new competiton.',
            args: [
                {
                    key: 'competitionName',
                    prompt: 'What is the name for new competiton?',
                    type: 'string',
                    validate: name => (name[0] != '-'),
                },
                {
                    key: 'category',
                    prompt: 'What is the category for new competiton?',
                    type: 'string',
                },
                {
                    key: 'colour',
                    prompt: 'What is the colour of new competiton?',
                    type: 'string',
                },
                {
                    key: 'web',
                    prompt: 'What is the web of new competiton?',
                    type: 'string',
                },
            ],
            userPermissions: [
                'SEND_MESSAGES',
                'MANAGE_ROLES'
            ],
		});
    }

    async run (message, {competitionName, category, colour, web}) {
        let competitions = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, 'utf-8'));
        let competition = competitions.find(comp => comp.name.toLowerCase() === competitionName.toLowerCase());
        if (competition != undefined) {
            message.say(`<@${message.author.id}> Competition with same name already created.`);
        } else {
            let role = await message.guild.roles.create({
                data: {
                    name: competitionName,
                    color: colour.toUpperCase(),
                    mentionable: true,
                }
            });
            competitions.push({
                "name": competitionName,
                "role": role.id,
                "category": category,
                "web": web
            });
            let jsonData = JSON.stringify(competitions);
            fs.writeFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, jsonData, 'utf-8')
            message.say(`<@${message.author.id}> Competition created.`);
        }
    }
};