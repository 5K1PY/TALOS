const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'set',
			aliases: [],
			group: 'competitions',
			memberName: 'set',
            description: 'Sets attribute for competition.',
            args: [
                {
                    key: 'competitionName',
                    prompt: 'What competiton would you like to change?',
                    type: 'string',
                },
                {
                    key: 'name',
                    prompt: 'What attribute do you want to change?',
                    type: 'string',
                },
                {
                    key: 'value',
                    prompt: 'When is the attributes\'s new value?',
                    type: 'string',
                },
            ],
            userPermissions: [
                'SEND_MESSAGES',
                'MANAGE_ROLES'
            ],
		});
    }

    run (message, {competitionName, name, value}) {
        name = name.toLowerCase();
        const attributes = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_attributes.json`, 'utf-8'));
        let competitions = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, 'utf-8'));
        let competion = competitions.find(comp => comp.name.toLowerCase() === competitionName.toLowerCase());
        
        if (competion === undefined) {
            return message.say(`<@${message.author.id}> Unknown competition: ${competitionName}.`);
        }

        // finding attribute by its prefix
        let new_name = undefined;
        for (const attribute in attributes) {
            if (attribute.toLowerCase().startsWith(name)) {
                if (new_name === undefined) {
                    new_name = attribute;
                } else {
                    return message.say(`<@${message.author.id}> Duplicit attributes for: ${name}.`);
                }
            }
        }

        if (new_name === undefined) {
            return message.say(`<@${message.author.id}> Unknown attribute: ${name}.`);
        } else if (attributes[new_name]["changable"] === false) {
            return message.say(`<@${message.author.id}> Immutable attribute: ${new_name}.`);
        } else if (attributes[new_name]["check"] != undefined && value.match(attributes[new_name]["check"]) === null) {
            return message.say(`<@${message.author.id}> Invalid value: ${value}.`);
        } else {
            competion[new_name] = value;
            let jsonData = JSON.stringify(competitions);
            fs.writeFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, jsonData, 'utf-8');
            return message.say(`<@${message.author.id}> Attribute set.`);
        }
    }
};