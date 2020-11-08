const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'remcompetition',
			aliases: [],
			group: 'competitions',
			memberName: 'remcompetition',
            description: 'Removes competiton.',
            args: [
                {
                    key: 'competitionName',
                    prompt: 'What competiton would you like to remove?',
                    type: 'string',
                },
            ],
            userPermissions: [
                'SEND_MESSAGES',
                'MANAGE_ROLES'
            ],
		});
    }

    run (message, {competitionName}) {
        let competitions = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, 'utf-8'));
        
        let competition = competitions.find(comp => comp.name === competitionName);
        if (competition === undefined) { 
            message.say(`<@${message.author.id}> Unknown competition.`);
        } else {
            competitions = competitions.filter(comp => comp.name != competitionName);
            message.guild.roles.cache.find(comp => comp.name === competitionName).delete();

            let jsonData = JSON.stringify(competitions);
            fs.writeFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, jsonData, 'utf-8');
            message.say(`<@${message.author.id}> Competition removed.`);
        }
    }
};